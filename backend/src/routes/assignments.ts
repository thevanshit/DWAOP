import { Router, Request, Response, NextFunction } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import DatabaseService from '@/services/database.service';
import { logger } from '@/utils/logger';

export const createAssignmentsRoutes = (): Router => {
  const router = Router();

  /**
   * GET /api/assignments
   * List assignments
   */
  router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('batchId').optional().isUUID(),
    query('subjectId').optional().isUUID(),
    query('teacherId').optional().isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { page, limit, batchId, subjectId, teacherId } = req.query;

      const result = await DatabaseService.getAssignments({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        batchId: batchId as string,
        subjectId: subjectId as string,
        teacherId: teacherId as string,
      });

      return res.json({
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
          submissionCount: a.submission_count,
          createdAt: a.created_at,
        })),
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Get assignments failed', error);
      next(error);
    }
  });

  /**
   * POST /api/assignments
   * Create assignment
   */
  router.post('/', [
    body('subjectId').isUUID(),
    body('batchId').isUUID(),
    body('title').isLength({ min: 3, max: 500 }),
    body('maxMarks').isInt({ min: 1 }),
    body('submissionDeadline').isISO8601(),
    body('description').optional().isString(),
    body('instructions').optional().isString(),
    body('lateSubmissionAllowed').optional().isBoolean(),
    body('latePenaltyPercentage').optional().isFloat({ min: 0, max: 100 }),
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

      const { subjectId, batchId, title, description, instructions, maxMarks, submissionDeadline, lateSubmissionAllowed, latePenaltyPercentage } = req.body;

      const assignment = await DatabaseService.createAssignment({
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

      return res.status(201).json({
        success: true,
        data: assignment
      });
    } catch (error) {
      logger.error('Create assignment failed', error);
      next(error);
    }
  });

  /**
   * GET /api/assignments/:id
   * Get assignment details
   */
  router.get('/:id', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignment = await DatabaseService.getAssignmentById(req.params.id);

      if (!assignment) {
        return res.status(404).json({
          error: 'Assignment not found'
        });
      }

      return res.json({
        success: true,
        data: assignment
      });
    } catch (error) {
      logger.error('Get assignment failed', error);
      next(error);
    }
  });

  /**
   * GET /api/assignments/:id/submissions
   * Get assignment submissions
   */
  router.get('/:id/submissions', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submissions = await DatabaseService.getAssignmentSubmissions(req.params.id);

      return res.json({
        success: true,
        data: submissions.map((s: any) => ({
          id: s.id,
          assignmentId: s.assignment_id,
          studentId: s.student_id,
          studentName: s.student_name,
          studentRoll: s.student_id,
          submittedAt: s.submitted_at,
          isLate: s.is_late,
          marksObtained: s.marks_obtained,
          maxMarks: s.max_marks,
          feedback: s.feedback,
          status: s.status,
        }))
      });
    } catch (error) {
      logger.error('Get assignment submissions failed', error);
      next(error);
    }
  });

  /**
   * POST /api/assignments/:id/submit
   * Submit assignment
   */
  router.post('/:id/submit', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const submission = await DatabaseService.submitAssignment({
        assignment_id: req.params.id,
        student_id: req.user.id,
        submitted_at: new Date(),
      });

      return res.status(201).json({
        success: true,
        data: submission
      });
    } catch (error) {
      logger.error('Submit assignment failed', error);
      next(error);
    }
  });

  /**
   * PUT /api/assignments/:id/evaluate
   * Evaluate submission
   */
  router.put('/:submissionId/evaluate', [
    param('submissionId').isUUID(),
    body('marks').isInt({ min: 0 }),
    body('feedback').optional().isString(),
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

      const { marks, feedback } = req.body;

      const result = await DatabaseService.evaluateSubmission(
        req.params.submissionId,
        marks,
        feedback || '',
        req.user.id
      );

      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Evaluate submission failed', error);
      next(error);
    }
  });

  return router;
};
