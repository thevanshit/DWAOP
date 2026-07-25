import { WorkflowEngine } from '@/core/workflow/engine';
import { DashboardRepository } from './dashboard.repository';

/**
 * Service layer for dashboard operations.
 * Provides role-based statistics, workflows, and analytics data
 * extracted from the WorkflowEngine and other sources.
 */
export class DashboardService {
  private workflowEngine: WorkflowEngine;
  private repository: DashboardRepository;

  constructor(workflowEngine: WorkflowEngine) {
    this.workflowEngine = workflowEngine;
    this.repository = new DashboardRepository();
  }

  /**
   * Get dashboard stats based on the user's role.
   */
  async getStats(user: { id: string; role: string; permissions: string[]; departmentId?: string }): Promise<any> {
    switch (user.role) {
      case 'student':
        return this.getStudentStats(user.id);
      case 'teacher':
        return this.getTeacherStats(user.id);
      case 'admin':
      case 'hod':
        return this.getAdminStats();
      default:
        return { message: 'No stats available for this role' };
    }
  }

  /**
   * Get dashboard workflows for the user based on role.
   */
  async getWorkflows(
    user: { id: string; role: string; permissions: string[]; departmentId?: string },
    options: { type?: string; status?: string; limit?: number }
  ): Promise<any[]> {
    switch (user.role) {
      case 'student':
        return this.getStudentWorkflows(user.id, options);
      case 'teacher':
        return this.getTeacherWorkflows(user.id, options);
      case 'admin':
      case 'hod':
        return this.getAdminWorkflows(options);
      default:
        return [];
    }
  }

  /**
   * Get analytics data for the user based on role.
   */
  async getAnalytics(user: { id: string; role: string; permissions: string[]; departmentId?: string }): Promise<any> {
    switch (user.role) {
      case 'student':
        return this.getStudentAnalytics();
      case 'teacher':
        return this.getTeacherAnalytics();
      case 'admin':
      case 'hod':
        return this.getAdminAnalytics();
      default:
        return {};
    }
  }

  // --------------------------------------------------------------------------
  // Student-specific helpers
  // --------------------------------------------------------------------------

