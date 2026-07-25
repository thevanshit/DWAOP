import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { DashboardService } from './dashboard.service';
import { logger } from '@/utils/logger';

/**
 * Controller for dashboard endpoints.
 * Handles HTTP request/response lifecycle, delegating business logic to DashboardService.
 */
export class DashboardController {
  private service: DashboardService;

  constructor(service: DashboardService) {
    this.service = service;
  }

  /**
   * GET /api/dashboard/stats
   * Get dashboard statistics for the current user (role-based).
   */
  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const stats = await this.service.getStats({
        id: req.user.id,
        role: req.user.role,
        permissions: req.user.permissions,
        departmentId: req.user.departmentId,
      });

      res.json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      logger.error('Get dashboard stats failed', error);
      next(error);
    }
  };

  /**
   * GET /api/dashboard/workflows
   * Get workflows relevant to the user's dashboard (role-based).
   */
  getWorkflows = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const { type, status, limit } = req.query;

      const workflows = await this.service.getWorkflows(
        {
          id: req.user.id,
          role: req.user.role,
          permissions: req.user.permissions,
          departmentId: req.user.departmentId,
        },
        {
          type: type as string | undefined,
          status: status as string | undefined,
          limit: limit ? parseInt(limit as string, 10) : undefined,
        }
      );

      res.json({
        success: true,
        data: { workflows },
      });
    } catch (error) {
      logger.error('Get dashboard workflows failed', error);
      next(error);
    }
  };

  /**
   * GET /api/dashboard/analytics
   * Get analytics data for the dashboard (role-based).
   */
  getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const analytics = await this.service.getAnalytics({
        id: req.user.id,
        role: req.user.role,
        permissions: req.user.permissions,
        departmentId: req.user.departmentId,
      });

      res.json({
        success: true,
        data: { analytics },
      });
    } catch (error) {
      logger.error('Get dashboard analytics failed', error);
      next(error);
    }
  };
}
