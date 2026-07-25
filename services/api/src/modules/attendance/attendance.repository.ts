import { BaseRepository } from '@/core/repository';

export interface AttendanceSessionFilters {
  page?: number;
  limit?: number;
  batchId?: string;
  subjectId?: string;
  teacherId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateSessionData {
  subject_id: string;
  batch_id: string;
  teacher_id: string;
  scheduled_date: Date;
  start_time?: Date;
  end_time?: Date;
  grace_period_minutes?: number;
  location?: string;
}

export interface AttendanceRecordInput {
  session_id: string;
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  marked_by?: string;
}

/**
 * Repository for attendance database operations.
 * Handles sessions and records with full relation joins.
 */
export class AttendanceRepository extends BaseRepository {
  /**
   * List attendance sessions with pagination and related names.
   */
  async getSessions(filters: AttendanceSessionFilters) {
    const {
      page = 1,
      limit = 20,
      batchId,
      subjectId,
      teacherId,
      date,
      startDate,
      endDate,
    } = filters;

    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (batchId) {
      conditions.push(`as.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }
    if (subjectId) {
      conditions.push(`as.subject_id = $${paramIndex++}`);
      params.push(subjectId);
    }
    if (teacherId) {
      conditions.push(`as.teacher_id = $${paramIndex++}`);
      params.push(teacherId);
    }
    if (date) {
      conditions.push(`DATE(as.scheduled_date) = $${paramIndex++}`);
      params.push(date);
    }
    if (startDate) {
      conditions.push(`as.scheduled_date >= $${paramIndex++}`);
      params.push(startDate);
    }
    if (endDate) {
      conditions.push(`as.scheduled_date <= $${paramIndex++}`);
      params.push(endDate);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.query(
      `SELECT COUNT(*) FROM attendance_sessions as WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0]?.count || '0', 10);

    const offset = (page - 1) * limit;
    const dataResult = await this.query(
      `SELECT as.*,
              s.code AS subject_code,
              s.name AS subject_name,
              b.name AS batch_name,
              t.first_name || ' ' || t.last_name AS teacher_name,
              (SELECT COUNT(*) FROM attendance_records ar WHERE ar.session_id = as.id AND ar.status = 'present') AS present_count,
              (SELECT COUNT(*) FROM attendance_records ar WHERE ar.session_id = as.id AND ar.status = 'absent') AS absent_count,
              (SELECT COUNT(*) FROM attendance_records ar WHERE ar.session_id = as.id) AS total_records
       FROM attendance_sessions as
       LEFT JOIN subjects s ON as.subject_id = s.id
       LEFT JOIN batches b ON as.batch_id = b.id
       LEFT JOIN users t ON as.teacher_id = t.id
       WHERE ${whereClause}
       ORDER BY as.scheduled_date DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: dataResult.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Create a new attendance session.
   */
  async createSession(data: CreateSessionData) {
    const result = await this.query(
      `INSERT INTO attendance_sessions (subject_id, batch_id, teacher_id, scheduled_date, start_time, end_time, grace_period_minutes, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.subject_id,
        data.batch_id,
        data.teacher_id,
        data.scheduled_date,
        data.start_time || null,
        data.end_time || null,
        data.grace_period_minutes ?? 10,
        data.location || null,
      ]
    );
    return result.rows[0];
  }

  /**
   * Get a single session by ID, including attendance records with student details.
   */
  async getSessionById(id: string) {
    const session = await this.queryOne(
      `SELECT as.*,
              s.code AS subject_code,
              s.name AS subject_name,
              b.name AS batch_name,
              t.first_name || ' ' || t.last_name AS teacher_name
       FROM attendance_sessions as
       LEFT JOIN subjects s ON as.subject_id = s.id
       LEFT JOIN batches b ON as.batch_id = b.id
       LEFT JOIN users t ON as.teacher_id = t.id
       WHERE as.id = $1`,
      [id]
    );

    if (!session) return null;

    const records = await this.queryAll(
      `SELECT ar.*, u.first_name, u.last_name, u.student_id
       FROM attendance_records ar
       INNER JOIN users u ON ar.student_id = u.id
       WHERE ar.session_id = $1
       ORDER BY u.first_name, u.last_name`,
      [id]
    );

    return { ...session, records };
  }

  /**
   * Mark attendance records for a session using upsert logic.
   * Uses a transaction to ensure atomicity.
   */
  async markAttendance(records: AttendanceRecordInput[]) {
    return this.transaction(async (tx) => {
      for (const record of records) {
        await tx(
          `INSERT INTO attendance_records (session_id, student_id, status, marked_by, marked_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (session_id, student_id)
           DO UPDATE SET status = $3, marked_by = $4, marked_at = NOW()`,
          [record.session_id, record.student_id, record.status, record.marked_by || null]
        );
      }
      return { success: true };
    });
  }

  /**
   * Get batch attendance summary within an optional date range.
   */
  async getBatchAttendance(batchId: string, startDate?: string, endDate?: string) {
    const conditions: string[] = ['as.batch_id = $1'];
    const params: any[] = [batchId];
    let paramIndex = 2;

    if (startDate) {
      conditions.push(`as.scheduled_date >= $${paramIndex++}`);
      params.push(startDate);
    }
    if (endDate) {
      conditions.push(`as.scheduled_date <= $${paramIndex++}`);
      params.push(endDate);
    }

    const whereClause = conditions.join(' AND ');

    const sessions = await this.queryAll(
      `SELECT as.*,
              s.name AS subject_name,
              s.code AS subject_code,
              (SELECT COUNT(*) FROM attendance_records ar WHERE ar.session_id = as.id AND ar.status = 'present') AS present_count,
              (SELECT COUNT(*) FROM attendance_records ar WHERE ar.session_id = as.id AND ar.status = 'absent') AS absent_count,
              (SELECT COUNT(*) FROM attendance_records ar WHERE ar.session_id = as.id) AS total_records
       FROM attendance_sessions as
       LEFT JOIN subjects s ON as.subject_id = s.id
       WHERE ${whereClause}
       ORDER BY as.scheduled_date DESC`,
      params
    );

    // Compute per-student summary across all matching sessions
    const sessionIds = sessions.map((s: any) => s.id);

    let studentSummary: any[] = [];
    if (sessionIds.length > 0) {
      const placeholders = sessionIds.map((_, i) => `$${i + 1}`).join(', ');
      studentSummary = await this.queryAll(
        `SELECT ar.student_id,
                u.first_name,
                u.last_name,
                u.student_id AS roll_number,
                COUNT(*) FILTER (WHERE ar.status = 'present') AS present,
                COUNT(*) FILTER (WHERE ar.status = 'absent') AS absent,
                COUNT(*) FILTER (WHERE ar.status = 'late') AS late,
                COUNT(*) FILTER (WHERE ar.status = 'excused') AS excused,
                COUNT(*) AS total
         FROM attendance_records ar
         INNER JOIN users u ON ar.student_id = u.id
         WHERE ar.session_id IN (${placeholders})
         GROUP BY ar.student_id, u.first_name, u.last_name, u.student_id
         ORDER BY u.first_name, u.last_name`,
        sessionIds
      );
    }

    return { sessions, studentSummary };
  }
}
