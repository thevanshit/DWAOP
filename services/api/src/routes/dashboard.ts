import { Router, Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { WorkflowEngine } from '@/core/workflow/engine';
import { logger } from '@/utils/logger';

export const createDashboardRoutes = (workflowEngine: WorkflowEngine): Router => {
  const router = Router();

  /**
   * GET /api/dashboard/stats
   * Get dashboard statistics for the current user
   */
  router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required'
        });
      }

      const userRole = req.user.role;
      const userId = req.user.id;

      let stats: any = {};

      switch (userRole) {
        case 'student':
          stats = await getStudentStats(userId, workflowEngine);
          break;
        case 'teacher':
          stats = await getTeacherStats(userId, workflowEngine);
          break;
        case 'admin':
        case 'hod':
          stats = await getAdminStats(workflowEngine);
          break;
        default:
          stats = { message: 'No stats available for this role' };
      }

      return res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      logger.error('Get dashboard stats failed', error);
      return next(error);
    }
  });

  /**
   * GET /api/dashboard/workflows
   * Get workflows relevant to the user's dashboard
   */
  router.get('/workflows', [
    query('type').optional().isString(),
    query('status').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 50 }),
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
        return res.status(401).json({
          error: 'Authentication required'
        });
      }

      const { type, status, limit = 10 } = req.query;
      const userRole = req.user.role;
      const userId = req.user.id;

      let workflows: any[] = [];

      switch (userRole) {
        case 'student':
          workflows = await getStudentWorkflows(userId, workflowEngine, {
            type: type as string,
            status: status as string,
            limit: Number(limit)
          });
          break;
        case 'teacher':
          workflows = await getTeacherWorkflows(userId, workflowEngine, {
            type: type as string,
            status: status as string,
            limit: Number(limit)
          });
          break;
        case 'admin':
        case 'hod':
          workflows = await getAdminWorkflows(workflowEngine, {
            type: type as string,
            status: status as string,
            limit: Number(limit)
          });
          break;
      }

      return res.json({
        success: true,
        data: { workflows }
      });
    } catch (error) {
      logger.error('Get dashboard workflows failed', error);
      return next(error);
    }
  });

  /**
   * GET /api/dashboard/analytics
   * Get analytics data for the dashboard
   */
  router.get('/analytics', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required'
        });
      }

      const userRole = req.user.role;
      const userId = req.user.id;

      let analytics: any = {};

      switch (userRole) {
        case 'student':
          analytics = await getStudentAnalytics(userId, workflowEngine);
          break;
        case 'teacher':
          analytics = await getTeacherAnalytics(userId, workflowEngine);
          break;
        case 'admin':
        case 'hod':
          analytics = await getAdminAnalytics(workflowEngine);
          break;
      }

      return res.json({
        success: true,
        data: { analytics }
      });
    } catch (error) {
      logger.error('Get dashboard analytics failed', error);
      return next(error);
    }
  });

  return router;
};

// Helper functions for different user roles

