import { logger } from '@/utils/logger';
import Database from '@/config/database';

export interface AuditLog {
  id: string;
  tableName: string;
  recordId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  oldValues?: any;
  newValues?: any;
  changedBy?: string;
  changedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export class AuditService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Log an audit event
   */
  public async logAudit(data: Omit<AuditLog, 'id' | 'changedAt'>): Promise<void> {
    try {
      const auditLog: AuditLog = {
        ...data,
        id: this.generateAuditId(),
        changedAt: new Date(),
      };

      await this.db.query(`
        INSERT INTO audit_logs (
          id, table_name, record_id, action, old_values, new_values,
          changed_by, changed_at, ip_address, user_agent, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        auditLog.id,
        auditLog.tableName,
        auditLog.recordId,
        auditLog.action,
        JSON.stringify(auditLog.oldValues || {}),
        JSON.stringify(auditLog.newValues || {}),
        auditLog.changedBy,
        auditLog.changedAt,
        auditLog.ipAddress,
        auditLog.userAgent,
        JSON.stringify(auditLog.metadata || {})
      ]);

      logger.debug(`Audit log created: ${auditLog.tableName}:${auditLog.action} by ${auditLog.changedBy}`);
    } catch (error) {
      logger.error('Failed to create audit log', error);
      // Don't throw error to avoid breaking main operations
    }
  }

  /**
   * Get audit logs for a specific record
   */
  public async getAuditHistory(
    tableName: string,
    recordId: string,
    limit: number = 50
  ): Promise<AuditLog[]> {
    try {
      const result = await this.db.query(`
        SELECT * FROM audit_logs 
        WHERE table_name = $1 AND record_id = $2 
        ORDER BY changed_at DESC 
        LIMIT $3
      `, [tableName, recordId, limit]);

      return result.rows.map(this.mapRowToAuditLog);
    } catch (error) {
      logger.error('Failed to get audit history', error);
      throw error;
    }
  }

  /**
   * Get audit logs for a user
   */
  public async getUserAuditHistory(
    userId: string,
    limit: number = 100
  ): Promise<AuditLog[]> {
    try {
      const result = await this.db.query(`
        SELECT * FROM audit_logs 
        WHERE changed_by = $1 
        ORDER BY changed_at DESC 
        LIMIT $2
      `, [userId, limit]);

      return result.rows.map(this.mapRowToAuditLog);
    } catch (error) {
      logger.error('Failed to get user audit history', error);
      throw error;
    }
  }

  /**
   * Get audit logs for a table
   */
  public async getTableAuditHistory(
    tableName: string,
    limit: number = 100
  ): Promise<AuditLog[]> {
    try {
      const result = await this.db.query(`
        SELECT * FROM audit_logs 
        WHERE table_name = $1 
        ORDER BY changed_at DESC 
        LIMIT $2
      `, [tableName, limit]);

      return result.rows.map(this.mapRowToAuditLog);
    } catch (error) {
      logger.error('Failed to get table audit history', error);
      throw error;
    }
  }

  /**
   * Search audit logs
   */
  public async searchAuditLogs(params: {
    tableName?: string;
    action?: string;
    changedBy?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    try {
      let query = 'SELECT * FROM audit_logs WHERE 1=1';
      const queryParams: any[] = [];
      let paramIndex = 1;

      if (params.tableName) {
        query += ` AND table_name = $${paramIndex++}`;
        queryParams.push(params.tableName);
      }

      if (params.action) {
        query += ` AND action = $${paramIndex++}`;
        queryParams.push(params.action);
      }

      if (params.changedBy) {
        query += ` AND changed_by = $${paramIndex++}`;
        queryParams.push(params.changedBy);
      }

      if (params.dateFrom) {
        query += ` AND changed_at >= $${paramIndex++}`;
        queryParams.push(params.dateFrom);
      }

      if (params.dateTo) {
        query += ` AND changed_at <= $${paramIndex++}`;
        queryParams.push(params.dateTo);
      }

      // Get total count
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
      const countResult = await this.db.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].count);

      // Add ordering and pagination
      query += ' ORDER BY changed_at DESC';
      
      if (params.limit) {
        query += ` LIMIT $${paramIndex++}`;
        queryParams.push(params.limit);
      }

      if (params.offset) {
        query += ` OFFSET $${paramIndex++}`;
        queryParams.push(params.offset);
      }

      const result = await this.db.query(query, queryParams);
      const logs = result.rows.map(this.mapRowToAuditLog);

      return { logs, total };
    } catch (error) {
      logger.error('Failed to search audit logs', error);
      throw error;
    }
  }

  /**
   * Clean up old audit logs based on retention policy
   */
  public async cleanupOldAuditLogs(retentionDays: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const result = await this.db.query(`
        DELETE FROM audit_logs 
        WHERE changed_at < $1
        RETURNING COUNT(*) as deleted_count
      `, [cutoffDate]);

      const deletedCount = parseInt(result.rows[0].deleted_count);
      logger.info(`Cleaned up ${deletedCount} old audit logs (older than ${retentionDays} days)`);

      return deletedCount;
    } catch (error) {
      logger.error('Failed to cleanup old audit logs', error);
      throw error;
    }
  }

  /**
   * Create audit trigger for a table
   */
  public async createAuditTrigger(tableName: string): Promise<void> {
    try {
      // Create trigger function
      const triggerFunction = `
        CREATE OR REPLACE FUNCTION ${tableName}_audit_trigger()
        RETURNS TRIGGER AS $$
        BEGIN
          IF TG_OP = 'DELETE' THEN
            INSERT INTO audit_logs (
              table_name, record_id, action, old_values, changed_by, changed_at
            ) VALUES (
              '${tableName}', OLD.id::text, 'DELETE', 
              row_to_json(OLD), OLD.updated_by, CURRENT_TIMESTAMP
            );
            RETURN OLD;
          ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO audit_logs (
              table_name, record_id, action, old_values, new_values, changed_by, changed_at
            ) VALUES (
              '${tableName}', NEW.id::text, 'UPDATE', 
              row_to_json(OLD), row_to_json(NEW), NEW.updated_by, CURRENT_TIMESTAMP
            );
            RETURN NEW;
          ELSIF TG_OP = 'INSERT' THEN
            INSERT INTO audit_logs (
              table_name, record_id, action, new_values, changed_by, changed_at
            ) VALUES (
              '${tableName}', NEW.id::text, 'INSERT', 
              row_to_json(NEW), NEW.created_by, CURRENT_TIMESTAMP
            );
            RETURN NEW;
          END IF;
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
      `;

      await this.db.query(triggerFunction);

      // Create trigger
      const trigger = `
        DROP TRIGGER IF EXISTS ${tableName}_audit_trigger ON ${tableName};
        CREATE TRIGGER ${tableName}_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE ON ${tableName}
        FOR EACH ROW EXECUTE FUNCTION ${tableName}_audit_trigger();
      `;

      await this.db.query(trigger);

      logger.info(`Audit trigger created for table: ${tableName}`);
    } catch (error) {
      logger.error(`Failed to create audit trigger for table: ${tableName}`, error);
      throw error;
    }
  }

  /**
   * Map database row to AuditLog
   */
  private mapRowToAuditLog(row: any): AuditLog {
    return {
      id: row.id,
      tableName: row.table_name,
      recordId: row.record_id,
      action: row.action,
      oldValues: row.old_values ? JSON.parse(row.old_values) : undefined,
      newValues: row.new_values ? JSON.parse(row.new_values) : undefined,
      changedBy: row.changed_by,
      changedAt: new Date(row.changed_at),
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    };
  }

  /**
   * Generate unique audit ID
   */
  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const auditService = new AuditService(null as any); // Will be initialized with database connection

export default AuditService;