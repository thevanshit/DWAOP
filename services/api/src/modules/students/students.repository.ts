import { BaseRepository } from '@/core/repository';
import { logger } from '@/utils/logger';

export interface StudentFilters {
  batchId?: string;
  departmentId?: string;
  search?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}

export interface AttendanceFilters {
  batchId?: string;
  subjectId?: string;
  startDate?: string;
  endDate?: string;
}

export interface MarksFilters {
  subjectId?: string;
  batchId?: string;
}

export interface StudentUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export class StudentsRepository extends BaseRepository {
  /**
   * List students with filtering, search, and pagination.
   * Joins with student_academic_profiles and departments for enriched data.
   */
  async findAll(filters: StudentFilters) {
    const { batchId, departmentId, search, status, page = 1, limit = 20 } = filters;
    const conditions: string[] = ['u.role = $1'];
    const params: any[] = ['student'];
    let paramIndex = 2;

    if (batchId) {
      conditions.push(`sap.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }

    if (departmentId) {
      conditions.push(`u.department_id = $${paramIndex++}`);
      params.push(departmentId);
    }

    if (search) {
      conditions.push(
        `(u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.student_id ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      conditions.push(`u.is_active = $${paramIndex++}`);
      params.push(status === 'active');
    }

    const whereClause = conditions.join(' AND ');

    const baseQuery = `
      FROM users u
      LEFT JOIN student_academic_profiles sap ON u.id = sap.student_id
      WHERE ${whereClause}
    `;

    const countResult = await this.queryOne(`SELECT COUNT(*) ${baseQuery}`, params);
    const total = parseInt(countResult?.count || '0', 10);

    const data = await this.queryAll(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.student_id, u.phone,
              u.avatar_url, u.is_active, u.created_at,
              sap.batch_id, sap.current_semester, sap.cgpa,
              sap.eligibility_status, sap.risk_indicators
       ${baseQuery}
       ORDER BY u.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, (page - 1) * limit]
    );

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get student by ID with academic profile data.
   */
  async findById(id: string) {
    const result = await this.queryOne(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.student_id, u.phone,
              u.avatar_url, u.is_active, u.created_at,
              sap.batch_id, sap.current_semester, sap.cgpa,
              sap.eligibility_status, sap.risk_indicators, sap.total_credits,
              d.name AS department_name, d.code AS department_code
       FROM users u
       LEFT JOIN student_academic_profiles sap ON u.id = sap.student_id
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = $1 AND u.role = 'student'`,
      [id]
    );
    return result;
  }

  /**
   * Find students at risk of academic ineligibility.
   */
  async findAtRisk(departmentId?: string) {
    const conditions: string[] = [
      `sap.eligibility_status IN ('at_risk', 'not_eligible')`,
    ];
    const params: any[] = [];
    let paramIndex = 1;

    if (departmentId) {
      conditions.push(`u.department_id = $${paramIndex++}`);
      params.push(departmentId);
    }

    const whereClause = conditions.join(' AND ');

    return this.queryAll(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.student_id, u.phone,
              u.avatar_url, u.is_active,
              sap.batch_id, sap.current_semester, sap.cgpa,
              sap.eligibility_status, sap.risk_indicators
       FROM users u
       INNER JOIN student_academic_profiles sap ON u.id = sap.student_id
       WHERE ${whereClause}
       ORDER BY sap.eligibility_status, u.first_name`,
      params
    );
  }

  /**
   * Get attendance records for a student with optional filters.
   */
  async getAttendance(studentId: string, filters: AttendanceFilters = {}) {
    const { batchId, subjectId, startDate, endDate } = filters;
    const conditions: string[] = ['ar.student_id = $1'];
    const params: any[] = [studentId];
    let paramIndex = 2;

    if (batchId) {
      conditions.push(`as.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }

    if (subjectId) {
      conditions.push(`as.subject_id = $${paramIndex++}`);
      params.push(subjectId);
    }

    if (startDate) {
      conditions.push(`DATE(as.scheduled_date) >= $${paramIndex++}`);
      params.push(startDate);
    }

    if (endDate) {
      conditions.push(`DATE(as.scheduled_date) <= $${paramIndex++}`);
      params.push(endDate);
    }

    return this.queryAll(
      `SELECT ar.*, as.scheduled_date, as.subject_id, s.code AS subject_code,
              s.name AS subject_name
       FROM attendance_records ar
       INNER JOIN attendance_sessions as ON ar.session_id = as.id
       LEFT JOIN subjects s ON as.subject_id = s.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY as.scheduled_date DESC`,
      params
    );
  }

  /**
   * Get assignments for a student through their batch enrollment.
   */
  async getAssignments(studentId: string) {
    const batch = await this.queryOne(
      `SELECT batch_id FROM student_academic_profiles WHERE student_id = $1`,
      [studentId]
    );

    if (!batch) {
      return [];
    }

    return this.queryAll(
      `SELECT a.id, a.title, a.description, a.max_marks, a.submission_deadline,
              s.code AS subject_code, s.name AS subject_name,
              b.name AS batch_name,
              (SELECT COUNT(*) FROM assignment_submissions WHERE assignment_id = a.id) AS submission_count
       FROM assignments a
       LEFT JOIN subjects s ON a.subject_id = s.id
       LEFT JOIN batches b ON a.batch_id = b.id
       WHERE a.batch_id = $1
       ORDER BY a.submission_deadline DESC`,
      [batch.batch_id]
    );
  }

  /**
   * Get marks for a student with optional subject/batch filtering.
   */
  async getMarks(studentId: string, filters: MarksFilters = {}) {
    const { subjectId, batchId } = filters;
    const conditions: string[] = ['im.student_id = $1'];
    const params: any[] = [studentId];
    let paramIndex = 2;

    if (subjectId) {
      conditions.push(`im.subject_id = $${paramIndex++}`);
      params.push(subjectId);
    }

    if (batchId) {
      conditions.push(`im.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }

    const whereClause = conditions.join(' AND ');

    return this.queryAll(
      `SELECT im.*, s.code AS subject_code, s.name AS subject_name,
              b.name AS batch_name
       FROM internal_marks im
       LEFT JOIN subjects s ON im.subject_id = s.id
       LEFT JOIN batches b ON im.batch_id = b.id
       WHERE ${whereClause}
       ORDER BY s.code`,
      params
    );
  }

  /**
   * Calculate exam eligibility based on attendance percentage and CGPA.
   */
  async getEligibility(studentId: string) {
    const student = await this.queryOne(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.student_id, u.is_active,
              sap.batch_id, sap.current_semester, sap.cgpa,
              sap.eligibility_status, sap.risk_indicators
       FROM users u
       LEFT JOIN student_academic_profiles sap ON u.id = sap.student_id
       WHERE u.id = $1 AND u.role = 'student'`,
      [studentId]
    );

    if (!student) return null;

    // Calculate attendance percentage
    const attendance = await this.queryAll(
      `SELECT ar.status
       FROM attendance_records ar
       INNER JOIN attendance_sessions as ON ar.session_id = as.id
       WHERE ar.student_id = $1`,
      [studentId]
    );

    const totalCount = attendance.length;
    const presentCount = attendance.filter((a: any) => a.status === 'present').length;
    const attendancePercentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

    const eligibilityStatus =
      attendancePercentage >= 75
        ? 'eligible'
        : attendancePercentage >= 65
          ? 'at_risk'
          : 'not_eligible';

    return {
      studentId: student.id,
      firstName: student.first_name,
      lastName: student.last_name,
      cgpa: student.cgpa,
      attendancePercentage: Math.round(attendancePercentage),
      totalSessions: totalCount,
      presentSessions: presentCount,
      eligibilityStatus,
      riskIndicators: student.risk_indicators || [],
    };
  }

  /**
   * Update student profile fields.
   */
  async update(id: string, data: StudentUpdateData) {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.firstName !== undefined) {
      updates.push(`first_name = $${paramIndex++}`);
      params.push(data.firstName);
    }
    if (data.lastName !== undefined) {
      updates.push(`last_name = $${paramIndex++}`);
      params.push(data.lastName);
    }
    if (data.phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      params.push(data.phone);
    }
    if (data.avatarUrl !== undefined) {
      updates.push(`avatar_url = $${paramIndex++}`);
      params.push(data.avatarUrl);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    params.push(id);
    const result = await this.queryOne(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    return result;
  }
}
