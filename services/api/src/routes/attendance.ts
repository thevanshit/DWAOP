import { Router, Request, Response, NextFunction } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import DatabaseService from '@/services/database.service';
import { logger } from '@/utils/logger';

export const createAttendanceRoutes = (): Router => {
  const router = Router();

  /**
   * GET /api/attendance/sessions
   * List attendance sessions
   */
  router.get('/sessions', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('batchId').optional().isUUID(),
    query('subjectId').optional().isUUID(),
    query('teacherId').optional().isUUID(),
    query('date').optional().isISO8601(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { page, limit, batchId, subjectId, teacherId, date } = req.query;

      const result = await DatabaseService.getAttendanceSessions({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        batchId: batchId as string,
        subjectId: subjectId as string,
        teacherId: teacherId as string,
        date: date as string,
      });

      return res.json({
        success: true,
        data: result.data.map((s: any) => ({
          id: s.id,
          workflowId: s.workflow_id,
          subjectId: s.subject_id,
          subjectCode: s.subject_code,
          subjectName: s.subject_name,
          batchId: s.batch_id,
          batchName: s.batch_name,
          teacherId: s.teacher_id,
          scheduledDate: s.scheduled_date,
          startTime: s.start_time,
          endTime: s.end_time,
          totalStudents: s.total_students,
          presentStudents: s.present_students,
          absentStudents: s.absent_students,
          gracePeriodMinutes: s.grace_period_minutes,
          location: s.location,
        })),
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Get attendance sessions failed', error);
      next(error);
    }
  });

  /**
   * POST /api/attendance/sessions
   * Create attendance session
   */
  router.post('/sessions', [
    body('subjectId').isUUID(),
    body('batchId').isUUID(),
    body('teacherId').isUUID(),
    body('scheduledDate').isISO8601(),
    body('startTime').optional().isISO8601(),
    body('endTime').optional().isISO8601(),
    body('gracePeriodMinutes').optional().isInt({ min: 0, max: 60 }),
    body('location').optional().isString(),
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

      const { subjectId, batchId, teacherId, scheduledDate, startTime, endTime, gracePeriodMinutes, location } = req.body;

      const session = await DatabaseService.createAttendanceSession({
        subject_id: subjectId,
        batch_id: batchId,
        teacher_id: teacherId,
        scheduled_date: new Date(scheduledDate),
        start_time: startTime ? new Date(startTime) : undefined,
        end_time: endTime ? new Date(endTime) : undefined,
        grace_period_minutes: gracePeriodMinutes,
        location,
      });

      return res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      logger.error('Create attendance session failed', error);
      next(error);
    }
  });

  /**
   * GET /api/attendance/sessions/:id
   * Get session details with attendance records
   */
  router.get('/sessions/:id', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await DatabaseService.getAttendanceSessionById(req.params.id);

      if (!session) {
        return res.status(404).json({
          error: 'Session not found'
        });
      }

      // Get attendance records
      const records = await DatabaseService.db?.query(
        `SELECT ar.*, u.first_name, u.last_name, u.student_id
         FROM attendance_records ar
         INNER JOIN users u ON ar.student_id = u.id
         WHERE ar.session_id = $1`,
        [req.params.id]
      );

      return res.json({
        success: true,
        data: {
          ...session,
          records: records?.rows || []
        }
      });
    } catch (error) {
      logger.error('Get attendance session failed', error);
      next(error);
    }
  });

  /**
   * POST /api/attendance/records
   * Mark attendance
   */
  router.post('/records', [
    body('sessionId').isUUID(),
    body('records').isArray({ min: 1 }),
    body('records.*.studentId').isUUID(),
    body('records.*.status').isIn(['present', 'absent', 'late', 'excused']),
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

      const { sessionId, records } = req.body;

      await DatabaseService.markAttendance(
        records.map((r: any) => ({
          session_id: sessionId,
          student_id: r.studentId,
          status: r.status,
          marked_by: req.user?.id,
        }))
      );

      return res.json({
        success: true,
        message: 'Attendance marked successfully'
      });
    } catch (error) {
      logger.error('Mark attendance failed', error);
      next(error);
    }
  });

  /**
   * GET /api/attendance/batch/:batchId
   * Get batch attendance summary
   */
  router.get('/batch/:batchId', [
    param('batchId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;

      // Get attendance sessions for the batch
      const sessions = await DatabaseService.getAttendanceSessions({
        batchId: req.params.batchId,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      return res.json({
        success: true,
        data: sessions.data
      });
    } catch (error) {
      logger.error('Get batch attendance failed', error);
      next(error);
    }
  });

  return router;
};

// Extend DatabaseService for direct query access
declare module '@/services/database.service' {
  interface DatabaseService {
    db: any;
  }
}
