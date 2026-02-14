import { Workflow, UserRole } from '@/types';

export type WorkflowStatus = Workflow['status'];

export interface WorkflowTransition {
    from: WorkflowStatus;
    to: WorkflowStatus;
    allowedRoles: UserRole[];
    canAutoTransition?: (workflow: any) => boolean;
}

export const WORKFLOW_RULES: Record<Workflow['type'], WorkflowTransition[]> = {
    attendance: [
        { from: 'created', to: 'in_progress', allowedRoles: ['teacher', 'admin'] },
        { from: 'in_progress', to: 'finalised', allowedRoles: ['teacher', 'admin'] },
        { from: 'finalised', to: 'locked', allowedRoles: ['admin'] },
    ],
    assignment: [
        { from: 'created', to: 'in_progress', allowedRoles: ['teacher', 'admin'] },
        { from: 'in_progress', to: 'under_review', allowedRoles: ['student'] }, // Student submits
        { from: 'under_review', to: 'done', allowedRoles: ['teacher', 'admin'] }, // Teacher evaluates
        { from: 'in_progress', to: 'delayed', allowedRoles: ['admin'], canAutoTransition: (w) => w.dueDate && new Date() > new Date(w.dueDate) },
    ],
    marks: [
        { from: 'created', to: 'under_review', allowedRoles: ['teacher', 'admin'] },
        { from: 'under_review', to: 'finalised', allowedRoles: ['teacher', 'admin'] },
        { from: 'finalised', to: 'locked', allowedRoles: ['admin'] },
    ],
    leave: [
        { from: 'created', to: 'under_review', allowedRoles: ['student'] },
        { from: 'under_review', to: 'done', allowedRoles: ['teacher', 'admin'] },
    ],
    task: [
        { from: 'created', to: 'in_progress', allowedRoles: ['teacher', 'admin'] },
        { from: 'in_progress', to: 'done', allowedRoles: ['teacher', 'admin'] },
        { from: 'in_progress', to: 'delayed', allowedRoles: ['admin'] },
    ],
};

export function canTransition(
    type: Workflow['type'],
    from: WorkflowStatus,
    to: WorkflowStatus,
    userRole: UserRole
): boolean {
    const rules = WORKFLOW_RULES[type];
    const transition = rules.find((r) => r.from === from && r.to === to);

    if (!transition) return false;
    return transition.allowedRoles.includes(userRole);
}

export function getNextPossibleStatuses(
    type: Workflow['type'],
    currentStatus: WorkflowStatus,
    userRole: UserRole
): WorkflowStatus[] {
    const rules = WORKFLOW_RULES[type];
    return rules
        .filter((r) => r.from === currentStatus && r.allowedRoles.includes(userRole))
        .map((r) => r.to);
}

export function getStatusColor(status: WorkflowStatus): string {
    switch (status) {
        case 'created': return 'bg-gray-100 text-gray-600';
        case 'in_progress': return 'bg-blue-100 text-blue-600';
        case 'under_review': return 'bg-yellow-100 text-yellow-600';
        case 'finalised': return 'bg-purple-100 text-purple-600';
        case 'locked': return 'bg-indigo-100 text-indigo-600';
        case 'done': return 'bg-green-100 text-green-600';
        case 'delayed': return 'bg-red-100 text-red-600';
        default: return 'bg-gray-100 text-gray-600';
    }
}
