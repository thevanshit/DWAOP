import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AssignmentsService } from './assignments.service';
import { logger } from '@/utils/logger';

/**
 * GET /api/assignments
 * List assignments with filtering and pagination.
 */
export const list = (assignmentsService: AssignmentsService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { page, limit, batchId, subjectId, teacherId } = req.query;

      const result = await assignmentsService.list({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        batchId: batchId as string | undefined,
        subjectId: subjectId as string | undefined,
        teacherId: teacherId as string | undefined,
      });

      res.json({
        success: true,
        data: result.data.map((a: any) => ({
          id: a.id,
          workflowId: a.workflow_id,
          subjectId: a.subject_id,
          subjectCode: a.subject_code,
          subjectName: a.subject_name,
          batchId: a.batch_id,
          batchName: a.batch_name,
          teacherId: a.teacher_id,
          teacherName: a.teacher_name,
          title: a.title,
          description: a.description,
          instructions: a.instructions,
          maxMarks: a.max_marks,
          submissionDeadline: a.submission_deadline,
          lateSubmissionAllowed: a.late_submission_allowed,
          latePenaltyPercentage: a.late_penalty_percentage,
          submissionCount: a.submission_count ?? 0,
          createdAt: a.created_at,
        })),
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Get assignments failed', error);
      next(error);
    }
  };
};

/**
 * POST /api/assignments
 * Create a new assignment.
 */
export const create = (assignmentsService: AssignmentsService) => {
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

      const {
        subjectId,
        batchId,
        title,
        description,
        instructions,
        maxMarks,
        submissionDeadline,
        lateSubmissionAllowed,
        latePenaltyPercentage,
      } = req.body;

      const assignment = await assignmentsService.create({
        subject_id: subjectId,
        batch_id: batchId,
        teacher_id: req.user.id,
        title,
        description,
        instructions,
        max_marks: maxMarks,
        submission_deadline: new Date(submissionDeadline),
        late_submission_allowed: lateSubmissionAllowed,
        late_penalty_percentage: latePenaltyPercentage,
      });

      res.status(201).json({ success: true, data: assignment });
    } catch (error) {
      logger.error('Create assignment failed', error);
      next(error);
    }
  };
};

/**
 * GET /api/assignments/:id
 * Get assignment details by ID.
 */
export const getById = (assignmentsService: AssignmentsService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const assignment = await assignmentsService.getById(req.params.id as string);

      if (!assignment) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }

      res.json({ success: true, data: assignment });
    } catch (error) {
      logger.error('Get assignment failed', error);
      next(error);
    }
  };
};

/**
 * GET /api/assignments/:id/submissions
 * Get all submissions for an assignment.
 */
export const getSubmissions = (assignmentsService: AssignmentsService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const submissions = await assignmentsService.getSubmissions(req.params.id as string);

      res.json({
        success: true,
        data: submissions.map((s: any) => ({
          id: s.id,
          assignmentId: s.assignment_id,
          studentId: s.student_id,
          studentName: s.student_name,
          studentRoll: s.roll_number,
          submittedAt: s.submitted_at,
          isLate: s.is_late,
          marksObtained: s.marks_obtained,
          feedback: s.feedback,
          status: s.status,
        })),
      });
    } catch (error) {
      logger.error('Get submissions failed', error);
      next(error);
    }
  };
};

/**
 * POST /api/assignments/:id/submit
 * Submit an assignment (student).
 */
export const submit = (assignmentsService: AssignmentsService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const submission = await assignmentsService.submit(req.params.id as string, req.user.id);

      res.status(201).json({ success: true, data: submission });
    } catch (error) {
      logger.error('Submit assignment failed', error);
      next(error);
    }
  };
};

/**
 * PUT /api/assignments/:submissionId/evaluate
 * Evaluate a submission with marks and feedback.
 */
export const evaluate = (assignmentsService: AssignmentsService) => {
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

      const { marks, feedback } = req.body;

      const result = await assignmentsService.evaluate(
        req.params.submissionId as string,
        marks,
        feedback || '',
        req.user.id
      );

      if (!result) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      res.json({ success: true, data: result });
    } catch (error) {
      logger.error('Evaluate submission failed', error);
      next(error);
    }
  };
};
