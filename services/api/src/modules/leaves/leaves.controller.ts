import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { LeavesService } from './leaves.service';
import { logger } from '@/utils/logger';

/**
 * Controller for leave request endpoints.
 * Handles HTTP request/response lifecycle, delegating business logic to LeavesService.
 */
export class LeavesController {
  private service: LeavesService;

  constructor(service: LeavesService) {
    this.service = service;
  }

  /**
   * GET /api/leaves
   * List leave requests with pagination and optional filters.
   */
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { page, limit, studentId, status, leaveType } = req.query;

      const result = await this.service.list({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        studentId: studentId as string | undefined,
        status: status as string | undefined,
        leaveType: leaveType as string | undefined,
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Get leaves failed', error);
      next(error);
    }
  };

  /**
   * GET /api/leaves/pending
   * Get all pending leave requests (for teachers/admins).
   */
  getPending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await this.service.getPending(page, limit);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Get pending leaves failed', error);
      next(error);
    }
  };

  /**
   * POST /api/leaves
   * Create a new leave request with workflow.
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

      const { leaveType, startDate, endDate, totalDays, reason, supportingDocuments, isEmergency } = req.body;

      const result = await this.service.create(
        {
          studentId: req.user.id,
          leaveType,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalDays,
          reason,
          supportingDocuments,
          isEmergency,
        },
        {
          user: {
            id: req.user.id,
            role: req.user.role,
            permissions: req.user.permissions,
            departmentId: req.user.departmentId,
          },
        }
      );

      res.status(201).json({
        success: true,
        data: result.leave,
        workflow: result.workflow,
      });
    } catch (error) {
      logger.error('Create leave failed', error);
      next(error);
    }
  };

  /**
   * GET /api/leaves/:id
   * Get leave request by ID.
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const leave = await this.service.getById(req.params.id as string);

      if (!leave) {
        res.status(404).json({ error: 'Leave request not found' });
        return;
      }

      res.json({
        success: true,
        data: leave,
      });
    } catch (error) {
      logger.error('Get leave failed', error);
      next(error);
    }
  };

  /**
   * PUT /api/leaves/:id/approve
   * Approve a leave request (teacher/admin only).
   */
  approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const result = await this.service.approve(req.params.id as string, {
        user: {
          id: req.user.id,
          role: req.user.role,
          permissions: req.user.permissions,
          departmentId: req.user.departmentId,
        },
      });

      res.json({
        success: true,
        data: result.leave,
        workflow: result.workflow,
      });
    } catch (error) {
      logger.error('Approve leave failed', error);
      next(error);
    }
  };

  /**
   * PUT /api/leaves/:id/reject
   * Reject a leave request (teacher/admin only).
   */
  reject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const { reason } = req.body;

      const result = await this.service.reject(req.params.id as string, reason, {
        user: {
          id: req.user.id,
          role: req.user.role,
          permissions: req.user.permissions,
          departmentId: req.user.departmentId,
        },
      });

      res.json({
        success: true,
        data: result.leave,
        workflow: result.workflow,
      });
    } catch (error) {
      logger.error('Reject leave failed', error);
      next(error);
    }
  };
}
