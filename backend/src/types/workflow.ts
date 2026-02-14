// Core workflow types and interfaces
export interface WorkflowType {
  id: string;
  name: string;
  description: string;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  permissions: WorkflowPermission[];
  automations: WorkflowAutomation[];
  metadata: Record<string, any>;
}

export interface WorkflowState {
  id: string;
  name: string;
  description: string;
  isFinal: boolean;
  isInitial: boolean;
  permissions: string[];
  timeouts?: {
    after?: number; // hours
    transitionTo?: string;
  };
}

export interface WorkflowTransition {
  id: string;
  from: string;
  to: string;
  name: string;
  description: string;
  guard?: string; // permission guard
  conditions?: TransitionCondition[];
  actions?: TransitionAction[];
}

export interface TransitionCondition {
  type: 'role' | 'attribute' | 'time' | 'custom';
  operator: 'equals' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  field: string;
  value: any;
}

export interface TransitionAction {
  type: 'notification' | 'automation' | 'validation' | 'custom';
  config: Record<string, any>;
}

export interface WorkflowPermission {
  role: string;
  permissions: ('create' | 'read' | 'update' | 'transition' | 'delete' | 'lock')[];
  conditions?: Record<string, any>;
}

export interface WorkflowAutomation {
  trigger: 'state_change' | 'deadline' | 'manual';
  condition: string;
  action: string;
  config: Record<string, any>;
}

export interface WorkflowInstance {
  id: string;
  type: string;
  currentState: string;
  creatorId: string;
  assigneeId?: string;
  departmentId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  finalizedAt?: Date;
  lockedAt?: Date;
}

export interface WorkflowTransitionRecord {
  id: string;
  workflowId: string;
  fromState: string;
  toState: string;
  transitionedBy: string;
  reason?: string;
  transitionedAt: Date;
  metadata: Record<string, any>;
}

// Workflow execution context
export interface WorkflowContext {
  workflow: WorkflowInstance;
  user: {
    id: string;
    role: string;
    permissions: string[];
    departmentId?: string;
  };
  metadata: Record<string, any>;
}