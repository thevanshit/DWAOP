import Database from '@/config/database';
import { logger } from '@/utils/logger';

/**
 * Represents an active user session (refresh token).
 */
export interface UserSession {
  id: string;
  userId: string;
  token: string; // Truncated for display
  createdAt: Date;
  expiresAt: Date;
  isCurrent: boolean;
}

export interface SessionInfo {
  id: string;
  userId: string;
  tokenPreview: string;
  createdAt: Date;
  expiresAt: Date;
  isExpired: boolean;
  isCurrent: boolean;
}

export class SessionManager {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Get all active sessions for a user.
   */
  public async getUserSessions(userId: string, currentToken?: string): Promise<SessionInfo[]> {
    try {
      const result = await this.db.query(
        `SELECT id, user_id, token, created_at, expires_at
         FROM refresh_tokens
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        tokenPreview: row.token ? `${row.token.substring(0, 12)}...` : '',
        createdAt: new Date(row.created_at),
        expiresAt: new Date(row.expires_at),
        isExpired: new Date() > new Date(row.expires_at),
        isCurrent: currentToken ? row.token === currentToken : false,
      }));
    } catch (error) {
      logger.error('Failed to get user sessions', error);
      return [];
    }
  }

  /**
   * Revoke a specific session by refresh token ID.
   */
  public async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        `DELETE FROM refresh_tokens 
         WHERE id = $1 AND user_id = $2 
         RETURNING id`,
        [sessionId, userId]
      );
      return (result.rowCount || 0) > 0;
    } catch (error) {
      logger.error('Failed to revoke session', error);
      return false;
    }
  }

  /**
   * Revoke all sessions for a user except the current one.
   */
  public async revokeOtherSessions(userId: string, currentToken: string): Promise<number> {
    try {
      const result = await this.db.query(
        `DELETE FROM refresh_tokens 
         WHERE user_id = $1 AND token != $2
         RETURNING id`,
        [userId, currentToken]
      );
      return result.rowCount || 0;
    } catch (error) {
      logger.error('Failed to revoke other sessions', error);
      return 0;
    }
  }

  /**
   * Revoke all sessions for a user.
   */
  public async revokeAllSessions(userId: string): Promise<number> {
    try {
      const result = await this.db.query(
        `DELETE FROM refresh_tokens WHERE user_id = $1
         RETURNING id`,
        [userId]
      );
      return result.rowCount || 0;
    } catch (error) {
      logger.error('Failed to revoke all sessions', error);
      return 0;
    }
  }

  /**
   * Clean up expired refresh tokens.
   */
  public async cleanupExpiredSessions(): Promise<number> {
    try {
      const result = await this.db.query(
        `DELETE FROM refresh_tokens WHERE expires_at < CURRENT_TIMESTAMP`
      );
      return result.rowCount || 0;
    } catch (error) {
      logger.error('Failed to cleanup expired sessions', error);
      return 0;
    }
  }

  /**
   * Get total active session count for a user.
   */
  public async getSessionCount(userId: string): Promise<number> {
    try {
      const result = await this.db.query(
        `SELECT COUNT(*) as count FROM refresh_tokens 
         WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP`,
        [userId]
      );
      return parseInt(result.rows[0]?.count || '0', 10);
    } catch (error) {
      return 0;
    }
  }
}

export default SessionManager;
