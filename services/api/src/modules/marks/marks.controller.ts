import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { MarksService } from './marks.service';
import { logger } from '@/utils/logger';

/**
 * GET /api/marks
 * List marks with filtering and pagination.
 */
export const list = (marksService: MarksService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { page, limit, batchId, subjectId, studentId, teacherId, status } = req.query;

      const result = await marksService.list({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
        batchId: batchId as string | undefined,
        subjectId: subjectId as string | undefined,
        studentId: studentId as string | undefined,
        teacherId: teacherId as string | undefined,
        status: status as string | undefined,
      });

      res.json({
        success: true,
        data: result.data.map((m: any) => ({
          id: m.id,
          studentId: m.student_id,
          studentName: m.student_name,
          studentRoll: m.roll_number,
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
          status: m.status,
          submittedAt: m.submitted_at,
          finalisedAt: m.finalised_at,
          lockedAt: m.locked_at,
        })),
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Get marks failed', error);
      next(error);
    }
  };
};

/**
 * GET /api/marks/subject/:subjectId
 * Get marks for a specific subject, optionally filtered by batch.
 */
export const getSubjectMarks = (marksService: MarksService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { batchId } = req.query;

      const result = await marksService.getSubjectMarks(
        (req.params.subjectId as string),
        batchId as string | undefined
      );

      res.json({ success: true, data: result.data });
    } catch (error) {
      logger.error('Get subject marks failed', error);
      next(error);
    }
  };
};

/**
 * POST /api/marks/entry
 * Enter marks for a student in a subject.
 */
export const enterMarks = (marksService: MarksService) => {
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

      const { studentId, subjectId, batchId, assignmentMarks, testMarks, attendanceMarks } = req.body;

      const marks = await marksService.enterMarks({
        student_id: studentId,
        subject_id: subjectId,
        batch_id: batchId,
        teacher_id: req.user.id,
        assignment_marks: assignmentMarks,
        test_marks: testMarks,
        attendance_marks: attendanceMarks,
      });

      res.status(201).json({ success: true, data: marks });
    } catch (error) {
      logger.error('Enter marks failed', error);
      next(error);
    }
  };
};

/**
 * PUT /api/marks/:id/submit
 * Submit marks for review (draft → submitted).
 */
export const submitMarks = (marksService: MarksService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const marks = await marksService.submitMarks(req.params.id as string);

      if (!marks) {
        res.status(404).json({ error: 'Marks entry not found' });
        return;
      }

      res.json({ success: true, data: marks });
    } catch (error) {
      logger.error('Submit marks failed', error);
      next(error);
    }
  };
};

/**
 * PUT /api/marks/:id/finalise
 * Finalise marks (submitted → finalised).
 */
export const finaliseMarks = (marksService: MarksService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const marks = await marksService.finaliseMarks(req.params.id as string);

      if (!marks) {
        res.status(404).json({ error: 'Marks entry not found' });
        return;
      }

      res.json({ success: true, data: marks });
    } catch (error) {
      logger.error('Finalise marks failed', error);
      next(error);
    }
  };
};

/**
 * PUT /api/marks/:id/lock
 * Lock marks (finalised → locked). Locked marks cannot be modified.
 */
export const lockMarks = (marksService: MarksService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const marks = await marksService.lockMarks(req.params.id as string);

      if (!marks) {
        res.status(404).json({ error: 'Marks entry not found' });
        return;
      }

      res.json({ success: true, data: marks });
    } catch (error) {
      logger.error('Lock marks failed', error);
      next(error);
    }
  };
};
