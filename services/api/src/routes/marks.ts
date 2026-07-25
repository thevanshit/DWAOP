import { Router, Request, Response, NextFunction } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import DatabaseService from '@/services/database.service';
import { logger } from '@/utils/logger';

export const createMarksRoutes = (): Router => {
  const router = Router();

  /**
   * GET /api/marks
   * List marks with filters
   */
  router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('batchId').optional().isUUID(),
    query('subjectId').optional().isUUID(),
    query('studentId').optional().isUUID(),
    query('teacherId').optional().isUUID(),
    query('status').optional().isIn(['draft', 'submitted', 'under_review', 'finalised', 'locked']),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { page, limit, batchId, subjectId, studentId, teacherId, status } = req.query;

      const result = await DatabaseService.getMarks({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
        batchId: batchId as string,
        subjectId: subjectId as string,
        studentId: studentId as string,
        teacherId: teacherId as string,
        status: status as string,
      });

      return res.json({
        success: true,
        data: result.data.map((m: any) => ({
          id: m.id,
          studentId: m.student_id,
          studentName: m.student_name,
          studentRoll: m.student_id,
          subjectId: m.subject_id,
          subjectCode: m.subject_code,
          subjectName: m.subject_name,
          batchId: m.batch_id,
          batchName: m.batch_name,
          teacherId: m.teacher_id,
          assignmentMarks: m.assignment_marks,
          testMarks: m.test_marks,
          attendanceMarks: m.attendance_marks,
          totalMarks: m.total_marks,
          maxAssignmentMarks: m.max_assignment_marks,
          maxTestMarks: m.max_test_marks,
          maxAttendanceMarks: m.max_attendance_marks,
          maxTotalMarks: m.max_total_marks,
          status: m.status,
          submittedAt: m.submitted_at,
          finalisedAt: m.finalised_at,
          lockedAt: m.locked_at,
        })),
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Get marks failed', error);
      next(error);
    }
  });

  /**
   * GET /api/marks/subject/:subjectId
   * Get marks for a subject
   */
  router.get('/subject/:subjectId', [
    param('subjectId').isUUID(),
    query('batchId').optional().isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { batchId } = req.query;
      const result = await DatabaseService.getMarks({
        subjectId: req.params.subjectId,
        batchId: batchId as string,
      });

      return res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Get subject marks failed', error);
      next(error);
    }
  });

  /**
   * POST /api/marks/entry
   * Enter marks
   */
  router.post('/entry', [
    body('studentId').isUUID(),
    body('subjectId').isUUID(),
    body('batchId').isUUID(),
    body('assignmentMarks').optional().isInt({ min: 0 }),
    body('testMarks').optional().isInt({ min: 0 }),
    body('attendanceMarks').optional().isInt({ min: 0 }),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { studentId, subjectId, batchId, assignmentMarks, testMarks, attendanceMarks } = req.body;

      const marks = await DatabaseService.enterMarks({
        student_id: studentId,
        subject_id: subjectId,
        batch_id: batchId,
        teacher_id: req.user.id,
        assignment_marks: assignmentMarks,
        test_marks: testMarks,
        attendance_marks: attendanceMarks,
      });

      return res.status(201).json({
        success: true,
        data: marks
      });
    } catch (error) {
      logger.error('Enter marks failed', error);
      next(error);
    }
  });

  /**
   * PUT /api/marks/:id/submit
   * Submit marks for review
   */
  router.put('/:id/submit', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const marks = await DatabaseService.updateMarksStatus(req.params.id, 'submitted');

      return res.json({
        success: true,
        data: marks
      });
    } catch (error) {
      logger.error('Submit marks failed', error);
      next(error);
    }
  });

  /**
   * PUT /api/marks/:id/finalise
   * Finalise marks
   */
  router.put('/:id/finalise', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const marks = await DatabaseService.updateMarksStatus(req.params.id, 'finalised');

      return res.json({
        success: true,
        data: marks
      });
    } catch (error) {
      logger.error('Finalise marks failed', error);
      next(error);
    }
  });

  /**
   * PUT /api/marks/:id/lock
   * Lock marks
   */
  router.put('/:id/lock', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const marks = await DatabaseService.updateMarksStatus(req.params.id, 'locked');

      return res.json({
        success: true,
        data: marks
      });
    } catch (error) {
      logger.error('Lock marks failed', error);
      next(error);
    }
  });

  return router;
};
