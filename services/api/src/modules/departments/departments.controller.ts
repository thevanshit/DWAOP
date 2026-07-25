import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { DepartmentsService } from './departments.service';

/**
 * Factory function to create department controller handlers with injected service.
 */
export function createDepartmentController(service: DepartmentsService) {
  /**
   * GET /api/departments
   * List all active departments.
   */
  async function listDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await service.list();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/departments/:id
   * Get department details by ID.
   */
  async function getDepartmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const result = await service.getById(req.params.id as string);
      if (!result.success) {
        res.status(result.status || 400).json({ error: result.error });
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  return {
    listDepartments,
    getDepartmentById,
  };
}
