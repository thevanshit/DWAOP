import { Router, Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { WorkflowEngine } from '@/core/workflow/engine';
import { logger } from '@/utils/logger';

export const createWorkflowRoutes = (workflowEngine: WorkflowEngine): Router => {
  const router = Router();

  /**
   * POST /api/workflows
   * Create a new workflow
   */
  router.post('/', [
    body('type').isIn(['attendance_session', 'assignment', 'internal_marks', 'leave_request', 'student_track_report']),
    body('title').isLength({ min: 3, max: 500 }).trim(),
    body('description').optional().isLength({ max: 2000 }),
    body('assigneeId').optional().isUUID(),
    body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
    body('dueDate').optional().isISO8601(),
    body('metadata').optional().isObject(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required'
        });
        return;
      }

      const { type, title, description, assigneeId, priority, dueDate, metadata } = req.body;

      // Create workflow context
      const context = {
        workflow: {} as any,
        user: {
          id: req.user.id,
          role: req.user.role,
          permissions: req.user.permissions,
          departmentId: req.user.departmentId
        },
        metadata: {}
      };

      const workflow = await workflowEngine.createWorkflow(type, {
        title,
        description,
        assigneeId,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        metadata,
        departmentId: req.user.departmentId
      }, context);

      res.status(201).json({
        success: true,
        data: { workflow }
      });

      logger.info(`Workflow created: ${workflow.id} of type ${type}`);
      return;
    } catch (error) {
      logger.error('Workflow creation failed', error);
      next(error);
      return;
    }
  });

  /**
   * GET /api/workflows
   * Get workflows with filters
   */
  router.get('/', [
    query('type').optional().isIn(['attendance_session', 'assignment', 'internal_marks', 'leave_request', 'student_track_report']),
    query('assigneeId').optional().isUUID(),
    query('status').optional().isString(),
    query('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
    query('departmentId').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { type, assigneeId, status, priority, departmentId, page = 1, limit = 20 } = req.query;

      const workflows = await workflowEngine.getWorkflows(
        type as string,
        {
          assigneeId: assigneeId as string,
          status: status as string,
          priority: priority as string,
          departmentId: departmentId as string
        }
      );

      // Apply pagination
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedWorkflows = workflows.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          workflows: paginatedWorkflows,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: workflows.length,
            pages: Math.ceil(workflows.length / Number(limit))
          }
        }
      });
      return;
    } catch (error) {
      logger.error('Get workflows failed', error);
      next(error);
      return;
    }
  });

  /**
   * GET /api/workflows/:id
   * Get specific workflow
   */
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const workflow = await workflowEngine.getWorkflow(id);
      if (!workflow) {
        res.status(404).json({
          error: 'Workflow not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { workflow }
      });
      return;
    } catch (error) {
      logger.error('Get workflow failed', error);
      next(error);
      return;
    }
  });

  /**
   * POST /api/workflows/:id/transition
   * Transition workflow to new state
   */
  router.post('/:id/transition', [
    body('toState').isString().isLength({ min: 1 }),
    body('reason').optional().isLength({ max: 500 }),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required'
        });
        return;
      }

      const id = req.params.id as string;
      const { toState, reason } = req.body;

      const context = {
        workflow: {} as any,
        user: {
          id: req.user.id,
          role: req.user.role,
          permissions: req.user.permissions
        },
        metadata: {}
      };

      const workflow = await workflowEngine.transitionWorkflow(id, toState, context, reason || '');

      res.json({
        success: true,
        data: { workflow }
      });

      logger.info(`Workflow ${id} transitioned to ${toState} by user ${req.user.id}`);
      return;
    } catch (error) {
      logger.error('Workflow transition failed', error);
      next(error);
      return;
    }
  });

  /**
   * GET /api/workflows/types
   * Get available workflow types
   */
  router.get('/type-definitions', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // This would return the workflow types defined in the system
      const workflowTypes = [
        {
          id: 'attendance_session',
          name: 'Attendance Session',
          description: 'Manage lecture attendance sessions',
          states: ['created', 'open', 'closed', 'finalised', 'locked']
        },
        {
          id: 'assignment',
          name: 'Assignment',
          description: 'Manage assignments and submissions',
          states: ['created', 'assigned', 'submission_open', 'submission_closed', 'evaluation', 'evaluated', 'finalised', 'locked']
        },
        {
          id: 'internal_marks',
          name: 'Internal Marks',
          description: 'Manage internal assessment marks',
          states: ['draft', 'submitted', 'under_review', 'finalised', 'locked']
        },
        {
          id: 'leave_request',
          name: 'Leave Request',
          description: 'Manage student leave requests',
          states: ['created', 'under_review', 'approved', 'rejected', 'emergency']
        },
        {
          id: 'student_track_report',
          name: 'Student Track Report',
          description: 'Comprehensive student academic tracking',
          states: ['draft', 'submitted', 'under_review', 'finalised', 'locked']
        }
      ];

      res.json({
        success: true,
        data: { workflowTypes }
      });
      return;
    } catch (error) {
      logger.error('Get workflow types failed', error);
      next(error);
      return;
    }
  });

  /**
   * GET /api/workflows/:id/history
   * Get workflow transition history
   */
  router.get('/:id/history', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      // This would query the workflow_transitions table
      // For now, returning a placeholder
      const history = [
        {
          id: '1',
          fromState: null,
          toState: 'created',
          transitionedBy: 'user_id',
          reason: 'Workflow created',
          transitionedAt: new Date().toISOString()
        }
      ];

      res.json({
        success: true,
        data: { history }
      });
      return;
    } catch (error) {
      logger.error('Get workflow history failed', error);
      next(error);
      return;
    }
  });

  /**
   * GET /api/workflows/:id/comments
   * Get workflow comments
   */
  router.get('/:id/comments', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      // This would query the workflow_comments table
      // For now, returning a placeholder
      const comments: any[] = [];

      res.json({
        success: true,
        data: { comments }
      });
      return;
    } catch (error) {
      logger.error('Get workflow comments failed', error);
      next(error);
      return;
    }
  });

  /**
   * POST /api/workflows/:id/comments
   * Add comment to workflow
   */
  router.post('/:id/comments', [
    body('comment').isLength({ min: 1, max: 2000 }).trim(),
    body('isInternal').optional().isBoolean(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required'
        });
        return;
      }

      const id = req.params.id as string;
      const { comment, isInternal } = req.body;

      // This would insert into workflow_comments table
      // For now, returning a placeholder
      const newComment = {
        id: 'new_comment_id',
        workflowId: id,
        commenterId: req.user.id,
        comment,
        isInternal: isInternal || false,
        createdAt: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        data: { comment: newComment }
      });

      logger.info(`Comment added to workflow ${id} by user ${req.user.id}`);
      return;
    } catch (error) {
      logger.error('Add workflow comment failed', error);
      next(error);
      return;
    }
  });

  return router;
};