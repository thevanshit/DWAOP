import { DepartmentsRepository } from './departments.repository';
import { logger } from '@/utils/logger';

export class DepartmentsService {
  private repository: DepartmentsRepository;

  constructor(repository?: DepartmentsRepository) {
    this.repository = repository || new DepartmentsRepository();
  }

  /**
   * List all active departments.
   */
  async list() {
    try {
      const departments = await this.repository.findAll();
      return {
        success: true,
        data: departments.map((d: any) => ({
          id: d.id,
          name: d.name,
          code: d.code,
          description: d.description,
          hodId: d.hod_id,
          isActive: d.is_active,
          facultyCount: parseInt(d.faculty_count || '0', 10),
          studentCount: parseInt(d.student_count || '0', 10),
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        })),
      };
    } catch (error) {
      logger.error('DepartmentsService.list failed', error);
      throw error;
    }
  }

  /**
   * Get department by ID.
   */
  async getById(id: string) {
    try {
      const department = await this.repository.findById(id);
      if (!department) {
        return { success: false, error: 'Department not found', status: 404 };
      }
      return {
        success: true,
        data: {
          id: department.id,
          name: department.name,
          code: department.code,
          description: department.description,
          hodId: department.hod_id,
          isActive: department.is_active,
          facultyCount: parseInt(department.faculty_count || '0', 10),
          studentCount: parseInt(department.student_count || '0', 10),
          createdAt: department.created_at,
          updatedAt: department.updated_at,
        },
      };
    } catch (error) {
      logger.error('DepartmentsService.getById failed', { id, error });
      throw error;
    }
  }
}
