import { Router, Request, Response, NextFunction } from 'express';
import { query, param, validationResult } from 'express-validator';
import DatabaseService from '@/services/database.service';
import { logger } from '@/utils/logger';

export const createFacultyRoutes = (): Router => {
  const router = Router();

  /**
   * GET /api/faculty
   * List all faculty members
   */
  router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('departmentId').optional().isUUID(),
    query('search').optional().isString(),
    query('role').optional().isString(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { page, limit, departmentId, search, role } = req.query;

      const result = await DatabaseService.getFaculty({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        departmentId: departmentId as string,
        search: search as string,
        role: role as string,
      });

      return res.json({
        success: true,
        data: result.data.map((f: any) => ({
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
        })),
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Get faculty failed', error);
      next(error);
    }
  });

  /**
   * GET /api/faculty/:id
   * Get faculty by ID
   */
  router.get('/:id', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const faculty = await DatabaseService.getFacultyById(req.params.id);

      if (!faculty) {
        return res.status(404).json({
          error: 'Faculty not found'
        });
      }

      return res.json({
        success: true,
        data: {
          id: faculty.id,
          email: faculty.email,
          firstName: faculty.first_name,
          lastName: faculty.last_name,
          role: faculty.role,
          employeeId: faculty.employee_id,
          phone: faculty.phone,
          avatarUrl: faculty.avatar_url,
          isActive: faculty.is_active,
          departmentId: faculty.department_id,
          departmentName: faculty.department_name,
          createdAt: faculty.created_at,
        }
      });
    } catch (error) {
      logger.error('Get faculty failed', error);
      next(error);
    }
  });

  /**
   * GET /api/faculty/:id/workload
   * Get faculty workload
   */
  router.get('/:id/workload', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const workload = await DatabaseService.getFacultyWorkload(req.params.id);

      return res.json({
        success: true,
        data: {
          batches: workload.batches,
          subjects: workload.subjects,
          pendingTasks: workload.pendingTasks,
          pendingMarks: workload.pendingMarks,
        }
      });
    } catch (error) {
      logger.error('Get faculty workload failed', error);
      next(error);
    }
  });

  /**
   * GET /api/faculty/:id/batches
   * Get faculty assigned batches
   */
  router.get('/:id/batches', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workload = await DatabaseService.getFacultyWorkload(req.params.id);

      return res.json({
        success: true,
        data: workload.batches
      });
    } catch (error) {
      logger.error('Get faculty batches failed', error);
      next(error);
    }
  });

  /**
   * GET /api/faculty/:id/subjects
   * Get faculty assigned subjects
   */
  router.get('/:id/subjects', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workload = await DatabaseService.getFacultyWorkload(req.params.id);

      return res.json({
        success: true,
        data: workload.subjects
      });
    } catch (error) {
      logger.error('Get faculty subjects failed', error);
      next(error);
    }
  });

  return router;
};
