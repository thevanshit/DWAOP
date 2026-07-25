import Database from '@/config/database';
import { logger } from '@/utils/logger';

/**
 * Account lockout configuration.
 */
export interface LockoutConfig {
  maxFailedAttempts: number;     // Max failed attempts before lockout
  lockoutDurationMinutes: number; // How long the account stays locked
  lockoutIncrement: boolean;      // Whether lockout duration increases with repeated lockouts
  maxLockoutDurationMinutes: number; // Maximum lockout duration
}

export const DEFAULT_LOCKOUT_CONFIG: LockoutConfig = {
  maxFailedAttempts: 5,
  lockoutDurationMinutes: 15,
  lockoutIncrement: true,
  maxLockoutDurationMinutes: 1440, // 24 hours
};

export interface AccountLockStatus {
  locked: boolean;
  lockedUntil: Date | null;
  remainingAttempts: number;
  attempts: number;
}

export class AccountLockout {
  private config: LockoutConfig;
  private db: Database;

  constructor(db: Database, config?: Partial<LockoutConfig>) {
    this.db = db;
    this.config = { ...DEFAULT_LOCKOUT_CONFIG, ...config };
  }

  /**
   * Record a failed login attempt.
   * Returns the current lock status after the attempt.
   */
  public async recordFailedAttempt(
    userId: string,
    ipAddress: string,
    userAgent?: string
  ): Promise<AccountLockStatus> {
    try {
      // Increment failed attempts
      await this.db.query(
        `UPDATE users 
         SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1
         WHERE id = $1`,
        [userId]
      );

      // Log the attempt
      await this.db.query(
        `INSERT INTO login_attempts (user_id, ip_address, user_agent, success, failure_reason)
         VALUES ($1, $2, $3, false, 'invalid_password')`,
        [userId, ipAddress, userAgent || null]
      );

      // Check if we've hit the threshold
      const result = await this.db.query(
        'SELECT failed_login_attempts FROM users WHERE id = $1',
        [userId]
      );

      const attempts = result.rows[0]?.failed_login_attempts || 0;

      if (attempts >= this.config.maxFailedAttempts) {
        await this.lockAccount(userId, attempts);
      }

      return this.getLockStatus(userId);
    } catch (error) {
      logger.error('Failed to record failed login attempt', error);
      throw error;
    }
  }

  /**
   * Record a successful login attempt (resets counter).
   */
  public async recordSuccessfulAttempt(
    userId: string,
    ipAddress: string,
    userAgent?: string
  ): Promise<void> {
    try {
      // Reset failed attempts
      await this.db.query(
        `UPDATE users 
         SET failed_login_attempts = 0, locked_until = NULL
         WHERE id = $1`,
        [userId]
      );

      // Log the success
      await this.db.query(
        `INSERT INTO login_attempts (user_id, ip_address, user_agent, success)
         VALUES ($1, $2, $3, true)`,
        [userId, ipAddress, userAgent || null]
      );
    } catch (error) {
      logger.error('Failed to record successful login', error);
    }
  }

  /**
   * Check if an account is currently locked.
   */
  public async isAccountLocked(userId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        `SELECT locked_until, is_active FROM users WHERE id = $1`,
        [userId]
      );

      if (!result.rows[0]) return false;
      if (!result.rows[0].is_active) return true;

      const lockedUntil = result.rows[0].locked_until;
      if (!lockedUntil) return false;

      // Check if lock has expired
      if (new Date() >= new Date(lockedUntil)) {
        // Auto-unlock
        await this.unlockAccount(userId);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Failed to check account lock status', error);
      return false;
    }
  }

  /**
   * Get the current lock status for an account.
   */
  public async getLockStatus(userId: string): Promise<AccountLockStatus> {
    try {
      const result = await this.db.query(
        `SELECT failed_login_attempts, locked_until, is_active 
         FROM users WHERE id = $1`,
        [userId]
      );

      if (!result.rows[0]) {
        return { locked: false, lockedUntil: null, remainingAttempts: this.config.maxFailedAttempts, attempts: 0 };
      }

      const row = result.rows[0];
      const lockedUntil = row.locked_until ? new Date(row.locked_until) : null;
      const attempts = row.failed_login_attempts || 0;

      // Check if lock has expired
      if (lockedUntil && new Date() >= lockedUntil) {
        await this.unlockAccount(userId);
        return {
          locked: false,
          lockedUntil: null,
          remainingAttempts: this.config.maxFailedAttempts,
          attempts: 0,
        };
      }

      const locked = !!(lockedUntil && new Date() < lockedUntil) || !row.is_active;
      const remainingAttempts = locked ? 0 : Math.max(0, this.config.maxFailedAttempts - attempts);

      return {
        locked,
        lockedUntil,
        remainingAttempts,
        attempts,
      };
    } catch (error) {
      logger.error('Failed to get lock status', error);
      return { locked: false, lockedUntil: null, remainingAttempts: this.config.maxFailedAttempts, attempts: 0 };
    }
  }

  /**
   * Lock an account for a specified duration.
   */
  private async lockAccount(userId: string, failedAttempts: number): Promise<void> {
    try {
      let durationMinutes = this.config.lockoutDurationMinutes;

      if (this.config.lockoutIncrement) {
        // Increase lockout duration based on number of lockout cycles
        const lockoutCount = Math.floor(failedAttempts / this.config.maxFailedAttempts);
        durationMinutes = Math.min(
          durationMinutes * Math.pow(2, lockoutCount - 1),
          this.config.maxLockoutDurationMinutes
        );
      }

      const lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);

      await this.db.query(
        'UPDATE users SET locked_until = $1 WHERE id = $2',
        [lockedUntil, userId]
      );

      logger.warn(`Account locked: user ${userId} until ${lockedUntil.toISOString()}`);
    } catch (error) {
      logger.error('Failed to lock account', error);
    }
  }

  /**
   * Unlock an account (reset lockout state).
   */
  public async unlockAccount(userId: string): Promise<void> {
    try {
      await this.db.query(
        `UPDATE users 
         SET failed_login_attempts = 0, locked_until = NULL 
         WHERE id = $1`,
        [userId]
      );
    } catch (error) {
      logger.error('Failed to unlock account', error);
    }
  }

  /**
   * Admin override: manually lock or unlock an account.
   */
  public async adminLockAccount(userId: string, durationMinutes?: number): Promise<void> {
    try {
      if (durationMinutes && durationMinutes > 0) {
        const lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
        await this.db.query(
          `UPDATE users SET locked_until = $1, is_active = false WHERE id = $2`,
          [lockedUntil, userId]
        );
      } else {
        // Indefinite lock
        await this.db.query(
          `UPDATE users SET is_active = false WHERE id = $1`,
          [userId]
        );
      }
      logger.warn(`Admin manually locked account: ${userId}`);
    } catch (error) {
      logger.error('Failed to admin-lock account', error);
      throw error;
    }
  }

  public async adminUnlockAccount(userId: string): Promise<void> {
    try {
      await this.db.query(
        `UPDATE users 
         SET failed_login_attempts = 0, locked_until = NULL, is_active = true 
         WHERE id = $1`,
        [userId]
      );
      logger.info(`Admin manually unlocked account: ${userId}`);
    } catch (error) {
      logger.error('Failed to admin-unlock account', error);
      throw error;
    }
  }

  /**
   * Get the current configuration.
   */
  public getConfig(): LockoutConfig {
    return { ...this.config };
  }
}

export default AccountLockout;
