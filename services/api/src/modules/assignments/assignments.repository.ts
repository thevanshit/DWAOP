import { BaseRepository } from '@/core/repository';

export interface AssignmentFilters {
  page?: number;
  limit?: number;
  batchId?: string;
  subjectId?: string;
  teacherId?: string;
  status?: string;
}

export interface CreateAssignmentData {
  subject_id: string;
  batch_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  instructions?: string;
  max_marks: number;
  submission_deadline: Date;
  late_submission_allowed?: boolean;
  late_penalty_percentage?: number;
  rubric?: any;
}

export interface SubmitAssignmentData {
  assignment_id: string;
  student_id: string;
  submitted_at?: Date;
  is_late?: boolean;
}

/**
 * Repository for assignment database operations.
 * Handles assignments CRUD, submissions, and evaluations.
 */
export class AssignmentsRepository extends BaseRepository {
  /**
   * List assignments with pagination, joins, and submission counts.
   */
  async findAll(filters: AssignmentFilters) {
    const { page = 1, limit = 20, batchId, subjectId, teacherId, status } = filters;

    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (batchId) {
      conditions.push(`a.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }
    if (subjectId) {
      conditions.push(`a.subject_id = $${paramIndex++}`);
      params.push(subjectId);
    }
    if (teacherId) {
      conditions.push(`a.teacher_id = $${paramIndex++}`);
      params.push(teacherId);
    }
    if (status) {
      conditions.push(`a.status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.query(
      `SELECT COUNT(*) FROM assignments a WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0]?.count || '0', 10);

    const offset = (page - 1) * limit;
    const dataResult = await this.query(
      `SELECT a.*,
              s.code AS subject_code,
              s.name AS subject_name,
              b.name AS batch_name,
              t.first_name || ' ' || t.last_name AS teacher_name,
              (SELECT COUNT(*) FROM assignment_submissions WHERE assignment_id = a.id) AS submission_count
       FROM assignments a
       LEFT JOIN subjects s ON a.subject_id = s.id
       LEFT JOIN batches b ON a.batch_id = b.id
       LEFT JOIN users t ON a.teacher_id = t.id
       WHERE ${whereClause}
       ORDER BY a.submission_deadline DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: dataResult.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Create a new assignment.
   */
  async create(data: CreateAssignmentData) {
    const result = await this.query(
      `INSERT INTO assignments (subject_id, batch_id, teacher_id, title, description, instructions, max_marks, submission_deadline, late_submission_allowed, late_penalty_percentage, rubric)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        data.subject_id,
        data.batch_id,
        data.teacher_id,
        data.title,
        data.description || null,
        data.instructions || null,
        data.max_marks,
        data.submission_deadline,
        data.late_submission_allowed !== false,
        data.late_penalty_percentage ?? 0,
        data.rubric ? JSON.stringify(data.rubric) : '{}',
      ]
    );
    return result.rows[0];
  }

  /**
   * Get a single assignment by ID with related names.
   */
  async findById(id: string) {
    const result = await this.queryOne(
      `SELECT a.*,
              s.code AS subject_code,
              s.name AS subject_name,
              b.name AS batch_name,
              t.first_name || ' ' || t.last_name AS teacher_name
       FROM assignments a
       LEFT JOIN subjects s ON a.subject_id = s.id
       LEFT JOIN batches b ON a.batch_id = b.id
       LEFT JOIN users t ON a.teacher_id = t.id
       WHERE a.id = $1`,
      [id]
    );
    return result;
  }

  /**
   * Get all submissions for an assignment with student details.
   */
  async getSubmissions(assignmentId: string) {
    const result = await this.queryAll(
      `SELECT ast.*,
              u.first_name || ' ' || u.last_name AS student_name,
              u.student_id AS roll_number
       FROM assignment_submissions ast
       INNER JOIN users u ON ast.student_id = u.id
       WHERE ast.assignment_id = $1
       ORDER BY ast.submitted_at DESC`,
      [assignmentId]
    );
    return result;
  }

  /**
   * Submit or update a student's assignment submission.
   * Uses ON CONFLICT to allow resubmission.
   */
  async submit(data: SubmitAssignmentData) {
    // Determine if submission is late by comparing against the deadline
    const assignment = await this.findById(data.assignment_id);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const submittedAt = data.submitted_at || new Date();
    const isLate = data.is_late ?? (submittedAt > new Date(assignment.submission_deadline));

    const result = await this.query(
      `INSERT INTO assignment_submissions (assignment_id, student_id, submitted_at, is_late, status)
       VALUES ($1, $2, $3, $4, 'submitted')
       ON CONFLICT (assignment_id, student_id)
       DO UPDATE SET submitted_at = $3, is_late = $4, status = 'submitted', updated_at = NOW()
       RETURNING *`,
      [data.assignment_id, data.student_id, submittedAt, isLate]
    );
    return result.rows[0];
  }

  /**
   * Evaluate a submission with marks and feedback.
   * Updates submission status to 'evaluated'.
   */
  async evaluate(submissionId: string, marks: number, feedback: string, evaluatorId: string) {
    const result = await this.query(
      `UPDATE assignment_submissions
       SET marks_obtained = $1, feedback = $2, evaluated_by = $3, evaluated_at = NOW(), status = 'evaluated', updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [marks, feedback, evaluatorId, submissionId]
    );
    return result.rows[0];
  }
}
