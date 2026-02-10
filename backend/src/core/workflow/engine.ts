import { WorkflowType, WorkflowState, WorkflowTransition, WorkflowInstance, WorkflowContext } from '@/types/workflow';
import { logger } from '@/utils/logger';
import Database from '@/config/database';

export class WorkflowEngine {
  private workflowTypes: Map<string, WorkflowType> = new Map();
  private db: Database;

  constructor(db: Database) {
    this.db = db;
    this.initializeWorkflowTypes();
  }

  /**
   * Initialize all workflow types from database
   */
  private async initializeWorkflowTypes(): Promise<void> {
    try {
      const result = await this.db.query(`
        SELECT 
          wt.*,
          json_agg(
            json_build_object(
              'id', ws.id,
              'name', ws.name,
              'description', ws.description,
              'is_final', ws.is_final,
              'is_initial', ws.is_initial,
              'permissions', ws.permissions,
              'timeouts', ws.timeouts
            )
          ) as states,
          json_agg(
            json_build_object(
              'id', wt_trans.id,
              'from', wt_trans.from_state,
              'to', wt_trans.to_state,
              'name', wt_trans.name,
              'description', wt_trans.description,
              'guard', wt_trans.guard,
              'conditions', wt_trans.conditions,
              'actions', wt_trans.actions
            )
          ) as transitions
        FROM workflow_types wt
        LEFT JOIN workflow_states ws ON wt.id = ws.workflow_type_id
        LEFT JOIN workflow_transitions wt_trans ON wt.id = wt_trans.workflow_type_id
        GROUP BY wt.id
      `);

      for (const row of result.rows) {
        this.workflowTypes.set(row.id, {
          id: row.id,
          name: row.name,
          description: row.description,
          states: row.states || [],
          transitions: row.transitions || [],
          permissions: row.permissions || [],
          automations: row.automations || [],
          metadata: row.metadata || {}
        });
      }

      logger.info(`Initialized ${this.workflowTypes.size} workflow types`);
    } catch (error) {
      logger.error('Failed to initialize workflow types', error);
      throw error;
    }
  }

