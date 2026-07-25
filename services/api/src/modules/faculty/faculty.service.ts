import { FacultyRepository, FacultyFilters } from './faculty.repository';
import { logger } from '@/utils/logger';

export class FacultyService {
  private repository: FacultyRepository;

  constructor(repository?: FacultyRepository) {
    this.repository = repository || new FacultyRepository();
  }

  /**
   * List faculty members with filters and pagination.
   */
  async list(filters: FacultyFilters) {
    try {
      const result = await this.repository.findAll(filters);
      return {
        success: true,
        data: result.data.map(this.formatFacultyMember),
        pagination: result.pagination,
      };
    } catch (error) {
      logger.error('FacultyService.list failed', error);
      throw error;
    }
  }

  /**
   * Get faculty member by ID.
   */
  async getById(id: string) {
    try {
      const faculty = await this.repository.findById(id);
      if (!faculty) {
        return { success: false, error: 'Faculty not found', status: 404 };
      }
      return { success: true, data: this.formatFacultyDetail(faculty) };
    } catch (error) {
      logger.error('FacultyService.getById failed', { id, error });
      throw error;
    }
  }

  /**
   * Get workload summary for a faculty member.
   */
  async getWorkload(id: string) {
    try {
      const faculty = await this.repository.findById(id);
      if (!faculty) {
        return { success: false, error: 'Faculty not found', status: 404 };
      }

      const workload = await this.repository.getWorkload(id);
      return {
        success: true,
        data: {
          batches: workload.batches,
          subjects: workload.subjects,
          pendingTasks: workload.pendingTasks,
          pendingMarks: workload.pendingMarks,
        },
      };
    } catch (error) {
      logger.error('FacultyService.getWorkload failed', { id, error });
      throw error;
    }
  }

  /**
   * Get batches assigned to a faculty member.
   */
  async getBatches(id: string) {
    try {
      const faculty = await this.repository.findById(id);
      if (!faculty) {
        return { success: false, error: 'Faculty not found', status: 404 };
      }

      const batches = await this.repository.getBatches(id);
      return { success: true, data: batches };
    } catch (error) {
      logger.error('FacultyService.getBatches failed', { id, error });
      throw error;
    }
  }

  /**
   * Get subjects assigned to a faculty member.
   */
  async getSubjects(id: string) {
    try {
      const faculty = await this.repository.findById(id);
      if (!faculty) {
        return { success: false, error: 'Faculty not found', status: 404 };
      }

      const subjects = await this.repository.getSubjects(id);
      return { success: true, data: subjects };
    } catch (error) {
      logger.error('FacultyService.getSubjects failed', { id, error });
      throw error;
    }
  }

  // ─── Response Formatters ───────────────────────────────────

  private formatFacultyMember(f: any) {
    return {
      id: f.id,
      email: f.email,
      firstName: f.first_name,
      lastName: f.last_name,
      role: f.role,
      employeeId: f.employee_id,
      phone: f.phone,
      avatarUrl: f.avatar_url,
      isActive: f.is_active,
      departmentName: f.department_name,
      createdAt: f.created_at,
    };
  }

  private formatFacultyDetail(f: any) {
    return {
      ...this.formatFacultyMember(f),
      departmentId: f.department_id,
      departmentCode: f.department_code,
    };
  }
}
