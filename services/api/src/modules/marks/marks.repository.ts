import { BaseRepository } from '@/core/repository';

export interface MarksFilters {
  page?: number;
  limit?: number;
  batchId?: string;
  subjectId?: string;
  studentId?: string;
  teacherId?: string;
  status?: string;
}

export interface EnterMarksData {
  student_id: string;
  subject_id: string;
  batch_id: string;
  teacher_id: string;
  assignment_marks?: number;
  test_marks?: number;
  attendance_marks?: number;
}

/**
 * Repository for internal marks database operations.
 * Handles marks CRUD with status lifecycle (draft → submitted → finalised → locked).
 */
export class MarksRepository extends BaseRepository {
  /**
   * List internal marks with pagination, student/subject/batch joins.
   */
  async findAll(filters: MarksFilters) {
    const { page = 1, limit = 50, batchId, subjectId, studentId, teacherId, status } = filters;

    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (batchId) {
      conditions.push(`im.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }
    if (subjectId) {
      conditions.push(`im.subject_id = $${paramIndex++}`);
      params.push(subjectId);
    }
    if (studentId) {
      conditions.push(`im.student_id = $${paramIndex++}`);
      params.push(studentId);
    }
    if (teacherId) {
      conditions.push(`im.teacher_id = $${paramIndex++}`);
      params.push(teacherId);
    }
    if (status) {
      conditions.push(`im.status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.query(
      `SELECT COUNT(*) FROM internal_marks im WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0]?.count || '0', 10);

    const offset = (page - 1) * limit;
    const dataResult = await this.query(
      `SELECT im.*,
              s.code AS subject_code,
              s.name AS subject_name,
              u.first_name || ' ' || u.last_name AS student_name,
              u.student_id AS roll_number,
              b.name AS batch_name
       FROM internal_marks im
       LEFT JOIN subjects s ON im.subject_id = s.id
       LEFT JOIN users u ON im.student_id = u.id
       LEFT JOIN batches b ON im.batch_id = b.id
       WHERE ${whereClause}
       ORDER BY u.first_name, s.code
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: dataResult.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Enter or update marks for a student-subject-batch combination.
   * Uses ON CONFLICT to allow updating existing entries (upsert).
   * Auto-calculates total marks.
   */
  async enter(data: EnterMarksData) {
    const assignmentMarks = data.assignment_marks ?? 0;
    const testMarks = data.test_marks ?? 0;
    const attendanceMarks = data.attendance_marks ?? 0;
    const total = assignmentMarks + testMarks + attendanceMarks;

    const result = await this.query(
      `INSERT INTO internal_marks (student_id, subject_id, batch_id, teacher_id, assignment_marks, test_marks, attendance_marks, total_marks, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
       ON CONFLICT (student_id, subject_id, batch_id)
       DO UPDATE SET
         assignment_marks = $5,
         test_marks = $6,
         attendance_marks = $7,
         total_marks = $8,
         teacher_id = $4,
         updated_at = NOW(),
         status = CASE WHEN internal_marks.status = 'locked' THEN 'locked' ELSE 'draft' END
       RETURNING *`,
      [data.student_id, data.subject_id, data.batch_id, data.teacher_id, assignmentMarks, testMarks, attendanceMarks, total]
    );
    return result.rows[0];
  }

  /**
   * Update the workflow status of a marks entry.
   * Automatically sets the corresponding timestamp field.
   */
  async updateStatus(id: string, status: string) {
    const timestampField =
      status === 'submitted' ? 'submitted_at' :
      status === 'finalised' ? 'finalised_at' :
      status === 'locked' ? 'locked_at' : null;

    let queryStr = `UPDATE internal_marks SET status = $1, updated_at = NOW()`;
    if (timestampField) {
      queryStr += `, ${timestampField} = NOW()`;
    }
    queryStr += ` WHERE id = $2 RETURNING *`;

    const result = await this.query(queryStr, [status, id]);
    return result.rows[0];
  }
}
