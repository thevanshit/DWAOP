import { BaseRepository } from '@/core/repository';
import { logger } from '@/utils/logger';

export interface FacultyFilters {
  departmentId?: string;
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export class FacultyRepository extends BaseRepository {
  /**
   * List faculty members with filtering, search, and pagination.
   * Joins with departments for department name.
   */
  async findAll(filters: FacultyFilters) {
    const { departmentId, search, role, page = 1, limit = 20 } = filters;
    const conditions: string[] = [`u.role IN ('teacher', 'hod', 'admin', 'guest_faculty', 'dept_admin')`];
    const params: any[] = [];
    let paramIndex = 1;

    if (departmentId) {
      conditions.push(`u.department_id = $${paramIndex++}`);
      params.push(departmentId);
    }

    if (role) {
      conditions.push(`u.role = $${paramIndex++}`);
      params.push(role);
    }

    if (search) {
      conditions.push(
        `(u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.employee_id ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    const baseQuery = `
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE ${whereClause}
    `;

    const countResult = await this.queryOne(`SELECT COUNT(*) ${baseQuery}`, params);
    const total = parseInt(countResult?.count || '0', 10);

    const data = await this.queryAll(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.employee_id,
              u.phone, u.avatar_url, u.is_active, u.created_at,
              d.name AS department_name, d.code AS department_code
       ${baseQuery}
       ORDER BY u.role, u.first_name
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
   * Get faculty member by ID with department info.
   */
  async findById(id: string) {
    return this.queryOne(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.employee_id,
              u.phone, u.avatar_url, u.is_active, u.created_at,
              u.department_id, d.name AS department_name, d.code AS department_code
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = $1`,
      [id]
    );
  }

  /**
   * Get faculty workload including assigned batches, subjects, pending tasks, and pending marks.
   */
  async getWorkload(facultyId: string) {
    // Get assigned batches
    const batches = await this.queryAll(
      `SELECT DISTINCT b.id, b.name, b.program, b.semester, b.section, b.academic_year
       FROM batches b
       INNER JOIN student_subjects ss ON b.id = ss.batch_id
       WHERE ss.teacher_id = $1 AND b.is_active = true
       ORDER BY b.academic_year DESC, b.semester DESC`,
      [facultyId]
    );

    // Get assigned subjects
    const subjects = await this.queryAll(
      `SELECT DISTINCT s.id, s.code, s.name, s.credits
       FROM subjects s
       INNER JOIN student_subjects ss ON s.id = ss.subject_id
       WHERE ss.teacher_id = $1 AND s.is_active = true
       ORDER BY s.code`,
      [facultyId]
    );

    // Get pending tasks count (active workflows assigned to this faculty)
    const tasksResult = await this.queryOne(
      `SELECT COUNT(*) AS pending_count
       FROM workflows
       WHERE assignee_id = $1 AND status NOT IN ('done', 'locked')`,
      [facultyId]
    );

    // Get pending marks count
    const marksResult = await this.queryOne(
      `SELECT COUNT(*) AS pending_marks
       FROM internal_marks
       WHERE teacher_id = $1 AND status IN ('draft', 'submitted')`,
      [facultyId]
    );

    return {
      batches,
      subjects,
      pendingTasks: parseInt(tasksResult?.pending_count || '0', 10),
      pendingMarks: parseInt(marksResult?.pending_marks || '0', 10),
    };
  }

  /**
   * Get batches assigned to a faculty member.
   */
  async getBatches(facultyId: string) {
    const workload = await this.getWorkload(facultyId);
    return workload.batches;
  }

  /**
   * Get subjects assigned to a faculty member.
   */
  async getSubjects(facultyId: string) {
    const workload = await this.getWorkload(facultyId);
    return workload.subjects;
  }
}
