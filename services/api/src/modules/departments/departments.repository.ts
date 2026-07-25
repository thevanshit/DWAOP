import { BaseRepository } from '@/core/repository';
import { logger } from '@/utils/logger';

export class DepartmentsRepository extends BaseRepository {
  /**
   * List all active departments with faculty and student counts.
   */
  async findAll() {
    return this.queryAll(
      `SELECT d.*, 
              (SELECT COUNT(*) FROM users WHERE department_id = d.id AND role IN ('teacher', 'hod', 'dept_admin')) AS faculty_count,
              (SELECT COUNT(*) FROM users WHERE department_id = d.id AND role = 'student') AS student_count
       FROM departments d
       WHERE d.is_active = true
       ORDER BY d.name`
    );
  }

  /**
   * Get department by ID with faculty and student counts.
   */
  async findById(id: string) {
    return this.queryOne(
      `SELECT d.*, 
              (SELECT COUNT(*) FROM users WHERE department_id = d.id AND role IN ('teacher', 'hod', 'dept_admin')) AS faculty_count,
              (SELECT COUNT(*) FROM users WHERE department_id = d.id AND role = 'student') AS student_count
       FROM departments d
       WHERE d.id = $1`,
      [id]
    );
  }
}
