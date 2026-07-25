import bcrypt from 'bcryptjs';
import Database from '@/config/database';
import { logger } from '@/utils/logger';

/**
 * Password policy configuration.
 * All values are configurable via the constructor.
 */
export interface PasswordPolicyConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minSpecialChars: number;
  preventReuseCount: number; // Number of previous passwords to check against
  expiryDays: number; // Force password change after N days (0 = never)
}

export const DEFAULT_PASSWORD_POLICY: PasswordPolicyConfig = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minSpecialChars: 1,
  preventReuseCount: 5,
  expiryDays: 90,
};

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very_strong';
  score: number; // 0-100
}

export class PasswordPolicy {
  private config: PasswordPolicyConfig;
  private db: Database;

  constructor(db: Database, config?: Partial<PasswordPolicyConfig>) {
    this.db = db;
    this.config = { ...DEFAULT_PASSWORD_POLICY, ...config };
  }

  /**
   * Validate password against the configured policy.
   * Returns detailed validation result with strength score.
   */
  public validate(password: string): PasswordValidationResult {
    const errors: string[] = [];

    // Length checks
    if (password.length < this.config.minLength) {
      errors.push(`Password must be at least ${this.config.minLength} characters`);
    }
    if (password.length > this.config.maxLength) {
      errors.push(`Password must be no more than ${this.config.maxLength} characters`);
    }

    // Character composition checks
    if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (this.config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (this.config.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    const specialCharCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
    if (this.config.requireSpecialChars && specialCharCount < this.config.minSpecialChars) {
      errors.push(`Password must contain at least ${this.config.minSpecialChars} special character(s)`);
    }

    // Common pattern checks
    if (/(.)\1{3,}/.test(password)) {
      errors.push('Password contains repeated characters (e.g., "aaaa")');
    }
    if (/^(123|abc|password|admin|qwerty|letmein)/i.test(password)) {
      errors.push('Password contains a common pattern');
    }
    if (/^[A-Za-z0-9]+$/.test(password) && password.length < 12) {
      // If only alphanumeric, penalize unless long
      if (!this.config.requireSpecialChars) {
        errors.push('Consider adding special characters for stronger security');
      }
    }

    // Calculate strength score
    const score = this.calculateStrength(password);
    const strength = this.getStrengthLabel(score);

    return {
      valid: errors.length === 0,
      errors,
      strength,
      score,
    };
  }

  /**
   * Check if the password has been used before (against password history).
   */
  public async isPasswordReused(userId: string, newPassword: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        `SELECT password_hash FROM password_history 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [userId, this.config.preventReuseCount]
      );

      for (const row of result.rows) {
        const match = await bcrypt.compare(newPassword, row.password_hash);
        if (match) return true;
      }

      return false;
    } catch (error) {
      logger.error('Failed to check password history', error);
      return false;
    }
  }

  /**
   * Store a new password hash in the password history.
   * Prunes old entries beyond the configured reuse count.
   */
  public async storePasswordHash(userId: string, passwordHash: string): Promise<void> {
    try {
      // Insert new hash
      await this.db.query(
        `INSERT INTO password_history (user_id, password_hash) 
         VALUES ($1, $2)`,
        [userId, passwordHash]
      );

      // Prune old entries beyond the configured count
      await this.db.query(
        `DELETE FROM password_history 
         WHERE id IN (
           SELECT id FROM password_history 
           WHERE user_id = $1 
           ORDER BY created_at DESC 
           OFFSET $2
         )`,
        [userId, this.config.preventReuseCount]
      );
    } catch (error) {
      logger.error('Failed to store password hash in history', error);
    }
  }

  /**
   * Check if the user's password has expired.
   */
  public async isPasswordExpired(userId: string): Promise<boolean> {
    if (this.config.expiryDays <= 0) return false;

    try {
      const result = await this.db.query(
        'SELECT password_changed_at FROM users WHERE id = $1',
        [userId]
      );

      if (!result.rows[0] || !result.rows[0].password_changed_at) return false;

      const changedAt = new Date(result.rows[0].password_changed_at);
      const expiryDate = new Date(changedAt.getTime() + this.config.expiryDays * 24 * 60 * 60 * 1000);

      return new Date() > expiryDate;
    } catch (error) {
      logger.error('Failed to check password expiry', error);
      return false;
    }
  }

  /**
   * Calculate password strength score (0-100).
   */
  private calculateStrength(password: string): number {
    let score = 0;

    // Length score (up to 40 points)
    score += Math.min(password.length * 4, 40);

    // Variety score (up to 40 points)
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;

    // Complexity score (up to 20 points)
    const charTypes = new Set();
    for (const ch of password) {
      if (/[a-z]/.test(ch)) charTypes.add('lower');
      else if (/[A-Z]/.test(ch)) charTypes.add('upper');
      else if (/[0-9]/.test(ch)) charTypes.add('digit');
      else charTypes.add('special');
    }
    score += (charTypes.size / 4) * 20;

    // Pattern penalties
    if (/(.)\1{3,}/.test(password)) score -= 15;
    if (/^(123|password|admin|qwerty|letmein)/i.test(password)) score -= 20;
    if (/^[A-Za-z0-9]+$/.test(password) && password.length < 12) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get strength label from score.
   */
  private getStrengthLabel(score: number): 'weak' | 'medium' | 'strong' | 'very_strong' {
    if (score < 40) return 'weak';
    if (score < 60) return 'medium';
    if (score < 80) return 'strong';
    return 'very_strong';
  }

  /**
   * Get the current policy configuration (for exposing to clients).
   */
  public getConfig(): PasswordPolicyConfig {
    return { ...this.config };
  }
}

export default PasswordPolicy;
