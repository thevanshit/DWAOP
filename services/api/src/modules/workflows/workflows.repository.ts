import { BaseRepository } from '@/core/repository';
import { logger } from '@/utils/logger';

/**
 * Workflow repository stub.
 * Workflow data is managed by the WorkflowEngine directly.
 * This repository is a placeholder for future direct database operations
 * such as workflow history queries, comments storage, and custom reports.
 */
export class WorkflowRepository extends BaseRepository {
  /**
   * Get the transition history for a workflow.
   */
  async getHistory(workflowId: string): Promise<any[]> {
    try {
      const rows = await this.queryAll(
        `SELECT wt.*, u.name AS transitioned_by_name
         FROM workflow_transitions wt
         LEFT JOIN users u ON wt.transitioned_by = u.id
         WHERE wt.workflow_id = $1
         ORDER BY wt.transitioned_at ASC`,
        [workflowId]
      );
      return rows;
    } catch (error) {
      logger.error(`Failed to fetch history for workflow ${workflowId}`, error);
      throw error;
    }
  }

  /**
   * Add a comment to a workflow.
   */
  async addComment(data: {
    workflowId: string;
    commenterId: string;
    comment: string;
    isInternal?: boolean;
  }): Promise<any> {
    try {
      const result = await this.queryOne(
        `INSERT INTO workflow_comments (workflow_id, commenter_id, comment, is_internal)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [data.workflowId, data.commenterId, data.comment, data.isInternal || false]
      );
      return result;
    } catch (error) {
      logger.error(`Failed to add comment to workflow ${data.workflowId}`, error);
      throw error;
    }
  }

  /**
   * Get all comments for a workflow.
   */
  async getComments(workflowId: string): Promise<any[]> {
    try {
      const rows = await this.queryAll(
        `SELECT wc.*, u.name AS commenter_name, u.role AS commenter_role
         FROM workflow_comments wc
         LEFT JOIN users u ON wc.commenter_id = u.id
         WHERE wc.workflow_id = $1
         ORDER BY wc.created_at ASC`,
        [workflowId]
      );
      return rows;
    } catch (error) {
      logger.error(`Failed to fetch comments for workflow ${workflowId}`, error);
      throw error;
    }
  }
}
