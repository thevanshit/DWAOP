import { BaseRepository } from '@/core/repository';
import { logger } from '@/utils/logger';

export interface LeaveFilters {
  page?: number;
  limit?: number;
  studentId?: string;
  status?: string;
  leaveType?: string;
}

export interface CreateLeaveData {
  studentId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  supportingDocuments?: string[];
  isEmergency?: boolean;
  workflowId?: string;
}

export interface LeaveRecord {
  id: string;
  workflow_id: string;
  student_id: string;
  student_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  supporting_documents: string[];
  status: string;
  is_emergency: boolean;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Repository for leave request database operations.
 * Extends BaseRepository to leverage query, queryOne, queryAll, queryPaginated,
 * buildWhereClause, and transaction utilities.
 */
export class LeavesRepository extends BaseRepository {
  private readonly tableName = 'leave_requests';

  /**
   * Find all leave requests with pagination, filtering, and student name joins.
   */
  async findAll(filters: LeaveFilters): Promise<{ data: LeaveRecord[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const { page = 1, limit = 20, studentId, status, leaveType } = filters;

    const columnMap: Record<string, string> = {
      studentId: 'lr.student_id',
      status: 'lr.status',
      leaveType: 'lr.leave_type',
    };

    const filterValues: Record<string, any> = {};
    if (studentId) filterValues.studentId = studentId;
    if (status) filterValues.status = status;
    if (leaveType) filterValues.leaveType = leaveType;

    const where = this.buildWhereClause(filterValues, columnMap);

    const baseQuery = `
      FROM ${this.tableName} lr
      LEFT JOIN users u ON lr.student_id = u.id
      ${where.clause}
    `;

    const selectQuery = `
      SELECT lr.*, u.name AS student_name
      ${baseQuery}
      ORDER BY lr.created_at DESC
    `;

    const countQuery = `SELECT COUNT(*) ${baseQuery}`;

    return this.queryPaginated(selectQuery, countQuery, where.params, page, limit);
  }

  /**
   * Find a leave request by its ID.
   */
  async findById(id: string): Promise<LeaveRecord | null> {
    const result = await this.queryOne(
      `SELECT lr.*, u.name AS student_name
       FROM ${this.tableName} lr
       LEFT JOIN users u ON lr.student_id = u.id
       WHERE lr.id = $1`,
      [id]
    );
    return result || null;
  }

  /**
   * Create a new leave request record.
   */
  async create(data: CreateLeaveData): Promise<LeaveRecord> {
    const result = await this.queryOne(
      `INSERT INTO ${this.tableName} (
        student_id, leave_type, start_date, end_date, total_days,
        reason, supporting_documents, is_emergency, workflow_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
      RETURNING *`,
      [
        data.studentId,
        data.leaveType,
        data.startDate,
        data.endDate,
        data.totalDays,
        data.reason,
        data.supportingDocuments ? JSON.stringify(data.supportingDocuments) : null,
        data.isEmergency || false,
        data.workflowId || null,
      ]
    );
    return result;
  }

  /**
   * Update the status of a leave request (approve or reject).
   */
  async updateStatus(
    id: string,
    status: string,
    approvedBy?: string,
    rejectionReason?: string
  ): Promise<LeaveRecord | null> {
    const setClauses: string[] = ['status = $1'];
    const params: any[] = [status];
    let paramIndex = 2;

    if (status === 'approved' && approvedBy) {
      setClauses.push(`approved_by = $${paramIndex++}`);
      params.push(approvedBy);
      setClauses.push(`approved_at = NOW()`);
    }

    if (status === 'rejected') {
      setClauses.push(`rejection_reason = $${paramIndex++}`);
      params.push(rejectionReason || null);
    }

    setClauses.push(`updated_at = NOW()`);
    params.push(id);

    const result = await this.queryOne(
      `UPDATE ${this.tableName}
       SET ${setClauses.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      params
    );
    return result || null;
  }
}