  private async getStudentStats(userId: string) {
    const pendingWorkflows = await this.workflowEngine.getWorkflows(undefined, {
      assigneeId: userId,
    });

    const assignments = await this.workflowEngine.getWorkflows('assignment', {
      assigneeId: userId,
    });

    return {
      pendingWorkflows: pendingWorkflows.filter((w) => w.currentState !== 'done').length,
      upcomingDeadlines: assignments.filter(
        (w) =>
          w.dueDate && new Date(w.dueDate) > new Date() && new Date(w.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ).length,
      attendancePercentage: 85,
      assignmentsCompleted: assignments.filter((w) => w.currentState === 'evaluated').length,
      totalAssignments: assignments.length,
      eligibilityStatus: 'eligible',
    };
  }

  private async getStudentWorkflows(
    userId: string,
    options: { type?: string; status?: string; limit?: number }
  ): Promise<any[]> {
    const workflows = await this.workflowEngine.getWorkflows(undefined, {
      assigneeId: userId,
    });

    return workflows.slice(0, options.limit || 10);
  }

  private getStudentAnalytics() {
    return {
      attendanceTrend: [
        { week: 'W1', attendance: 82 },
        { week: 'W2', attendance: 78 },
        { week: 'W3', attendance: 85 },
        { week: 'W4', attendance: 88 },
        { week: 'W5', attendance: 90 },
        { week: 'W6', attendance: 87 },
      ],
      performanceData: [
        { subject: 'DS', internal: 85 },
        { subject: 'DBMS', internal: 73 },
        { subject: 'SE', internal: 88 },
        { subject: 'CN', internal: 80 },
      ],
      subjectWiseAttendance: [
        { subject: 'Data Structures', percentage: 88, total: 50, present: 44, absent: 6 },
        { subject: 'Database Management', percentage: 75, total: 48, present: 36, absent: 12 },
        { subject: 'Software Engineering', percentage: 92, total: 45, present: 41, absent: 4 },
      ],
    };
  }

  // --------------------------------------------------------------------------
  // Teacher-specific helpers
  // --------------------------------------------------------------------------

  private async getTeacherStats(userId: string) {
    const assignedWorkflows = await this.workflowEngine.getWorkflows(undefined, {
      assigneeId: userId,
    });

    const assignments = await this.workflowEngine.getWorkflows('assignment');

    return {
      pendingEvaluations: assignments.filter((w) => w.currentState === 'submission_closed').length,
      upcomingSessions: assignedWorkflows.filter(
        (w) => w.type === 'attendance_session' && w.currentState === 'created'
      ).length,
      totalStudents: 350,
      delayedTasks: assignedWorkflows.filter(
        (w) => w.dueDate && new Date(w.dueDate) < new Date() && w.currentState !== 'done'
      ).length,
    };
  }

  private async getTeacherWorkflows(
    userId: string,
    options: { type?: string; status?: string; limit?: number }
  ): Promise<any[]> {
    const workflows = await this.workflowEngine.getWorkflows(undefined, {
      assigneeId: userId,
    });

    return workflows.slice(0, options.limit || 10);
  }

  private getTeacherAnalytics() {
    return {
      attendanceTrend: [
        { week: 'W1', attendance: 82 },
        { week: 'W2', attendance: 78 },
        { week: 'W3', attendance: 85 },
        { week: 'W4', attendance: 88 },
        { week: 'W5', attendance: 90 },
        { week: 'W6', attendance: 87 },
      ],
      assessmentOutcomes: [
        { subject: 'DS', avgMarks: 78, submissionRate: 92, onTimeRate: 85 },
        { subject: 'DBMS', avgMarks: 75, submissionRate: 88, onTimeRate: 80 },
        { subject: 'SE', avgMarks: 82, submissionRate: 95, onTimeRate: 90 },
        { subject: 'CN', avgMarks: 80, submissionRate: 90, onTimeRate: 85 },
      ],
      facultyWorkload: [
        { name: 'Dr. Ritu Makani', tasks: 45, completed: 38 },
        { name: 'Prof. Jyoti', tasks: 38, completed: 35 },
        { name: 'Prof. Sunila', tasks: 42, completed: 40 },
      ],
    };
  }

  // --------------------------------------------------------------------------
  // Admin-specific helpers
  // --------------------------------------------------------------------------

  private async getAdminStats() {
    const allWorkflows = await this.workflowEngine.getWorkflows();

    return {
      totalWorkflows: allWorkflows.length,
      activeWorkflows: allWorkflows.filter((w) => !['done', 'locked'].includes(w.currentState)).length,
      delayedWorkflows: allWorkflows.filter(
        (w) => w.dueDate && new Date(w.dueDate) < new Date() && w.currentState !== 'done'
      ).length,
      atRiskStudents: 15,
      totalUsers: 420,
      departmentHealth: 92,
    };
  }

  private async getAdminWorkflows(options: { type?: string; status?: string; limit?: number }): Promise<any[]> {
    const workflows = await this.workflowEngine.getWorkflows();

    return workflows.slice(0, options.limit || 10);
  }

  private getAdminAnalytics() {
    return {
      attendanceTrend: [
        { week: 'W1', attendance: 82 },
        { week: 'W2', attendance: 78 },
        { week: 'W3', attendance: 85 },
        { week: 'W4', attendance: 88 },
        { week: 'W5', attendance: 90 },
        { week: 'W6', attendance: 87 },
      ],
      riskDistribution: [
        { name: 'High Risk', value: 8, color: '#EF4444' },
        { name: 'Medium Risk', value: 15, color: '#F59E0B' },
        { name: 'Low Risk', value: 350, color: '#10B981' },
      ],
      departmentMetrics: {
        totalStudents: 373,
        totalFaculty: 45,
        averageAttendance: 85.5,
        assignmentSubmissionRate: 91.2,
        onTimeSubmissionRate: 87.8,
      },
    };
  }
}
