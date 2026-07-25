import Database from '@/config/database';
import { logger } from '@/utils/logger';

/**
 * Types of auth events that can be audited.
 */
export type AuthEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'TOKEN_REFRESH'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_COMPLETE'
  | 'EMAIL_VERIFICATION_SENT'
  | 'EMAIL_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'ACCOUNT_CREATED'
  | 'ACCOUNT_DEACTIVATED'
  | 'ACCOUNT_REACTIVATED'
  | 'ROLE_CHANGED'
  | 'SESSION_REVOKED'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED';

/**
 * Severity levels for auth events.
 */
export type AuthEventSeverity = 'info' | 'warning' | 'critical';

/**
 * Mapping of event types to severity levels.
 */
const EVENT_SEVERITY: Record<AuthEventType, AuthEventSeverity> = {
  LOGIN_SUCCESS: 'info',
  LOGIN_FAILED: 'warning',
  LOGOUT: 'info',
  TOKEN_REFRESH: 'info',
  PASSWORD_CHANGE: 'info',
  PASSWORD_RESET_REQUEST: 'info',
  PASSWORD_RESET_COMPLETE: 'info',
  EMAIL_VERIFICATION_SENT: 'info',
  EMAIL_VERIFIED: 'info',
  ACCOUNT_LOCKED: 'warning',
  ACCOUNT_UNLOCKED: 'info',
  ACCOUNT_CREATED: 'info',
  ACCOUNT_DEACTIVATED: 'warning',
  ACCOUNT_REACTIVATED: 'info',
  ROLE_CHANGED: 'warning',
  SESSION_REVOKED: 'warning',
  MFA_ENABLED: 'info',
  MFA_DISABLED: 'info',
};

/**
 * Metadata for an auth audit event.
 */
export interface AuthAuditEvent {
  eventType: AuthEventType;
  userId?: string;
  email?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity?: AuthEventSeverity;
}

export class AuthAuditService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Log an authentication-related event to both the database audit_logs
   * and the application logger.
   */
  public async log(event: AuthAuditEvent): Promise<void> {
    const severity = event.severity || EVENT_SEVERITY[event.eventType] || 'info';
    const metadata = {
      eventType: event.eventType,
      email: event.email,
      role: event.role,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      ...event.details,
    };

    try {
      // Log to database audit_logs table
      await this.db.query(
        `INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by, ip_address, user_agent, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          'auth_events',
          event.userId || 'anonymous',
          event.eventType,
          JSON.stringify(metadata),
          event.userId || null,
          event.ipAddress || null,
          event.userAgent || null,
          JSON.stringify({ severity, ...event.details }),
        ]
      );

      // Also log to application logger
      const logMessage = `[AuthAudit] ${event.eventType}${event.email ? ` - ${event.email}` : ''}${event.userId ? ` (${event.userId})` : ''}`;

      switch (severity) {
        case 'critical':
          logger.error(logMessage, metadata);
          break;
        case 'warning':
          logger.warn(logMessage, metadata);
          break;
        default:
          logger.info(logMessage, metadata);
      }
    } catch (error) {
      logger.error('Failed to write auth audit log', error);
    }
  }

  /**
   * Convenience method for successful login.
   */
  public async logLoginSuccess(
    userId: string,
    email: string,
    role: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    return this.log({
      eventType: 'LOGIN_SUCCESS',
      userId,
      email,
      role,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Convenience method for failed login.
   */
  public async logLoginFailed(
    email: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    return this.log({
      eventType: 'LOGIN_FAILED',
      email,
      ipAddress,
      userAgent,
      details: { reason },
    });
  }

  /**
   * Convenience method for account lockout.
   */
  public async logAccountLocked(
    userId: string,
    email: string,
    durationMinutes: number,
    ipAddress?: string
  ): Promise<void> {
    return this.log({
      eventType: 'ACCOUNT_LOCKED',
      userId,
      email,
      ipAddress,
      details: { durationMinutes },
      severity: 'warning',
    });
  }

  /**
   * Query recent auth audit logs for a user.
   */
  public async getUserAuditLogs(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const result = await this.db.query(
        `SELECT action as event_type, new_values, ip_address, user_agent, changed_at, metadata
         FROM audit_logs 
         WHERE table_name = 'auth_events' AND record_id = $1
         ORDER BY changed_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      return result.rows;
    } catch (error) {
      logger.error('Failed to query auth audit logs', error);
      return [];
    }
  }
}

export default AuthAuditService;
