import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { FacultyService } from './faculty.service';

/**
 * Factory function to create faculty controller handlers with injected service.
 */
export function createFacultyController(service: FacultyService) {
  /**
   * GET /api/faculty
   * List all faculty members with optional filters.
   */
  async function listFaculty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { page, limit, departmentId, search, role } = req.query;
      const result = await service.list({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        departmentId: departmentId as string,
        search: search as string,
        role: role as string,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/faculty/:id
   * Get faculty member details by ID.
   */
  async function getFacultyById(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  /**
   * GET /api/faculty/:id/workload
   * Get workload summary for a faculty member.
   */
  async function getFacultyWorkload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const result = await service.getWorkload(req.params.id as string);
      if (!result.success) {
        res.status(result.status || 400).json({ error: result.error });
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/faculty/:id/batches
   * Get batches assigned to a faculty member.
   */
  async function getFacultyBatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const result = await service.getBatches(req.params.id as string);
      if (!result.success) {
        res.status(result.status || 400).json({ error: result.error });
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/faculty/:id/subjects
   * Get subjects assigned to a faculty member.
   */
  async function getFacultySubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const result = await service.getSubjects(req.params.id as string);
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
    listFaculty,
    getFacultyById,
    getFacultyWorkload,
    getFacultyBatches,
    getFacultySubjects,
  };
}
