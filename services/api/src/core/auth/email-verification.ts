import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Database from '@/config/database';
import { config } from '@/config';
import { logger } from '@/utils/logger';

/**
 * Email verification token configuration.
 */
export interface EmailVerificationConfig {
  tokenExpiryMinutes: number;
  tokenLength: number; // bytes for random token
}

const DEFAULT_CONFIG: EmailVerificationConfig = {
  tokenExpiryMinutes: 1440, // 24 hours
  tokenLength: 32,
};

export interface VerificationTokenResult {
  token: string;
  expiresAt: Date;
}

export interface VerificationStatus {
  verified: boolean;
  verifiedAt?: Date;
  email?: string;
}

export class EmailVerificationService {
  private db: Database;
  private config: EmailVerificationConfig;

  constructor(db: Database, config?: Partial<EmailVerificationConfig>) {
    this.db = db;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generate a verification token for a user and store it.
   * Returns the raw token and its expiry.
   */
  public async generateToken(userId: string, email: string): Promise<VerificationTokenResult> {
    try {
      // Generate a random token
      const rawToken = crypto.randomBytes(this.config.tokenLength).toString('hex');
      const expiresAt = new Date(Date.now() + this.config.tokenExpiryMinutes * 60 * 1000);

      // Invalidate any previous tokens for this user
      await this.db.query(
        `DELETE FROM email_verification_tokens WHERE user_id = $1`,
        [userId]
      );

      // Store the token (hashed for security - though we store raw for simplicity,
      // in production you'd store a hash of the token)
      await this.db.query(
        `INSERT INTO email_verification_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [userId, rawToken, expiresAt]
      );

      logger.info(`Email verification token generated for user ${userId}`);

      return {
        token: rawToken,
        expiresAt,
      };
    } catch (error) {
      logger.error('Failed to generate verification token', error);
      throw error;
    }
  }

  /**
   * Generate a signed JWT verification link.
   * This can be sent via email and clicked by the user.
   */
  public generateSignedVerificationLink(userId: string, email: string): {
    link: string;
    token: string;
    signedToken: string;
  } {
    const { token } = this.generateTokenSync(userId, email);

    // Create a signed JWT that includes the verification token
    const signedToken = jwt.sign(
      {
        sub: userId,
        email,
        purpose: 'email_verification',
        verificationToken: token,
      },
      config.jwt.secret as string,
      { expiresIn: `${this.config.tokenExpiryMinutes}m` }
    );

    const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${signedToken}`;

    return { link, token, signedToken };
  }

  /**
   * Verify an email using a verification token.
   */
  public async verifyEmail(token: string): Promise<VerificationStatus> {
    try {
      // Find the token
      const result = await this.db.query(
        `SELECT evt.user_id, evt.token, evt.expires_at, evt.verified_at, u.email
         FROM email_verification_tokens evt
         JOIN users u ON u.id = evt.user_id
         WHERE evt.token = $1 AND evt.verified_at IS NULL`,
        [token]
      );

      if (!result.rows[0]) {
        // Token not found or already verified
        // Try to check via signed JWT
        return this.verifySignedToken(token);
      }

      const row = result.rows[0];

      // Check expiry
      if (new Date() > new Date(row.expires_at)) {
        return { verified: false };
      }

      // Mark as verified
      await this.db.query(
        `UPDATE email_verification_tokens SET verified_at = CURRENT_TIMESTAMP 
         WHERE token = $1`,
        [token]
      );

      // Update user record
      await this.db.query(
        `UPDATE users SET email_verified = true WHERE id = $1`,
        [row.user_id]
      );

      logger.info(`Email verified for user ${row.user_id}`);

      return {
        verified: true,
        verifiedAt: new Date(),
        email: row.email,
      };
    } catch (error) {
      logger.error('Email verification failed', error);
      return { verified: false };
    }
  }

  /**
   * Verify a signed JWT verification token (from email link).
   */
  public async verifySignedToken(signedToken: string): Promise<VerificationStatus> {
    try {
      const decoded = jwt.verify(signedToken, config.jwt.secret as string) as any;

      if (decoded.purpose !== 'email_verification') {
        return { verified: false };
      }

      // Verify through the raw token
      const result = await this.db.query(
        `SELECT evt.user_id, evt.expires_at, u.email
         FROM email_verification_tokens evt
         JOIN users u ON u.id = evt.user_id
         WHERE evt.user_id = $1 AND evt.verified_at IS NULL AND u.email_verified = false`,
        [decoded.sub]
      );

      if (!result.rows[0]) {
        // Maybe already verified
        const userCheck = await this.db.query(
          'SELECT email_verified, email FROM users WHERE id = $1',
          [decoded.sub]
        );
        if (userCheck.rows[0]?.email_verified) {
          return { verified: true, email: userCheck.rows[0].email };
        }
        return { verified: false };
      }

      // Mark as verified
      await this.db.query(
        `UPDATE email_verification_tokens SET verified_at = CURRENT_TIMESTAMP 
         WHERE user_id = $1`,
        [decoded.sub]
      );

      await this.db.query(
        `UPDATE users SET email_verified = true WHERE id = $1`,
        [decoded.sub]
      );

      return { verified: true, email: result.rows[0].email };
    } catch (error) {
      return { verified: false };
    }
  }

  /**
   * Check if a user's email is verified.
   */
  public async isEmailVerified(userId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'SELECT email_verified FROM users WHERE id = $1',
        [userId]
      );
      return result.rows[0]?.email_verified || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Resend verification token (invalidates previous ones).
   */
  public async resendVerification(userId: string, email: string): Promise<VerificationTokenResult> {
    return this.generateToken(userId, email);
  }

  /**
   * Clean up expired tokens (can be run as a cron job).
   */
  public async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await this.db.query(
        `DELETE FROM email_verification_tokens 
         WHERE expires_at < CURRENT_TIMESTAMP AND verified_at IS NULL`
      );
      return result.rowCount || 0;
    } catch (error) {
      logger.error('Failed to cleanup expired verification tokens', error);
      return 0;
    }
  }

  /**
   * Synchronous token generation for use in link generation.
   * This is NOT stored in DB; use generateToken() for persisted tokens.
   */
  private generateTokenSync(userId: string, email: string): { token: string } {
    const rawToken = crypto.randomBytes(this.config.tokenLength).toString('hex');
    return { token: rawToken };
  }
}

export default EmailVerificationService;
