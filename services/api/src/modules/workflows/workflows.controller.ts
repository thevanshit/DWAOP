import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { WorkflowsService } from './workflows.service';
import { logger } from '@/utils/logger';

/**
 * Controller for workflow endpoints.
 * Handles HTTP request/response lifecycle, delegating business logic to WorkflowsService.
 */
export class WorkflowsController {
  private service: WorkflowsService;

  constructor(service: WorkflowsService) {
    this.service = service;
  }

  /** Safely extract required param */
  private paramId(req: Request): string {
    if (!req.params.id) {
      throw new Error('Missing required parameter: id');
    }
    return req.params.id;
  }

  /**
   * POST /api/workflows
   * Create a new workflow.
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { type, title, description, assigneeId, priority, dueDate, metadata } = req.body;

      const workflow = await this.service.create(
        {
          type,
          title,
          description,
          assigneeId,
          priority,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          metadata,
        },
        {
          id: req.user.id,
          role: req.user.role,
          permissions: req.user.permissions,
          departmentId: req.user.departmentId,
        }
      );

      res.status(201).json({
        success: true,
        data: { workflow },
      });
    } catch (error) {
      logger.error('Workflow creation failed', error);
      next(error);
    }
  };

  /**
   * GET /api/workflows
   * List workflows with pagination and filters.
   */
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { type, assigneeId, status, priority, departmentId, page, limit } = req.query;

      const result = await this.service.list(
        {
          type: type as string | undefined,
          assigneeId: assigneeId as string | undefined,
          status: status as string | undefined,
          priority: priority as string | undefined,
          departmentId: departmentId as string | undefined,
        },
        page ? parseInt(page as string, 10) : 1,
        limit ? parseInt(limit as string, 10) : 20
      );

      res.json({
        success: true,
        data: {
          workflows: result.workflows,
          pagination: result.pagination,
        },
      });
    } catch (error) {
      logger.error('Get workflows failed', error);
      next(error);
    }
  };

  /**
   * GET /api/workflows/:id
   * Get a specific workflow by ID.
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workflow = await this.service.getById(this.paramId(req));

      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }

      res.json({
        success: true,
        data: { workflow },
      });
    } catch (error) {
      logger.error('Get workflow failed', error);
      next(error);
    }
  };

  /**
   * POST /api/workflows/:id/transition
   * Transition a workflow to a new state.
   */
  transition = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { toState, reason } = req.body;

      const workflow = await this.service.transition(
        this.paramId(req),
        toState,
        reason,
        {
          id: req.user.id,
          role: req.user.role,
          permissions: req.user.permissions,
          departmentId: req.user.departmentId,
        }
      );

      res.json({
        success: true,
        data: { workflow },
      });

      logger.info(`Workflow ${this.paramId(req)} transitioned to ${toState} by user ${req.user.id}`);
    } catch (error) {
      logger.error('Workflow transition failed', error);
      next(error);
    }
  };

  /**
   * GET /api/workflows/type-definitions
   * Get available workflow type definitions.
   */
  getTypeDefinitions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workflowTypes = this.service.getTypeDefinitions();

      res.json({
        success: true,
        data: { workflowTypes },
      });
    } catch (error) {
      logger.error('Get workflow types failed', error);
      next(error);
    }
  };

  /**
   * GET /api/workflows/:id/history
   * Get workflow transition history.
   */
  getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const history = await this.service.getHistory(this.paramId(req));

      res.json({
        success: true,
        data: { history },
      });
    } catch (error) {
      logger.error('Get workflow history failed', error);
      next(error);
    }
  };

  /**
   * GET /api/workflows/:id/comments
   * Get comments for a workflow.
   */
  getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comments = await this.service.getComments(this.paramId(req));

      res.json({
        success: true,
        data: { comments },
      });
    } catch (error) {
      logger.error('Get workflow comments failed', error);
      next(error);
    }
  };

  /**
   * POST /api/workflows/:id/comments
   * Add a comment to a workflow.
   */
  addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { comment, isInternal } = req.body;

      const newComment = await this.service.addComment({
        workflowId: this.paramId(req),
        commenterId: req.user.id,
        comment,
        isInternal: isInternal ?? false,
      });

      res.status(201).json({
        success: true,
        data: { comment: newComment },
      });

      logger.info(`Comment added to workflow ${this.paramId(req)} by user ${req.user.id}`);
    } catch (error) {
      logger.error('Add workflow comment failed', error);
      next(error);
    }
  };
}
