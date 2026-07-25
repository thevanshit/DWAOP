import { WorkflowEngine } from '@/core/workflow/engine';
import { WorkflowInstance } from '@/types/workflow';
import { WorkflowRepository } from './workflows.repository';
import { logger } from '@/utils/logger';

/**
 * Service layer for workflow operations.
 * Wraps the WorkflowEngine and provides additional context formation,
 * pagination, type definitions, history, and comment management.
 */
export class WorkflowsService {
  private workflowEngine: WorkflowEngine;
  private repository: WorkflowRepository;

  constructor(workflowEngine: WorkflowEngine) {
    this.workflowEngine = workflowEngine;
    this.repository = new WorkflowRepository();
  }

  /**
   * Build the workflow context from user info.
   */
  private buildContext(user: {
    id: string;
    role: string;
    permissions: string[];
    departmentId?: string;
  }): { workflow: any; user: { id: string; role: string; permissions: string[]; departmentId?: string }; metadata: Record<string, any> } {
    return {
      workflow: {} as any,
      user: {
        id: user.id,
        role: user.role,
        permissions: user.permissions,
        departmentId: user.departmentId,
      },
      metadata: {},
    };
  }

  /**
   * Create a new workflow.
   */
  async create(
    data: {
      type: string;
      title: string;
      description?: string;
      assigneeId?: string;
      priority?: string;
      dueDate?: Date;
      metadata?: Record<string, any>;
    },
    user: { id: string; role: string; permissions: string[]; departmentId?: string }
  ): Promise<WorkflowInstance> {
    const context = this.buildContext(user);

    const workflow = await this.workflowEngine.createWorkflow(
      data.type,
      {
        title: data.title,
        description: data.description,
        assigneeId: data.assigneeId,
        priority: data.priority as any,
        dueDate: data.dueDate,
        metadata: data.metadata,
        departmentId: user.departmentId,
      },
      context
    );

    logger.info(`Workflow created: ${workflow.id} of type ${data.type}`);
    return workflow;
  }

  /**
   * List workflows with pagination.
   */
  async list(
    filters: {
      type?: string;
      assigneeId?: string;
      status?: string;
      priority?: string;
      departmentId?: string;
    },
    page: number = 1,
    limit: number = 20
  ): Promise<{ workflows: WorkflowInstance[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const workflows = await this.workflowEngine.getWorkflows(filters.type, {
      assigneeId: filters.assigneeId,
      status: filters.status,
      priority: filters.priority,
      departmentId: filters.departmentId,
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedWorkflows = workflows.slice(startIndex, endIndex);

    return {
      workflows: paginatedWorkflows,
      pagination: {
        page,
        limit,
        total: workflows.length,
        pages: Math.ceil(workflows.length / limit),
      },
    };
  }

  /**
   * Get a single workflow by ID.
   */
  async getById(id: string): Promise<WorkflowInstance | null> {
    return this.workflowEngine.getWorkflow(id);
  }

  /**
   * Transition a workflow to a new state.
   */
  async transition(
    id: string,
    toState: string,
    reason: string | undefined,
    user: { id: string; role: string; permissions: string[]; departmentId?: string }
  ): Promise<WorkflowInstance> {
    const context = this.buildContext(user);
    const workflow = await this.workflowEngine.transitionWorkflow(id, toState, context, reason);
    return workflow;
  }

  /**
   * Get available workflow type definitions.
   */
  getTypeDefinitions(): Array<{ id: string; name: string; description: string; states: string[] }> {
    return [
      {
        id: 'attendance_session',
        name: 'Attendance Session',
        description: 'Manage lecture attendance sessions',
        states: ['created', 'open', 'closed', 'finalised', 'locked'],
      },
      {
        id: 'assignment',
        name: 'Assignment',
        description: 'Manage assignments and submissions',
        states: ['created', 'assigned', 'submission_open', 'submission_closed', 'evaluation', 'evaluated', 'finalised', 'locked'],
      },
      {
        id: 'internal_marks',
        name: 'Internal Marks',
        description: 'Manage internal assessment marks',
        states: ['draft', 'submitted', 'under_review', 'finalised', 'locked'],
      },
      {
        id: 'leave_request',
        name: 'Leave Request',
        description: 'Manage student leave requests',
        states: ['created', 'under_review', 'approved', 'rejected', 'emergency'],
      },
      {
        id: 'student_track_report',
        name: 'Student Track Report',
        description: 'Comprehensive student academic tracking',
        states: ['draft', 'submitted', 'under_review', 'finalised', 'locked'],
      },
    ];
  }

  /**
   * Get transition history for a workflow.
   */
  async getHistory(workflowId: string): Promise<any[]> {
    return this.repository.getHistory(workflowId);
  }

  /**
   * Add a comment to a workflow.
   */
  async addComment(data: {
    workflowId: string;
    commenterId: string;
    comment: string;
    isInternal?: boolean;
  }): Promise<any> {
    return this.repository.addComment(data);
  }

  /**
   * Get comments for a workflow.
   */
  async getComments(workflowId: string): Promise<any[]> {
    return this.repository.getComments(workflowId);
  }
}
