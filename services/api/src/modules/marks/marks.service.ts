import { MarksRepository, MarksFilters, EnterMarksData } from './marks.repository';

/**
 * Business logic layer for internal marks operations.
 * Orchestrates repository calls and enforces status lifecycle rules.
 */
export class MarksService {
  constructor(private repository: MarksRepository) {}

  /**
   * List marks with pagination and filters.
   */
  async list(filters: MarksFilters) {
    return this.repository.findAll(filters);
  }

  /**
   * Get marks filtered by subject (convenience wrapper).
   */
  async getSubjectMarks(subjectId: string, batchId?: string) {
    return this.repository.findAll({ subjectId, batchId, limit: 200 });
  }

  /**
   * Enter marks for a student. Delegates upsert to repository.
   */
  async enterMarks(data: EnterMarksData) {
    return this.repository.enter(data);
  }

  /**
   * Submit marks for review (draft → submitted).
   */
  async submitMarks(id: string) {
    return this.repository.updateStatus(id, 'submitted');
  }

  /**
   * Finalise marks (submitted → finalised).
   */
  async finaliseMarks(id: string) {
    return this.repository.updateStatus(id, 'finalised');
  }

  /**
   * Lock marks (finalised → locked). Locked marks cannot be modified.
   */
  async lockMarks(id: string) {
    return this.repository.updateStatus(id, 'locked');
  }
}
