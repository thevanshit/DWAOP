import { Router, Request, Response, NextFunction } from 'express';
import { query, param, validationResult } from 'express-validator';
import DatabaseService from '@/services/database.service';
import { logger } from '@/utils/logger';

export const createStudentsRoutes = (): Router => {
  const router = Router();

  /**
   * GET /api/students
   * List all students with filters
   */
  router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('batchId').optional().isUUID(),
    query('departmentId').optional().isUUID(),
    query('search').optional().isString(),
    query('status').optional().isIn(['active', 'inactive']),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { page, limit, batchId, departmentId, search, status } = req.query;

      const result = await DatabaseService.getStudents({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        batchId: batchId as string,
        departmentId: departmentId as string,
        search: search as string,
        status: status as 'active' | 'inactive' | undefined,
      });

      return res.json({
        success: true,
        data: result.data.map(s => ({
          id: s.id,
          email: s.email,
          firstName: s.first_name,
          lastName: s.last_name,
          studentId: s.student_id,
          phone: s.phone,
          avatarUrl: s.avatar_url,
          isActive: s.is_active,
          batchId: s.batch_id,
          semester: s.current_semester,
          cgpa: s.cgpa,
          eligibilityStatus: s.eligibility_status,
          riskIndicators: s.risk_indicators,
          createdAt: s.created_at,
        })),
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Get students failed', error);
      next(error);
    }
  });

  /**
   * GET /api/students/at-risk
   * Get at-risk students
   */
  router.get('/at-risk', [
    query('departmentId').optional().isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { departmentId } = req.query;
      const students = await DatabaseService.getAtRiskStudents(departmentId as string);

      return res.json({
        success: true,
        data: students.map(s => ({
          id: s.id,
          email: s.email,
          firstName: s.first_name,
          lastName: s.last_name,
          studentId: s.student_id,
          phone: s.phone,
          batchId: s.batch_id,
          semester: s.current_semester,
          cgpa: s.cgpa,
          eligibilityStatus: s.eligibility_status,
          riskIndicators: s.risk_indicators,
        }))
      });
    } catch (error) {
      logger.error('Get at-risk students failed', error);
      next(error);
    }
  });

  /**
   * GET /api/students/:id
   * Get student by ID
   */
  router.get('/:id', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const student = await DatabaseService.getStudentById(req.params.id);

      if (!student) {
        return res.status(404).json({
          error: 'Student not found'
        });
      }

      return res.json({
        success: true,
        data: {
          id: student.id,
          email: student.email,
          firstName: student.first_name,
          lastName: student.last_name,
          studentId: student.student_id,
          phone: student.phone,
          avatarUrl: student.avatar_url,
          isActive: student.is_active,
          batchId: student.batch_id,
          semester: student.current_semester,
          cgpa: student.cgpa,
          eligibilityStatus: student.eligibility_status,
          riskIndicators: student.risk_indicators,
          totalCredits: student.total_credits,
          createdAt: student.created_at,
        }
      });
    } catch (error) {
      logger.error('Get student failed', error);
      next(error);
    }
  });

  /**
   * GET /api/students/:id/attendance
   * Get student attendance history
   */
  router.get('/:id/attendance', [
    param('id').isUUID(),
    query('batchId').optional().isUUID(),
    query('subjectId').optional().isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { batchId, subjectId, startDate, endDate } = req.query;
      const attendance = await DatabaseService.getStudentAttendance(req.params.id, {
        batchId: batchId as string,
        subjectId: subjectId as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      return res.json({
        success: true,
        data: attendance.map(a => ({
          id: a.id,
          sessionId: a.session_id,
          status: a.status,
          markedAt: a.marked_at,
          scheduledDate: a.scheduled_date,
          subjectCode: a.subject_code,
          subjectName: a.subject_name,
        }))
      });
    } catch (error) {
      logger.error('Get student attendance failed', error);
      next(error);
    }
  });

  /**
   * GET /api/students/:id/assignments
   * Get student assignments
   */
  router.get('/:id/assignments', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get assignments for batches the student is enrolled in
      const batches = await DatabaseService.getStudentById(req.params.id);
      
      if (!batches) {
        return res.status(404).json({
          error: 'Student not found'
        });
      }

      const assignments = await DatabaseService.getAssignments({
        batchId: batches.batch_id,
      });

      return res.json({
        success: true,
        data: assignments.data.map(a => ({
          id: a.id,
          title: a.title,
          description: a.description,
          subjectCode: a.subject_code,
          subjectName: a.subject_name,
          batchName: a.batch_name,
          maxMarks: a.max_marks,
          deadline: a.submission_deadline,
          submissionCount: a.submission_count,
        }))
      });
    } catch (error) {
      logger.error('Get student assignments failed', error);
      next(error);
    }
  });

  /**
   * GET /api/students/:id/marks
   * Get student marks
   */
  router.get('/:id/marks', [
    param('id').isUUID(),
    query('subjectId').optional().isUUID(),
    query('batchId').optional().isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subjectId, batchId } = req.query;
      const marks = await DatabaseService.getMarks({
        studentId: req.params.id,
        subjectId: subjectId as string,
        batchId: batchId as string,
      });

      return res.json({
        success: true,
        data: marks.data.map(m => ({
          id: m.id,
          subjectCode: m.subject_code,
          subjectName: m.subject_name,
          batchName: m.batch_name,
          assignmentMarks: m.assignment_marks,
          testMarks: m.test_marks,
          attendanceMarks: m.attendance_marks,
          totalMarks: m.total_marks,
          maxTotalMarks: m.max_total_marks,
          status: m.status,
        }))
      });
    } catch (error) {
      logger.error('Get student marks failed', error);
      next(error);
    }
  });

  /**
   * GET /api/students/:id/eligibility
   * Check student exam eligibility
   */
  router.get('/:id/eligibility', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await DatabaseService.getStudentById(req.params.id);

      if (!student) {
        return res.status(404).json({
          error: 'Student not found'
        });
      }

      // Calculate eligibility based on attendance and marks
      // This is a simplified version - real implementation would be more complex
      const attendance = await DatabaseService.getStudentAttendance(req.params.id);
      
      const presentCount = attendance.filter((a: any) => a.status === 'present').length;
      const totalCount = attendance.length;
      const attendancePercentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

      const eligibilityStatus = attendancePercentage >= 75 ? 'eligible' : 
                                attendancePercentage >= 65 ? 'at_risk' : 'not_eligible';

      return res.json({
        success: true,
        data: {
          studentId: req.params.id,
          attendancePercentage: Math.round(attendancePercentage),
          eligibilityStatus,
          cgpa: student.cgpa,
          riskIndicators: student.risk_indicators || [],
        }
      });
    } catch (error) {
      logger.error('Get student eligibility failed', error);
      next(error);
    }
  });

  /**
   * PUT /api/students/:id
   * Update student profile
   */
  router.put('/:id', [
    param('id').isUUID(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { firstName, lastName, phone, avatarUrl } = req.body;

      const updated = await DatabaseService.updateUser(req.params.id, {
        first_name: firstName,
        last_name: lastName,
        phone,
        avatar_url: avatarUrl,
      });

      return res.json({
        success: true,
        data: {
          id: updated.id,
          email: updated.email,
          firstName: updated.first_name,
          lastName: updated.last_name,
          phone: updated.phone,
          avatarUrl: updated.avatar_url,
        }
      });
    } catch (error) {
      logger.error('Update student failed', error);
      next(error);
    }
  });

  return router;
};
