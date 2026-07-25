import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import Database from '@/config/database';
import { RBACService } from '../rbac/service';
import { AccountLockout, LockoutConfig } from './account-lockout';
import { AuthAuditService } from './auth-audit';
import { PasswordPolicy, PasswordPolicyConfig, PasswordValidationResult } from './password-policy';
import { EmailVerificationService } from './email-verification';
import { SessionManager, SessionInfo } from './session-manager';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  departmentId?: string;
  emailVerified?: boolean;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  departmentId?: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
  warning?: string;
  passwordExpired?: boolean;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  private db: Database;
  private rbac: RBACService;
  public accountLockout: AccountLockout;
  public audit: AuthAuditService;
  public passwordPolicy: PasswordPolicy;
  public emailVerification: EmailVerificationService;
  public sessionManager: SessionManager;

  constructor(
    db: Database,
    rbacService: RBACService,
    lockoutConfig?: Partial<LockoutConfig>,
    passwordConfig?: Partial<PasswordPolicyConfig>
  ) {
    this.db = db;
    this.rbac = rbacService;
    this.accountLockout = new AccountLockout(db, lockoutConfig);
    this.audit = new AuthAuditService(db);
    this.passwordPolicy = new PasswordPolicy(db, passwordConfig);
    this.emailVerification = new EmailVerificationService(db);
    this.sessionManager = new SessionManager(db);
  }

  // ──────────────────────────────────────────────
  //  TOKEN OPERATIONS
  // ──────────────────────────────────────────────

  /**
   * Verify access token and return decoded payload.
   */
  public verifyToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret as string) as JwtPayload;
  }

  /**
   * Generate a new access token.
   */
  public generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret as string, {
      expiresIn: config.jwt.expiresIn as any,
      issuer: 'deptwp-platform',
      audience: 'deptwp-users',
    });
  }

  /**
   * Generate a new refresh token.
   */
  public generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret as string, {
      expiresIn: config.jwt.refreshExpiresIn as any,
      issuer: 'deptwp-platform',
      audience: 'deptwp-users',
    });
  }

  // ──────────────────────────────────────────────
  //  AUTHENTICATION FLOW
  // ──────────────────────────────────────────────

  /**
   * Authenticate user with email and password.
   * Incorporates: account lockout, audit logging, password expiry check.
   */
  public async login(
    credentials: { email: string; password: string },
    ipAddress?: string,
    userAgent?: string
  ): Promise<LoginResult> {
    try {
      const email = credentials.email.toLowerCase();
      const userResult = await this.db.query(
        `SELECT id, email, password_hash, first_name, last_name, role,
                department_id, is_active, email_verified, failed_login_attempts, locked_until
         FROM users WHERE email = $1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        await this.audit.logLoginFailed(email, 'user_not_found', ipAddress, userAgent);
        throw new Error('Invalid email or password');
      }

      const user = userResult.rows[0];

      // Check account lockout
      const lockStatus = await this.accountLockout.getLockStatus(user.id);
      if (lockStatus.locked) {
        await this.audit.logLoginFailed(email, 'account_locked', ipAddress, userAgent);
        throw new Error(
          `Account is temporarily locked. Try again after ${Math.ceil(
            (lockStatus.lockedUntil!.getTime() - Date.now()) / 60000
          )} minutes.`
        );
      }

      if (!user.is_active) {
        await this.audit.logLoginFailed(email, 'account_disabled', ipAddress, userAgent);
        throw new Error('Account is disabled. Contact an administrator.');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
      if (!isValidPassword) {
        // Record failed attempt
        await this.accountLockout.recordFailedAttempt(user.id, ipAddress || 'unknown', userAgent);
        await this.audit.logLoginFailed(email, 'invalid_password', ipAddress, userAgent);

        // Get updated lock status to inform user
        const updatedStatus = await this.accountLockout.getLockStatus(user.id);
        if (updatedStatus.locked) {
          throw new Error(
            `Account locked due to too many failed attempts. Try again after ${Math.ceil(
              (updatedStatus.lockedUntil!.getTime() - Date.now()) / 60000
            )} minutes.`
          );
        }

        throw new Error(`Invalid email or password. ${updatedStatus.remainingAttempts} attempt(s) remaining.`);
      }

      // Record successful login
      await this.accountLockout.recordSuccessfulAttempt(user.id, ipAddress || 'unknown', userAgent);
      await this.audit.logLoginSuccess(user.id, user.email, user.role, ipAddress, userAgent);

      // Update last login
      await this.updateLastLogin(user.id);

      // Check password expiry
      const isPasswordExpired = await this.passwordPolicy.isPasswordExpired(user.id);

      // Get user permissions
      const permissions = await this.rbac.getUserPermissions(user.id);

      // Create JWT payload
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: Array.from(permissions),
        departmentId: user.department_id,
      };

      // Generate tokens
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      // Store refresh token
      await this.storeRefreshToken(user.id, refreshToken);

      logger.info(`User logged in: ${user.email}`);

      const result: LoginResult = {
        accessToken,
        refreshToken,
        expiresIn: 3600,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          departmentId: user.department_id,
          emailVerified: user.email_verified,
        },
      };

      // Append warning if password is expired
      if (isPasswordExpired) {
        (result as any).warning = 'Your password has expired. Please change it.';
        (result as any).passwordExpired = true;
      }

      return result;
    } catch (error) {
      if (error instanceof Error && (
        error.message.includes('locked') ||
        error.message.includes('Invalid email') ||
        error.message.includes('disabled')
      )) {
        throw error;
      }
      logger.error('Login failed', error);
      throw new Error('Authentication failed');
    }
  }

  /**
   * Refresh access token using a valid refresh token.
   * Implements token rotation: invalidates old token on use.
   */
  public async refresh(
    refreshToken: string,
    ipAddress?: string
  ): Promise<RefreshResult> {
    try {
      // Verify refresh token signature
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret as string
      ) as JwtPayload;

      // Check if token exists in database and is valid
      const isValid = await this.validateRefreshToken(decoded.userId, refreshToken);
      if (!isValid) {
        // Possible token reuse attack — revoke all tokens for this user
        logger.warn(`Suspicious token reuse detected for user ${decoded.userId}`);
        await this.sessionManager.revokeAllSessions(decoded.userId);
        await this.audit.log({
          eventType: 'SESSION_REVOKED',
          userId: decoded.userId,
          email: decoded.email,
          ipAddress,
          details: { reason: 'suspicious_token_reuse' },
          severity: 'warning',
        });
        throw new Error('Invalid refresh token');
      }

      // Get current permissions
      const permissions = await this.rbac.getUserPermissions(decoded.userId);

      // Create new payload
      const payload: JwtPayload = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        permissions: Array.from(permissions),
        departmentId: decoded.departmentId,
      };

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(payload);
      const newRefreshToken = this.generateRefreshToken(payload);

      // Rotate refresh token: remove old, store new
      await this.removeRefreshToken(decoded.userId, refreshToken);
      await this.storeRefreshToken(decoded.userId, newRefreshToken);

      await this.audit.log({
        eventType: 'TOKEN_REFRESH',
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        ipAddress,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      if (error instanceof Error && error.message === 'Invalid refresh token') {
        throw error;
      }
      logger.error('Token refresh failed', error);
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout user by invalidating the provided refresh token.
   */
  public async logout(
    userId: string,
    refreshToken: string,
    ipAddress?: string
  ): Promise<void> {
    try {
      if (refreshToken) {
        await this.removeRefreshToken(userId, refreshToken);
      }

      // Also revoke all other tokens for clean logout
      await this.sessionManager.revokeOtherSessions(userId, refreshToken);

      await this.audit.log({
        eventType: 'LOGOUT',
        userId,
        ipAddress,
      });

      logger.info(`User logged out: ${userId}`);
    } catch (error) {
      logger.error('Logout failed', error);
      throw error;
    }
  }

  // ──────────────────────────────────────────────
  //  USER MANAGEMENT
  // ──────────────────────────────────────────────

  /**
   * Create a new user account with password policy validation.
   */
  public async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId?: string;
  }): Promise<AuthUser> {
    try {
      // Validate password strength
      const passwordValidation = this.passwordPolicy.validate(userData.password);
      if (!passwordValidation.valid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join('; ')}`);
      }

      // Check if user exists
      const existingUser = await this.db.query(
        'SELECT id FROM users WHERE email = $1',
        [userData.email.toLowerCase()]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Create user
      const result = await this.db.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role,
                           department_id, is_active, email_verified,
                           password_changed_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, email, first_name, last_name, role, department_id, email_verified`,
        [
          userData.email.toLowerCase(),
          passwordHash,
          userData.firstName,
          userData.lastName,
          userData.role,
          userData.departmentId,
          true,  // is_active
          false, // email_verified
          new Date(), // password_changed_at
          new Date(),
          new Date(),
        ]
      );

      const user = result.rows[0];

      // Store in password history
      await this.passwordPolicy.storePasswordHash(user.id, passwordHash);

      await this.audit.log({
        eventType: 'ACCOUNT_CREATED',
        userId: user.id,
        email: user.email,
        role: user.role,
        details: { departmentId: userData.departmentId },
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        departmentId: user.department_id,
        emailVerified: user.email_verified,
      };
    } catch (error) {
      if (error instanceof Error && (
        error.message.startsWith('Password validation') ||
        error.message === 'User already exists'
      )) {
        throw error;
      }
      logger.error('User creation failed', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Change user password with policy validation and history check.
   */
  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get current password hash
      const result = await this.db.query(
        'SELECT password_hash, email FROM users WHERE id = $1',
        [userId]
      );

      if (!result.rows[0]) {
        throw new Error('User not found');
      }

      const { password_hash: currentHash, email } = result.rows[0];

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentHash);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password strength
      const passwordValidation = this.passwordPolicy.validate(newPassword);
      if (!passwordValidation.valid) {
        throw new Error(
          `Password validation failed: ${passwordValidation.errors.join('; ')}`
        );
      }

      // Check password reuse
      const isReused = await this.passwordPolicy.isPasswordReused(userId, newPassword);
      if (isReused) {
        throw new Error(
          `Password has been used recently. Please choose a different password.`
        );
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      // Update password
      await this.db.query(
        `UPDATE users 
         SET password_hash = $1, password_changed_at = $2, updated_at = $2 
         WHERE id = $3`,
        [newPasswordHash, new Date(), userId]
      );

      // Store in password history
      await this.passwordPolicy.storePasswordHash(userId, newPasswordHash);

      // Invalidate all refresh tokens (force re-login)
      const revokedCount = await this.sessionManager.revokeAllSessions(userId);

      await this.audit.log({
        eventType: 'PASSWORD_CHANGE',
        userId,
        email,
        details: { passwordStrength: passwordValidation.strength, sessionsRevoked: revokedCount },
      });

      logger.info(`Password changed for user: ${userId}`);

      return {
        success: true,
        message: 'Password changed successfully. Please log in again.',
      };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'User not found' ||
        error.message === 'Current password is incorrect' ||
        error.message.startsWith('Password validation') ||
        error.message.includes('recently')
      )) {
        throw error;
      }
      logger.error('Password change failed', error);
      throw new Error('Failed to change password');
    }
  }

  // ──────────────────────────────────────────────
  //  EMAIL VERIFICATION
  // ──────────────────────────────────────────────

  /**
   * Generate an email verification token for a user.
   */
  public async generateEmailVerification(userId: string): Promise<{
    token: string;
    expiresAt: Date;
    link?: string;
  }> {
    try {
      const userResult = await this.db.query(
        'SELECT email, email_verified FROM users WHERE id = $1',
        [userId]
      );

      if (!userResult.rows[0]) {
        throw new Error('User not found');
      }

      if (userResult.rows[0].email_verified) {
        throw new Error('Email is already verified');
      }

      const { email } = userResult.rows[0];
      const result = await this.emailVerification.generateToken(userId, email);

      // Generate signed link for email
      const signed = this.emailVerification.generateSignedVerificationLink(userId, email);

      await this.audit.log({
        eventType: 'EMAIL_VERIFICATION_SENT',
        userId,
        email,
      });

      return {
        token: result.token,
        expiresAt: result.expiresAt,
        link: signed.link,
      };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'User not found' ||
        error.message === 'Email is already verified'
      )) {
        throw error;
      }
      logger.error('Failed to generate email verification', error);
      throw new Error('Failed to generate verification token');
    }
  }

  /**
   * Verify email using a verification token.
   */
  public async verifyEmail(token: string): Promise<{
    verified: boolean;
    email?: string;
  }> {
    const status = await this.emailVerification.verifyEmail(token);

    if (status.verified && status.email) {
      // Find the user to audit
      const userResult = await this.db.query(
        'SELECT id FROM users WHERE email = $1',
        [status.email]
      );

      if (userResult.rows[0]) {
        await this.audit.log({
          eventType: 'EMAIL_VERIFIED',
          userId: userResult.rows[0].id,
          email: status.email,
        });
      }
    }

    return {
      verified: status.verified,
      email: status.email,
    };
  }

  /**
   * Check if a user's email is verified.
   */
  public async isEmailVerified(userId: string): Promise<boolean> {
    return this.emailVerification.isEmailVerified(userId);
  }

  // ──────────────────────────────────────────────
  //  SESSION MANAGEMENT
  // ──────────────────────────────────────────────

  /**
   * Get all active sessions for a user.
   */
  public async getUserSessions(
    userId: string,
    currentToken?: string
  ): Promise<SessionInfo[]> {
    return this.sessionManager.getUserSessions(userId, currentToken);
  }

  /**
   * Revoke a specific session.
   */
  public async revokeSession(
    userId: string,
    sessionId: string
  ): Promise<boolean> {
    const revoked = await this.sessionManager.revokeSession(userId, sessionId);
    if (revoked) {
      await this.audit.log({
        eventType: 'SESSION_REVOKED',
        userId,
        details: { sessionId, action: 'manual_revoke' },
      });
    }
    return revoked;
  }

  /**
   * Revoke all sessions except current.
   */
  public async revokeOtherSessions(
    userId: string,
    currentToken: string
  ): Promise<number> {
    const count = await this.sessionManager.revokeOtherSessions(userId, currentToken);
    if (count > 0) {
      await this.audit.log({
        eventType: 'SESSION_REVOKED',
        userId,
        details: { count, action: 'revoke_others' },
      });
    }
    return count;
  }

  // ──────────────────────────────────────────────
  //  ACCOUNT LOCKOUT MANAGEMENT (Admin)
  // ──────────────────────────────────────────────

  /**
   * Admin: lock a user account.
   */
  public async adminLockAccount(
    userId: string,
    durationMinutes?: number
  ): Promise<void> {
    await this.accountLockout.adminLockAccount(userId, durationMinutes);
    const userResult = await this.db.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );
    await this.audit.log({
      eventType: 'ACCOUNT_DEACTIVATED',
      userId,
      email: userResult.rows[0]?.email,
      details: { durationMinutes, action: 'admin_lock' },
      severity: 'warning',
    });
  }

  /**
   * Admin: unlock a user account.
   */
  public async adminUnlockAccount(userId: string): Promise<void> {
    await this.accountLockout.adminUnlockAccount(userId);
    const userResult = await this.db.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );
    await this.audit.log({
      eventType: 'ACCOUNT_UNLOCKED',
      userId,
      email: userResult.rows[0]?.email,
      details: { action: 'admin_unlock' },
    });
  }

  /**
   * Get lock status for a user.
   */
  public async getAccountLockStatus(userId: string) {
    return this.accountLockout.getLockStatus(userId);
  }

  // ──────────────────────────────────────────────
  //  PASSWORD VALIDATION UTILITY
  // ──────────────────────────────────────────────

  /**
   * Validate a password against the configured policy (no side effects).
   */
  public validatePassword(password: string): PasswordValidationResult {
    return this.passwordPolicy.validate(password);
  }

  /**
   * Get the current password policy configuration.
   */
  public getPasswordPolicy() {
    return this.passwordPolicy.getConfig();
  }

  /**
   * Get the current lockout configuration.
   */
  public getLockoutConfig() {
    return this.accountLockout.getConfig();
  }

  // ──────────────────────────────────────────────
  //  AUDIT LOG RETRIEVAL
  // ──────────────────────────────────────────────

  /**
   * Get auth audit logs for a user.
   */
  public async getUserAuditLogs(
    userId: string,
    limit?: number,
    offset?: number
  ) {
    return this.audit.getUserAuditLogs(userId, limit, offset);
  }

  // ──────────────────────────────────────────────
  //  INTERNAL HELPERS
  // ──────────────────────────────────────────────

  /**
   * Update user's last login timestamp.
   */
  private async updateLastLogin(userId: string): Promise<void> {
    await this.db.query(
      'UPDATE users SET last_login = $1 WHERE id = $2',
      [new Date(), userId]
    );
  }

  /**
   * Store refresh token in database.
   * Uses ON CONFLICT to replace existing token (one active session per user by default).
   */
  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    await this.db.query(
      `INSERT INTO refresh_tokens (user_id, token, created_at, expires_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
       token = EXCLUDED.token,
       created_at = EXCLUDED.created_at,
       expires_at = EXCLUDED.expires_at`,
      [
        userId,
        token,
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ]
    );
  }

  /**
   * Validate that a refresh token exists in the database and hasn't expired.
   */
  private async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'SELECT 1 FROM refresh_tokens WHERE user_id = $1 AND token = $2 AND expires_at > $3',
        [userId, token, new Date()]
      );
      return result.rows.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Remove a specific refresh token from storage.
   */
  private async removeRefreshToken(userId: string, token: string): Promise<void> {
    await this.db.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1 AND token = $2',
      [userId, token]
    );
  }
}
