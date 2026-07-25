import { AttendanceRepository, AttendanceSessionFilters, CreateSessionData, AttendanceRecordInput } from './attendance.repository';

/**
 * Business logic layer for attendance operations.
 * Orchestrates repository calls with validation and transformation.
 */
export class AttendanceService {
  constructor(private repository: AttendanceRepository) {}

  /**
   * List attendance sessions with pagination and filters.
   */
  async listSessions(filters: AttendanceSessionFilters) {
    return this.repository.getSessions(filters);
  }

  /**
   * Create a new attendance session.
   */
  async createSession(data: CreateSessionData) {
    return this.repository.createSession(data);
  }

  /**
   * Get a single session with its attendance records.
   */
  async getSessionById(id: string) {
    return this.repository.getSessionById(id);
  }

  /**
   * Mark attendance for a session.
   * Transforms request body into repository input format.
   */
  async markAttendance(sessionId: string, records: { studentId: string; status: string }[], userId: string) {
    const input: AttendanceRecordInput[] = records.map((r) => ({
      session_id: sessionId,
      student_id: r.studentId,
      status: r.status as AttendanceRecordInput['status'],
      marked_by: userId,
    }));

    return this.repository.markAttendance(input);
  }

  /**
   * Get batch attendance summary.
   */
  async getBatchAttendance(batchId: string, startDate?: string, endDate?: string) {
    return this.repository.getBatchAttendance(batchId, startDate, endDate);
  }
}
