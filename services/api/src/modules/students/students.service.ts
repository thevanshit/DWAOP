import { StudentsRepository, StudentFilters, AttendanceFilters, MarksFilters, StudentUpdateData } from './students.repository';
import { logger } from '@/utils/logger';

export class StudentsService {
  private repository: StudentsRepository;

  constructor(repository?: StudentsRepository) {
    this.repository = repository || new StudentsRepository();
  }

  /**
   * List students with filters and pagination.
   */
  async list(filters: StudentFilters) {
    try {
      const result = await this.repository.findAll(filters);
      return {
        success: true,
        data: result.data.map(this.formatStudent),
        pagination: result.pagination,
      };
    } catch (error) {
      logger.error('StudentsService.list failed', error);
      throw error;
    }
  }

  /**
   * Get student by ID.
   */
  async getById(id: string) {
    try {
      const student = await this.repository.findById(id);
      if (!student) {
        return { success: false, error: 'Student not found', status: 404 };
      }
      return { success: true, data: this.formatStudentDetail(student) };
    } catch (error) {
      logger.error('StudentsService.getById failed', { id, error });
      throw error;
    }
  }

  /**
   * Get at-risk students.
   */
  async getAtRisk(departmentId?: string) {
    try {
      const students = await this.repository.findAtRisk(departmentId);
      return {
        success: true,
        data: students.map(this.formatStudentBrief),
      };
    } catch (error) {
      logger.error('StudentsService.getAtRisk failed', error);
      throw error;
    }
  }

  /**
   * Get student attendance records.
   */
  async getAttendance(studentId: string, filters: AttendanceFilters = {}) {
    try {
      const student = await this.repository.findById(studentId);
      if (!student) {
        return { success: false, error: 'Student not found', status: 404 };
      }

      const records = await this.repository.getAttendance(studentId, filters);
      return {
        success: true,
        data: records.map((r: any) => ({
          id: r.id,
          sessionId: r.session_id,
          status: r.status,
          markedAt: r.marked_at,
          scheduledDate: r.scheduled_date,
          subjectCode: r.subject_code,
          subjectName: r.subject_name,
        })),
      };
    } catch (error) {
      logger.error('StudentsService.getAttendance failed', { studentId, error });
      throw error;
    }
  }

  /**
   * Get student assignments.
   */
  async getAssignments(studentId: string) {
    try {
      const student = await this.repository.findById(studentId);
      if (!student) {
        return { success: false, error: 'Student not found', status: 404 };
      }

      const assignments = await this.repository.getAssignments(studentId);
      return {
        success: true,
        data: assignments.map((a: any) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          subjectCode: a.subject_code,
          subjectName: a.subject_name,
          batchName: a.batch_name,
          maxMarks: a.max_marks,
          deadline: a.submission_deadline,
          submissionCount: a.submission_count,
        })),
      };
    } catch (error) {
      logger.error('StudentsService.getAssignments failed', { studentId, error });
      throw error;
    }
  }

  /**
   * Get student marks.
   */
  async getMarks(studentId: string, filters: MarksFilters = {}) {
    try {
      const student = await this.repository.findById(studentId);
      if (!student) {
        return { success: false, error: 'Student not found', status: 404 };
      }

      const marks = await this.repository.getMarks(studentId, filters);
      return {
        success: true,
        data: marks.map((m: any) => ({
          id: m.id,
          subjectCode: m.subject_code,
          subjectName: m.subject_name,
          batchName: m.batch_name,
          assignmentMarks: m.assignment_marks,
          testMarks: m.test_marks,
          attendanceMarks: m.attendance_marks,
          totalMarks: m.total_marks,
          maxTotalMarks: m.max_total_marks,
          status: m.status,
        })),
      };
    } catch (error) {
      logger.error('StudentsService.getMarks failed', { studentId, error });
      throw error;
    }
  }

  /**
   * Check student exam eligibility.
   */
  async getEligibility(studentId: string) {
    try {
      const eligibility = await this.repository.getEligibility(studentId);
      if (!eligibility) {
        return { success: false, error: 'Student not found', status: 404 };
      }
      return { success: true, data: eligibility };
    } catch (error) {
      logger.error('StudentsService.getEligibility failed', { studentId, error });
      throw error;
    }
  }

  /**
   * Update student profile.
   */
  async update(id: string, data: StudentUpdateData) {
    try {
      const existing = await this.repository.findById(id);
      if (!existing) {
        return { success: false, error: 'Student not found', status: 404 };
      }

      const updated = await this.repository.update(id, data);
      return {
        success: true,
        data: {
          id: updated.id,
          email: updated.email,
          firstName: updated.first_name,
          lastName: updated.last_name,
          phone: updated.phone,
          avatarUrl: updated.avatar_url,
        },
      };
    } catch (error) {
      logger.error('StudentsService.update failed', { id, error });
      throw error;
    }
  }

  // ─── Response Formatters ───────────────────────────────────

  private formatStudent(s: any) {
    return {
      id: s.id,
      email: s.email,
      firstName: s.first_name,
      lastName: s.last_name,
      studentId: s.student_id,
      phone: s.phone,
      avatarUrl: s.avatar_url,
      isActive: s.is_active,
      batchId: s.batch_id,
      semester: s.current_semester,
      cgpa: s.cgpa,
      eligibilityStatus: s.eligibility_status,
      riskIndicators: s.risk_indicators,
      createdAt: s.created_at,
    };
  }

  private formatStudentDetail(s: any) {
    return {
      ...this.formatStudent(s),
      totalCredits: s.total_credits,
      departmentName: s.department_name,
      departmentCode: s.department_code,
    };
  }

  private formatStudentBrief(s: any) {
    return {
      id: s.id,
      email: s.email,
      firstName: s.first_name,
      lastName: s.last_name,
      studentId: s.student_id,
      phone: s.phone,
      batchId: s.batch_id,
      semester: s.current_semester,
      cgpa: s.cgpa,
      eligibilityStatus: s.eligibility_status,
      riskIndicators: s.risk_indicators,
    };
  }
}
