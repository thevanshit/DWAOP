import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AttendanceService } from './attendance.service';
import { logger } from '@/utils/logger';

/**
 * GET /api/attendance/sessions
 * List attendance sessions with filtering and pagination.
 */
export const getSessions = (attendanceService: AttendanceService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { page, limit, batchId, subjectId, teacherId, date } = req.query;

      const result = await attendanceService.listSessions({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        batchId: batchId as string | undefined,
        subjectId: subjectId as string | undefined,
        teacherId: teacherId as string | undefined,
        date: date as string | undefined,
      });

      res.json({
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
          teacherName: s.teacher_name,
          scheduledDate: s.scheduled_date,
          startTime: s.start_time,
          endTime: s.end_time,
          totalStudents: s.total_records ?? 0,
          presentStudents: s.present_count ?? 0,
          absentStudents: s.absent_count ?? 0,
          gracePeriodMinutes: s.grace_period_minutes,
          location: s.location,
        })),
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Get attendance sessions failed', error);
      next(error);
    }
  };
};

/**
 * POST /api/attendance/sessions
 * Create a new attendance session.
 */
export const createSession = (attendanceService: AttendanceService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const { subjectId, batchId, teacherId, scheduledDate, startTime, endTime, gracePeriodMinutes, location } = req.body;

      const session = await attendanceService.createSession({
        subject_id: subjectId,
        batch_id: batchId,
        teacher_id: teacherId,
        scheduled_date: new Date(scheduledDate),
        start_time: startTime ? new Date(startTime) : undefined,
        end_time: endTime ? new Date(endTime) : undefined,
        grace_period_minutes: gracePeriodMinutes,
        location,
      });

      res.status(201).json({ success: true, data: session });
    } catch (error) {
      logger.error('Create attendance session failed', error);
      next(error);
    }
  };
};

/**
 * GET /api/attendance/sessions/:id
 * Get a session with its attendance records.
 */
export const getSessionById = (attendanceService: AttendanceService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const session = await attendanceService.getSessionById(req.params.id as string);

      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      res.json({ success: true, data: session });
    } catch (error) {
      logger.error('Get attendance session failed', error);
      next(error);
    }
  };
};

/**
 * POST /api/attendance/records
 * Mark attendance records for a session.
 */
export const markAttendance = (attendanceService: AttendanceService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const { sessionId, records } = req.body;

      await attendanceService.markAttendance(sessionId, records, req.user.id);

      res.json({ success: true, message: 'Attendance marked successfully' });
    } catch (error) {
      logger.error('Mark attendance failed', error);
      next(error);
    }
  };
};

/**
 * GET /api/attendance/batch/:batchId
 * Get batch attendance summary with optional date range.
 */
export const getBatchAttendance = (attendanceService: AttendanceService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { startDate, endDate } = req.query;

      const result = await attendanceService.getBatchAttendance(
        req.params.batchId as string,
        startDate as string | undefined,
        endDate as string | undefined
      );

      res.json({ success: true, data: result });
    } catch (error) {
      logger.error('Get batch attendance failed', error);
      next(error);
    }
  };
};
