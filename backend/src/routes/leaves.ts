import { Router, Request, Response, NextFunction } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import DatabaseService from '@/services/database.service';
import { logger } from '@/utils/logger';

export const createLeavesRoutes = (): Router => {
  const router = Router();

  /**
   * GET /api/leaves
   * List leave requests
   */
  router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('studentId').optional().isUUID(),
    query('status').optional().isIn(['pending', 'approved', 'rejected']),
    query('leaveType').optional().isIn(['medical', 'academic', 'personal', 'emergency', 'official']),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { page, limit, studentId, status, leaveType } = req.query;

      const result = await DatabaseService.getLeaveRequests({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        studentId: studentId as string,
        status: status as string,
        leaveType: leaveType as string,
      });

      return res.json({
        success: true,
        data: result.data.map((l: any) => ({
          id: l.id,
          workflowId: l.workflow_id,
          studentId: l.student_id,
          studentName: l.student_name,
          studentRoll: l.student_id,
          leaveType: l.leave_type,
          startDate: l.start_date,
          endDate: l.end_date,
          totalDays: l.total_days,
          reason: l.reason,
          supportingDocuments: l.supporting_documents,
          status: l.status,
          isEmergency: l.is_emergency,
          approvedBy: l.approved_by,
          approvedAt: l.approved_at,
          rejectionReason: l.rejection_reason,
          createdAt: l.created_at,
        })),
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Get leaves failed', error);
      next(error);
    }
  });

  /**
   * GET /api/leaves/pending
   * Get pending approvals
   */
  router.get('/pending', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;

      const result = await DatabaseService.getLeaveRequests({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        status: 'pending',
      });

      return res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Get pending leaves failed', error);
      next(error);
    }
  });

  /**
   * POST /api/leaves
   * Create leave request
   */
  router.post('/', [
    body('leaveType').isIn(['medical', 'academic', 'personal', 'emergency', 'official']),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('totalDays').isInt({ min: 1 }),
    body('reason').isLength({ min: 10, max: 2000 }),
    body('supportingDocuments').optional().isArray(),
    body('isEmergency').optional().isBoolean(),
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

      const { leaveType, startDate, endDate, totalDays, reason, supportingDocuments, isEmergency } = req.body;

      const leaveRequest = await DatabaseService.createLeaveRequest({
        student_id: req.user.id,
        leave_type: leaveType,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        total_days: totalDays,
        reason,
        supporting_documents: supportingDocuments,
        is_emergency: isEmergency,
      });

      return res.status(201).json({
        success: true,
        data: leaveRequest
      });
    } catch (error) {
      logger.error('Create leave failed', error);
      next(error);
    }
  });

  /**
   * GET /api/leaves/:id
   * Get leave request by ID
   */
  router.get('/:id', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaveRequest = await DatabaseService.getLeaveRequestById(req.params.id);

      if (!leaveRequest) {
        return res.status(404).json({
          error: 'Leave request not found'
        });
      }

      return res.json({
        success: true,
        data: leaveRequest
      });
    } catch (error) {
      logger.error('Get leave failed', error);
      next(error);
    }
  });

  /**
   * PUT /api/leaves/:id/approve
   * Approve leave request
   */
  router.put('/:id/approve', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const leaveRequest = await DatabaseService.updateLeaveStatus(req.params.id, 'approved', req.user.id);

      return res.json({
        success: true,
        data: leaveRequest
      });
    } catch (error) {
      logger.error('Approve leave failed', error);
      next(error);
    }
  });

  /**
   * PUT /api/leaves/:id/reject
   * Reject leave request
   */
  router.put('/:id/reject', [
    param('id').isUUID(),
    body('reason').isLength({ min: 10, max: 500 }),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { reason } = req.body;
      const leaveRequest = await DatabaseService.updateLeaveStatus(req.params.id, 'rejected', '', reason);

      return res.json({
        success: true,
        data: leaveRequest
      });
    } catch (error) {
      logger.error('Reject leave failed', error);
      next(error);
    }
  });

  return router;
};