async function getStudentStats(userId: string, workflowEngine: WorkflowEngine) {
  // Get student's pending workflows
  const pendingWorkflows = await workflowEngine.getWorkflows(undefined, {
    assigneeId: userId
  });

  // Get student's assignments
  const assignments = await workflowEngine.getWorkflows('assignment', {
    assigneeId: userId
  });

  return {
    pendingWorkflows: pendingWorkflows.filter(w => w.currentState !== 'done').length,
    upcomingDeadlines: assignments.filter(w => 
      w.dueDate && new Date(w.dueDate) > new Date() && 
      new Date(w.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length,
    attendancePercentage: 85, // This would be calculated from actual attendance data
    assignmentsCompleted: assignments.filter(w => w.currentState === 'evaluated').length,
    totalAssignments: assignments.length,
    eligibilityStatus: 'eligible' // This would be calculated from track report
  };
}

async function getTeacherStats(userId: string, workflowEngine: WorkflowEngine) {
  // Get workflows assigned to teacher
  const assignedWorkflows = await workflowEngine.getWorkflows(undefined, {
    assigneeId: userId
  });

  // Get teacher's assignments
  const assignments = await workflowEngine.getWorkflows('assignment');

  return {
    pendingEvaluations: assignments.filter(w => w.currentState === 'submission_closed').length,
    upcomingSessions: assignedWorkflows.filter(w => 
      w.type === 'attendance_session' && 
      w.currentState === 'created'
    ).length,
    totalStudents: 350, // This would be calculated from actual data
    delayedTasks: assignedWorkflows.filter(w => 
      w.dueDate && new Date(w.dueDate) < new Date() && w.currentState !== 'done'
    ).length
  };
}

async function getAdminStats(workflowEngine: WorkflowEngine) {
  // Get all workflows for admin overview
  const allWorkflows = await workflowEngine.getWorkflows();

  return {
    totalWorkflows: allWorkflows.length,
    activeWorkflows: allWorkflows.filter(w => 
      !['done', 'locked'].includes(w.currentState)
    ).length,
    delayedWorkflows: allWorkflows.filter(w => 
      w.dueDate && new Date(w.dueDate) < new Date() && w.currentState !== 'done'
    ).length,
    atRiskStudents: 15, // This would be calculated from track reports
    totalUsers: 420, // This would come from user service
    departmentHealth: 92 // This would be calculated from various metrics
  };
}

async function getStudentWorkflows(userId: string, workflowEngine: WorkflowEngine, options: any) {
  const workflows = await workflowEngine.getWorkflows(undefined, {
    assigneeId: userId
  });

  return workflows.slice(0, options.limit);
}

async function getTeacherWorkflows(userId: string, workflowEngine: WorkflowEngine, options: any) {
  const workflows = await workflowEngine.getWorkflows(undefined, {
    assigneeId: userId
  });

  return workflows.slice(0, options.limit);
}

async function getAdminWorkflows(workflowEngine: WorkflowEngine, options: any) {
  const workflows = await workflowEngine.getWorkflows();

  return workflows.slice(0, options.limit);
}

async function getStudentAnalytics(userId: string, workflowEngine: WorkflowEngine) {
  // This would return student-specific analytics
  return {
    attendanceTrend: [
      { week: 'W1', attendance: 82 },
      { week: 'W2', attendance: 78 },
      { week: 'W3', attendance: 85 },
      { week: 'W4', attendance: 88 },
      { week: 'W5', attendance: 90 },
      { week: 'W6', attendance: 87 }
    ],
    performanceData: [
      { subject: 'DS', internal: 85 },
      { subject: 'DBMS', internal: 73 },
      { subject: 'SE', internal: 88 },
      { subject: 'CN', internal: 80 }
    ],
    subjectWiseAttendance: [
      { subject: 'Data Structures', percentage: 88, total: 50, present: 44, absent: 6 },
      { subject: 'Database Management', percentage: 75, total: 48, present: 36, absent: 12 },
      { subject: 'Software Engineering', percentage: 92, total: 45, present: 41, absent: 4 }
    ]
  };
}

async function getTeacherAnalytics(userId: string, workflowEngine: WorkflowEngine) {
  // This would return teacher-specific analytics
  return {
    attendanceTrend: [
      { week: 'W1', attendance: 82 },
      { week: 'W2', attendance: 78 },
      { week: 'W3', attendance: 85 },
      { week: 'W4', attendance: 88 },
      { week: 'W5', attendance: 90 },
      { week: 'W6', attendance: 87 }
    ],
    assessmentOutcomes: [
      { subject: 'DS', avgMarks: 78, submissionRate: 92, onTimeRate: 85 },
      { subject: 'DBMS', avgMarks: 75, submissionRate: 88, onTimeRate: 80 },
      { subject: 'SE', avgMarks: 82, submissionRate: 95, onTimeRate: 90 },
      { subject: 'CN', avgMarks: 80, submissionRate: 90, onTimeRate: 85 }
    ],
    facultyWorkload: [
      { name: 'Dr. Ritu Makani', tasks: 45, completed: 38 },
      { name: 'Prof. Jyoti', tasks: 38, completed: 35 },
      { name: 'Prof. Sunila', tasks: 42, completed: 40 }
    ]
  };
}

async function getAdminAnalytics(workflowEngine: WorkflowEngine) {
  // This would return admin-specific analytics
  return {
    attendanceTrend: [
      { week: 'W1', attendance: 82 },
      { week: 'W2', attendance: 78 },
      { week: 'W3', attendance: 85 },
      { week: 'W4', attendance: 88 },
      { week: 'W5', attendance: 90 },
      { week: 'W6', attendance: 87 }
    ],
    riskDistribution: [
      { name: 'High Risk', value: 8, color: '#EF4444' },
      { name: 'Medium Risk', value: 15, color: '#F59E0B' },
      { name: 'Low Risk', value: 350, color: '#10B981' }
    ],
    departmentMetrics: {
      totalStudents: 373,
      totalFaculty: 45,
      averageAttendance: 85.5,
      assignmentSubmissionRate: 91.2,
      onTimeSubmissionRate: 87.8
    }
  };
}