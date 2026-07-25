import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { StudentsService } from './students.service';

/**
 * Factory function to create student controller handlers with injected service.
 */
export function createStudentController(service: StudentsService) {
  /**
   * GET /api/students
   * List all students with optional filters.
   */
  async function listStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { page, limit, batchId, departmentId, search, status } = req.query;
      const result = await service.list({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        batchId: batchId as string,
        departmentId: departmentId as string,
        search: search as string,
        status: status as 'active' | 'inactive' | undefined,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/at-risk
   * Get students at risk of academic ineligibility.
   */
  async function getAtRiskStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { departmentId } = req.query;
      const result = await service.getAtRisk(departmentId as string);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/:id
   * Get student details by ID.
   */
  async function getStudentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const studentId = req.params.id as string;
      const result = await service.getById(studentId);
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
   * GET /api/students/:id/attendance
   * Get attendance history for a student.
   */
  async function getStudentAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { batchId, subjectId, startDate, endDate } = req.query;
      const studentId = req.params.id as string;
      const result = await service.getAttendance(studentId, {
        batchId: batchId as string,
        subjectId: subjectId as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

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
   * GET /api/students/:id/assignments
   * Get assignments for a student.
   */
  async function getStudentAssignments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const studentId = req.params.id as string;
      const result = await service.getAssignments(studentId);
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
   * GET /api/students/:id/marks
   * Get marks for a student.
   */
  async function getStudentMarks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { subjectId, batchId } = req.query;
      const studentId = req.params.id as string;
      const result = await service.getMarks(studentId, {
        subjectId: subjectId as string,
        batchId: batchId as string,
      });

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
   * GET /api/students/:id/eligibility
   * Check exam eligibility for a student.
   */
  async function getStudentEligibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const studentId = req.params.id as string;
      const result = await service.getEligibility(studentId);
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
   * PUT /api/students/:id
   * Update student profile.
   */
  async function updateStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const studentId = req.params.id as string;
      if (!studentId) {
        res.status(400).json({ error: 'Student ID is required' });
        return;
      }

      const { firstName, lastName, phone, avatarUrl } = req.body;
      const result = await service.update(studentId, { firstName, lastName, phone, avatarUrl });

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
    listStudents,
    getAtRiskStudents,
    getStudentById,
    getStudentAttendance,
    getStudentAssignments,
    getStudentMarks,
    getStudentEligibility,
    updateStudent,
  };
}
