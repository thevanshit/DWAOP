import {
  AssignmentsRepository,
  AssignmentFilters,
  CreateAssignmentData,
  SubmitAssignmentData,
} from './assignments.repository';

/**
 * Business logic layer for assignment operations.
 * Orchestrates repository calls and applies domain rules.
 */
export class AssignmentsService {
  constructor(private repository: AssignmentsRepository) {}

  /**
   * List assignments with pagination and filters.
   */
  async list(filters: AssignmentFilters) {
    return this.repository.findAll(filters);
  }

  /**
   * Create a new assignment.
   */
  async create(data: CreateAssignmentData) {
    return this.repository.create(data);
  }

  /**
   * Get assignment by ID.
   */
  async getById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Get all submissions for an assignment.
   */
  async getSubmissions(assignmentId: string) {
    return this.repository.getSubmissions(assignmentId);
  }

  /**
   * Submit an assignment (student submission).
   */
  async submit(assignmentId: string, studentId: string) {
    const data: SubmitAssignmentData = {
      assignment_id: assignmentId,
      student_id: studentId,
      submitted_at: new Date(),
    };
    return this.repository.submit(data);
  }

  /**
   * Evaluate a submission with marks and feedback.
   */
  async evaluate(submissionId: string, marks: number, feedback: string, evaluatorId: string) {
    return this.repository.evaluate(submissionId, marks, feedback, evaluatorId);
  }
}
