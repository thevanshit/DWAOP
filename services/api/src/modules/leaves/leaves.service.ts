import { WorkflowEngine } from '@/core/workflow/engine';
import { LeavesRepository, LeaveFilters, CreateLeaveData, LeaveRecord } from './leaves.repository';
import { NotificationService } from '@/services/notification';
import { logger } from '@/utils/logger';

export interface LeaveContext {
  user: {
    id: string;
    role: string;
    permissions: string[];
    departmentId?: string;
  };
}

/**
 * Service layer for leave request business logic.
 * Orchestrates between the repository, workflow engine, and notification service.
 */
export class LeavesService {
  private repository: LeavesRepository;
  private workflowEngine: WorkflowEngine;
  private notificationService?: NotificationService;

  constructor(
    workflowEngine: WorkflowEngine,
    notificationService?: NotificationService
  ) {
    this.repository = new LeavesRepository();
    this.workflowEngine = workflowEngine;
    this.notificationService = notificationService;
  }

  /**
   * List leave requests with pagination and filtering.
   */
  async list(filters: LeaveFilters): Promise<{ data: LeaveRecord[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    return this.repository.findAll(filters);
  }

  /**
   * Get pending leave requests.
   */
  async getPending(
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: LeaveRecord[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    return this.repository.findAll({ page, limit, status: 'pending' });
  }

  /**
   * Get a leave request by ID.
   */
  async getById(id: string): Promise<LeaveRecord | null> {
    return this.repository.findById(id);
  }

  /**
   * Create a new leave request with workflow integration.
   */
  async create(data: CreateLeaveData, context: LeaveContext): Promise<{ leave: LeaveRecord; workflow: any }> {
    // Create the workflow first
    const workflow = await this.workflowEngine.createWorkflow(
      'leave_request',
      {
        title: `Leave Request - ${data.leaveType}`,
        description: data.reason,
        assigneeId: context.user.id,
        departmentId: context.user.departmentId,
        metadata: {
          leaveType: data.leaveType,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          totalDays: data.totalDays,
          isEmergency: data.isEmergency,
        },
      },
      {
        workflow: {} as any,
        user: {
          id: context.user.id,
          role: context.user.role,
          permissions: context.user.permissions,
          departmentId: context.user.departmentId,
        },
        metadata: {},
      }
    );

    // Save the leave request with reference to the workflow
    const leave = await this.repository.create({
      ...data,
      workflowId: workflow.id,
    });

    logger.info(`Leave request created: ${leave.id} with workflow: ${workflow.id}`);

    return { leave, workflow };
  }

  /**
   * Approve a leave request, transitioning the workflow and notifying the student.
   */
  async approve(id: string, context: LeaveContext): Promise<{ leave: LeaveRecord; workflow: any }> {
    const leave = await this.repository.findById(id);
    if (!leave) {
      throw new Error('Leave request not found');
    }

    // Transition the workflow to approved
    const workflow = await this.workflowEngine.transitionWorkflow(
      leave.workflow_id,
      'approved',
      {
        workflow: {} as any,
        user: {
          id: context.user.id,
          role: context.user.role,
          permissions: context.user.permissions,
          departmentId: context.user.departmentId,
        },
        metadata: {},
      },
      'Leave approved'
    );

    // Update the leave record status
    const updatedLeave = await this.repository.updateStatus(id, 'approved', context.user.id);
    if (!updatedLeave) {
      throw new Error('Failed to update leave status');
    }

    // Send notification
    if (this.notificationService) {
      try {
        await this.notificationService.sendWorkflowUpdate(
          workflow.id,
          'leave_request',
          'under_review',
          'approved',
          [leave.student_id],
          { leaveId: id }
        );
      } catch (notifError) {
        logger.error('Failed to send approval notification', notifError);
      }
    }

    logger.info(`Leave request ${id} approved by ${context.user.id}`);

    return { leave: updatedLeave, workflow };
  }

  /**
   * Reject a leave request, transitioning the workflow and notifying the student.
   */
  async reject(id: string, reason: string, context: LeaveContext): Promise<{ leave: LeaveRecord; workflow: any }> {
    const leave = await this.repository.findById(id);
    if (!leave) {
      throw new Error('Leave request not found');
    }

    // Transition the workflow to rejected
    const workflow = await this.workflowEngine.transitionWorkflow(
      leave.workflow_id,
      'rejected',
      {
        workflow: {} as any,
        user: {
          id: context.user.id,
          role: context.user.role,
          permissions: context.user.permissions,
          departmentId: context.user.departmentId,
        },
        metadata: {},
      },
      reason
    );

    // Update the leave record status
    const updatedLeave = await this.repository.updateStatus(id, 'rejected', context.user.id, reason);
    if (!updatedLeave) {
      throw new Error('Failed to update leave status');
    }

    // Send notification
    if (this.notificationService) {
      try {
        await this.notificationService.sendWorkflowUpdate(
          workflow.id,
          'leave_request',
          'under_review',
          'rejected',
          [leave.student_id],
          { leaveId: id, reason }
        );
      } catch (notifError) {
        logger.error('Failed to send rejection notification', notifError);
      }
    }

    logger.info(`Leave request ${id} rejected by ${context.user.id}`);

    return { leave: updatedLeave, workflow };
  }
}
