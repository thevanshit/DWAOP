import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import Database from '@/config/database';
import { RBACService } from '../rbac/service';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  departmentId?: string;
  attributes: Record<string, any>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  attributes: Record<string, any>;
}

export class AuthService {
  private db: Database;
  private rbac: RBACService;

  constructor(db: Database, rbac: RBACService) {
    this.db = db;
    this.rbac = rbac;
  }

  /**
   * Authenticate user with email and password
   */
  public async login(credentials: LoginCredentials): Promise<AuthTokens & { user: AuthUser }> {
    try {
      // Find user by email
      const userResult = await this.db.query(
        `SELECT id, email, password_hash, first_name, last_name, role, 
                department_id, attributes, is_active, email_verified 
         FROM users WHERE email = $1`,
        [credentials.email.toLowerCase()]
      );

      if (!userResult.rows[0]) {
        throw new Error('Invalid credentials');
      }

      const user = userResult.rows[0];

      // Check if user is active
      if (!user.is_active) {
        throw new Error('Account is disabled');
      }

      // Check if email is verified
      if (!user.email_verified) {
        throw new Error('Email not verified');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Get user permissions
      const permissions = await this.rbac.getUserPermissions(user.id);

      // Create JWT payload
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: Array.from(permissions),
        attributes: user.attributes || {}
      };

      // Generate tokens
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      // Update last login
      await this.updateLastLogin(user.id);

      // Store refresh token (optional - for token revocation)
      await this.storeRefreshToken(user.id, refreshToken);

      logger.info(`User logged in: ${user.email}`);

      return {
        accessToken,
        refreshToken,
        expiresIn: 3600, // 1 hour
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          departmentId: user.department_id,
          attributes: user.attributes || {}
        }
      };
    } catch (error) {
      logger.error('Login failed', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  public async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload;

      // Check if refresh token is still valid (stored in database)
      const isValid = await this.validateRefreshToken(decoded.userId, refreshToken);
      if (!isValid) {
        throw new Error('Invalid refresh token');
      }

      // Get updated user permissions
      const permissions = await this.rbac.getUserPermissions(decoded.userId);

      // Create new payload
      const payload: JwtPayload = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        permissions: Array.from(permissions),
        attributes: decoded.attributes
      };

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(payload);
      const newRefreshToken = this.generateRefreshToken(payload);

      // Store new refresh token
      await this.storeRefreshToken(decoded.userId, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600
      };
    } catch (error) {
      logger.error('Token refresh failed', error);
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  public async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      // Remove refresh token from database
      await this.removeRefreshToken(userId, refreshToken);
      logger.info(`User logged out: ${userId}`);
    } catch (error) {
      logger.error('Logout failed', error);
      throw error;
    }
  }

  /**
   * Verify JWT token and return payload
   */
  public verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Create new user account
   */
  public async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId?: string;
    attributes?: Record<string, any>;
  }): Promise<AuthUser> {
    try {
      // Check if user already exists
      const existingUser = await this.db.query(
        'SELECT id FROM users WHERE email = $1',
        [userData.email.toLowerCase()]
      );

      if (existingUser.rows[0]) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Create user
      const result = await this.db.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, 
                           department_id, attributes, is_active, email_verified, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, email, first_name, last_name, role, department_id, attributes`,
        [
          userData.email.toLowerCase(),
          passwordHash,
          userData.firstName,
          userData.lastName,
          userData.role,
          userData.departmentId,
          JSON.stringify(userData.attributes || {}),
          true, // is_active
          false, // email_verified
          new Date(),
          new Date()
        ]
      );

      const user = result.rows[0];

      logger.info(`User created: ${user.email}`);

      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        departmentId: user.department_id,
        attributes: user.attributes || {}
      };
    } catch (error) {
      logger.error('User creation failed', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  public async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Get current password hash
      const result = await this.db.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [userId]
      );

      if (!result.rows[0]) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      // Update password
      await this.db.query(
        'UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3',
        [newPasswordHash, new Date(), userId]
      );

      // Invalidate all refresh tokens for this user
      await this.removeAllRefreshTokens(userId);

      logger.info(`Password changed for user: ${userId}`);
    } catch (error) {
      logger.error('Password change failed', error);
      throw error;
    }
  }

  /**
   * Generate access token
   */
  private generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: 'dwaop-platform',
      audience: 'dwaop-users'
    });
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: 'dwaop-platform',
      audience: 'dwaop-users'
    });
  }

  /**
   * Update user's last login timestamp
   */
  private async updateLastLogin(userId: string): Promise<void> {
    await this.db.query(
      'UPDATE users SET last_login = $1 WHERE id = $2',
      [new Date(), userId]
    );
  }

  /**
   * Store refresh token in database
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
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      ]
    );
  }

  /**
   * Validate refresh token
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
   * Remove refresh token
   */
  private async removeRefreshToken(userId: string, token: string): Promise<void> {
    await this.db.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1 AND token = $2',
      [userId, token]
    );
  }

  /**
   * Remove all refresh tokens for user
   */
  private async removeAllRefreshTokens(userId: string): Promise<void> {
    await this.db.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1',
      [userId]
    );
  }
}