  /**
   * Create a new workflow instance
   */
  public async createWorkflow(
    type: string,
    data: Partial<WorkflowInstance>,
    context: WorkflowContext
  ): Promise<WorkflowInstance> {
    const workflowType = this.workflowTypes.get(type);
    if (!workflowType) {
      throw new Error(`Unknown workflow type: ${type}`);
    }

    const initialState = workflowType.states.find(state => state.isInitial);
    if (!initialState) {
      throw new Error(`No initial state found for workflow type: ${type}`);
    }

    // Validate permissions
    if (!this.hasPermission(context, 'create', workflowType)) {
      throw new Error('User does not have permission to create this workflow type');
    }

    const workflow: WorkflowInstance = {
      id: this.generateId(),
      type,
      currentState: initialState.id,
      creatorId: context.user.id,
      assigneeId: data.assigneeId,
      title: data.title || '',
      description: data.description,
      priority: data.priority || 'medium',
      dueDate: data.dueDate,
      metadata: data.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to database
    await this.saveWorkflow(workflow);

    // Log creation
    await this.logTransition(workflow.id, null, initialState.id, context.user.id, 'Workflow created');

    // Trigger automations
    await this.triggerAutomations(workflow, 'created', context);

    logger.info(`Created workflow ${workflow.id} of type ${type}`);
    return workflow;
  }

  /**
   * Transition a workflow to a new state
   */
  public async transitionWorkflow(
    workflowId: string,
    toState: string,
    context: WorkflowContext,
    reason?: string
  ): Promise<WorkflowInstance> {
    const workflow = await this.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const workflowType = this.workflowTypes.get(workflow.type);
    if (!workflowType) {
      throw new Error(`Unknown workflow type: ${workflow.type}`);
    }

    // Find valid transition
    const transition = workflowType.transitions.find(
      t => t.from === workflow.currentState && t.to === toState
    );

    if (!transition) {
      throw new Error(`Invalid transition from ${workflow.currentState} to ${toState}`);
    }

    // Check permissions
    if (!this.canTransition(transition, context)) {
      throw new Error('User does not have permission to perform this transition');
    }

    // Check conditions
    if (!this.validateConditions(transition.conditions, workflow, context)) {
      throw new Error('Transition conditions not met');
    }

    const fromState = workflow.currentState;
    workflow.currentState = toState;
    workflow.updatedAt = new Date();

    // Update final/locked timestamps
    const targetState = workflowType.states.find(s => s.id === toState);
    if (targetState?.isFinal) {
      workflow.finalizedAt = new Date();
    }
    if (toState === 'locked') {
      workflow.lockedAt = new Date();
    }

    // Save to database
    await this.saveWorkflow(workflow);

    // Log transition
    await this.logTransition(workflowId, fromState, toState, context.user.id, reason);

    // Execute transition actions
    if (transition.actions) {
      await this.executeActions(transition.actions, workflow, context);
    }

    // Trigger automations
    await this.triggerAutomations(workflow, 'state_changed', context);

    logger.info(`Transitioned workflow ${workflowId} from ${fromState} to ${toState}`);
    return workflow;
  }

  /**
   * Get workflow by ID
   */
  public async getWorkflow(id: string): Promise<WorkflowInstance | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM workflows WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Failed to get workflow ${id}`, error);
      throw error;
    }
  }

  /**
   * Get workflows by type and filters
   */
  public async getWorkflows(
    type?: string,
    filters?: {
      assigneeId?: string;
      status?: string;
      priority?: string;
      departmentId?: string;
    }
  ): Promise<WorkflowInstance[]> {
    let query = 'SELECT * FROM workflows WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(type);
    }

    if (filters?.assigneeId) {
      query += ` AND assignee_id = $${paramIndex++}`;
      params.push(filters.assigneeId);
    }

    if (filters?.status) {
      query += ` AND current_state = $${paramIndex++}`;
      params.push(filters.status);
    }

    if (filters?.priority) {
      query += ` AND priority = $${paramIndex++}`;
      params.push(filters.priority);
    }

    query += ' ORDER BY created_at DESC';

    try {
      const result = await this.db.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error('Failed to get workflows', error);
      throw error;
    }
  }

  /**
   * Check if user has permission for workflow action
   */
  private hasPermission(
    context: WorkflowContext,
    action: string,
    workflowType: WorkflowType
  ): boolean {
    const userRole = context.user.role;
    const rolePermissions = workflowType.permissions.find(p => p.role === userRole);
    
    if (!rolePermissions) {
      return false;
    }

    return rolePermissions.permissions.includes(action as any);
  }

  /**
   * Check if user can perform a specific transition
   */
  private canTransition(
    transition: WorkflowTransition,
    context: WorkflowContext
  ): boolean {
    if (transition.guard) {
      // Check if user has the required guard permission
      return context.user.permissions.includes(transition.guard);
    }
    return true;
  }

  /**
   * Validate transition conditions
   */
  private validateConditions(
    conditions: any[] | undefined,
    workflow: WorkflowInstance,
    context: WorkflowContext
  ): boolean {
    if (!conditions || conditions.length === 0) {
      return true;
    }

    return conditions.every(condition => {
      switch (condition.type) {
        case 'role':
          return context.user.role === condition.value;
        case 'attribute':
          return context.user.attributes[condition.field] === condition.value;
        case 'time':
          // Add time-based validation logic
          return true;
        default:
          return true;
      }
    });
  }

  /**
   * Execute transition actions
   */
  private async executeActions(
    actions: any[],
    workflow: WorkflowInstance,
    context: WorkflowContext
  ): Promise<void> {
    for (const action of actions) {
      switch (action.type) {
        case 'notification':
          // Trigger notification
          await this.triggerNotification(workflow, action.config, context);
          break;
        case 'automation':
          // Execute automation
          await this.executeAutomation(workflow, action.config, context);
          break;
        default:
          logger.warn(`Unknown action type: ${action.type}`);
      }
    }
  }

  /**
   * Trigger workflow automations
   */
  private async triggerAutomations(
    workflow: WorkflowInstance,
    trigger: string,
    context: WorkflowContext
  ): Promise<void> {
    const workflowType = this.workflowTypes.get(workflow.type);
    if (!workflowType) return;

    const automations = workflowType.automations.filter(
      auto => auto.trigger === trigger
    );

    for (const automation of automations) {
      try {
        await this.executeAutomation(workflow, automation.config, context);
      } catch (error) {
        logger.error(`Failed to execute automation for workflow ${workflow.id}`, error);
      }
    }
  }

  /**
   * Execute specific automation
   */
  private async executeAutomation(
    workflow: WorkflowInstance,
    config: Record<string, any>,
    context: WorkflowContext
  ): Promise<void> {
    // This would integrate with your automation service
    logger.info(`Executing automation for workflow ${workflow.id}`, config);
  }

  /**
   * Trigger notification
   */
  private async triggerNotification(
    workflow: WorkflowInstance,
    config: Record<string, any>,
    context: WorkflowContext
  ): Promise<void> {
    // This would integrate with your notification service
    logger.info(`Triggering notification for workflow ${workflow.id}`, config);
  }

  /**
   * Save workflow to database
   */
  private async saveWorkflow(workflow: WorkflowInstance): Promise<void> {
    await this.db.query(`
      INSERT INTO workflows (
        id, type, status, title, description, creator_id, assignee_id,
        priority, due_date, metadata, created_at, updated_at, finalized_at, locked_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        assignee_id = EXCLUDED.assignee_id,
        priority = EXCLUDED.priority,
        due_date = EXCLUDED.due_date,
        metadata = EXCLUDED.metadata,
        updated_at = EXCLUDED.updated_at,
        finalized_at = EXCLUDED.finalized_at,
        locked_at = EXCLUDED.locked_at
    `, [
      workflow.id,
      workflow.type,
      workflow.currentState,
      workflow.title,
      workflow.description,
      workflow.creatorId,
      workflow.assigneeId,
      workflow.priority,
      workflow.dueDate,
      JSON.stringify(workflow.metadata),
      workflow.createdAt,
      workflow.updatedAt,
      workflow.finalizedAt,
      workflow.lockedAt
    ]);
  }

  /**
   * Log workflow transition
   */
  private async logTransition(
    workflowId: string,
    fromState: string | null,
    toState: string,
    userId: string,
    reason?: string
  ): Promise<void> {
    await this.db.query(`
      INSERT INTO workflow_transitions (
        workflow_id, from_status, to_status, transitioned_by, reason, transitioned_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      workflowId,
      fromState,
      toState,
      userId,
      reason,
      new Date()
    ]);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}