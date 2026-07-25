import { AuthService as CoreAuthService } from '@/core/auth/service';
import Database from '@/config/database';

/**
 * Module-level wrapper around the core AuthService.
 * Provides a clean API for the auth module controllers
 * while delegating all business logic to the core service.
 */
export class AuthModuleService {
  constructor(private authService: CoreAuthService) {}

  /**
   * Authenticate user with email and password.
   * Includes account lockout and audit logging.
   */
  async login(
    credentials: { email: string; password: string },
    ipAddress?: string,
    userAgent?: string
  ) {
    return this.authService.login(credentials, ipAddress, userAgent);
  }

  /**
   * Create a new user account with password policy validation.
   */
  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId?: string;
  }) {
    return this.authService.createUser(userData);
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  async refresh(refreshToken: string, ipAddress?: string) {
    return this.authService.refresh(refreshToken, ipAddress);
  }

  /**
   * Logout user by invalidating refresh token.
   */
  async logout(userId: string, refreshToken: string, ipAddress?: string) {
    return this.authService.logout(userId, refreshToken, ipAddress);
  }

  /**
   * Change user password with policy validation and history check.
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    return this.authService.changePassword(userId, currentPassword, newPassword);
  }

  /**
   * Get user profile data from database.
   */
  async getMe(userId: string) {
    try {
      const db = Database.getInstance();
      const result = await db.query(
        `SELECT id, email, first_name, last_name, role, 
                department_id, email_verified, last_login, created_at
         FROM users WHERE id = $1`,
        [userId]
      );

      if (!result.rows[0]) return null;

      const user = result.rows[0];
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        departmentId: user.department_id,
        emailVerified: user.email_verified,
        lastLogin: user.last_login,
        memberSince: user.created_at,
      };
    } catch {
      return null;
    }
  }

  /**
   * Generate email verification token.
   */
  async generateEmailVerification(userId: string) {
    return this.authService.generateEmailVerification(userId);
  }

  /**
   * Verify email using token.
   */
  async verifyEmail(token: string) {
    return this.authService.verifyEmail(token);
  }

  /**
   * Check if email is verified.
   */
  async isEmailVerified(userId: string) {
    return this.authService.isEmailVerified(userId);
  }

  /**
   * Get all active sessions for user.
   */
  async getUserSessions(userId: string, currentToken?: string) {
    return this.authService.getUserSessions(userId, currentToken);
  }

  /**
   * Revoke a specific session.
   */
  async revokeSession(userId: string, sessionId: string) {
    return this.authService.revokeSession(userId, sessionId);
  }

  /**
   * Revoke all sessions except current.
   */
  async revokeOtherSessions(userId: string, currentToken: string) {
    return this.authService.revokeOtherSessions(userId, currentToken);
  }

  /**
   * Get account lock status.
   */
  async getAccountLockStatus(userId: string) {
    return this.authService.getAccountLockStatus(userId);
  }

  /**
   * Validate password against policy.
   */
  validatePassword(password: string) {
    return this.authService.validatePassword(password);
  }

  /**
   * Get password policy config.
   */
  getPasswordPolicy() {
    return this.authService.getPasswordPolicy();
  }

  /**
   * Get lockout config.
   */
  getLockoutConfig() {
    return this.authService.getLockoutConfig();
  }

  /**
   * Get auth audit logs for user.
   */
  async getUserAuditLogs(userId: string, limit?: number, offset?: number) {
    return this.authService.getUserAuditLogs(userId, limit, offset);
  }

  /**
   * Admin: lock a user account.
   */
  async adminLockAccount(userId: string, durationMinutes?: number) {
    return this.authService.adminLockAccount(userId, durationMinutes);
  }

  /**
   * Admin: unlock a user account.
   */
  async adminUnlockAccount(userId: string) {
    return this.authService.adminUnlockAccount(userId);
  }
}
