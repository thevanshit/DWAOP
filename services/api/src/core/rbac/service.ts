import { logger } from '@/utils/logger';
import Database from '@/config/database';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
  conditions?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface ResourceContext {
  type: string;
  id?: string;
  attributes?: Record<string, any>;
}

export class RBACService {
  private db: Database;
  private permissionCache: Map<string, Permission> = new Map();
  private roleCache: Map<string, Role> = new Map();
  private userPermissionCache: Map<string, Set<string>> = new Map();

  constructor(db: Database) {
    this.db = db;
    this.initializePermissions();
  }

  /**
   * Initialize system permissions
   */
  private async initializePermissions(): Promise<void> {
    try {
      // Core permissions
      const permissions: Permission[] = [
        // Workflow permissions
        { id: 'workflow.create', name: 'Create Workflow', resource: 'workflow', action: 'create' },
        { id: 'workflow.read', name: 'Read Workflow', resource: 'workflow', action: 'read' },
        { id: 'workflow.update', name: 'Update Workflow', resource: 'workflow', action: 'update' },
        { id: 'workflow.transition', name: 'Transition Workflow', resource: 'workflow', action: 'transition' },
        { id: 'workflow.delete', name: 'Delete Workflow', resource: 'workflow', action: 'delete' },
        { id: 'workflow.lock', name: 'Lock Workflow', resource: 'workflow', action: 'lock' },

        // Attendance permissions
        { id: 'attendance.open', name: 'Open Attendance', resource: 'attendance', action: 'open' },
        { id: 'attendance.close', name: 'Close Attendance', resource: 'attendance', action: 'close' },
        { id: 'attendance.mark', name: 'Mark Attendance', resource: 'attendance', action: 'mark' },
        { id: 'attendance.finalise', name: 'Finalise Attendance', resource: 'attendance', action: 'finalise' },
        { id: 'attendance.lock', name: 'Lock Attendance', resource: 'attendance', action: 'lock' },

        // Assignment permissions
        { id: 'assignment.publish', name: 'Publish Assignment', resource: 'assignment', action: 'publish' },
        { id: 'assignment.open_submissions', name: 'Open Submissions', resource: 'assignment', action: 'open_submissions' },
        { id: 'assignment.submit', name: 'Submit Assignment', resource: 'assignment', action: 'submit' },
        { id: 'assignment.evaluate', name: 'Evaluate Assignment', resource: 'assignment', action: 'evaluate' },
        { id: 'assignment.complete_evaluation', name: 'Complete Evaluation', resource: 'assignment', action: 'complete_evaluation' },
        { id: 'assignment.finalise', name: 'Finalise Assignment', resource: 'assignment', action: 'finalise' },

        // Marks permissions
        { id: 'marks.submit', name: 'Submit Marks', resource: 'marks', action: 'submit' },
        { id: 'marks.review', name: 'Review Marks', resource: 'marks', action: 'review' },
        { id: 'marks.finalise', name: 'Finalise Marks', resource: 'marks', action: 'finalise' },
        { id: 'marks.lock', name: 'Lock Marks', resource: 'marks', action: 'lock' },

        // Leave permissions
        { id: 'leave.submit', name: 'Submit Leave', resource: 'leave', action: 'submit' },
        { id: 'leave.approve', name: 'Approve Leave', resource: 'leave', action: 'approve' },
        { id: 'leave.reject', name: 'Reject Leave', resource: 'leave', action: 'reject' },
        { id: 'leave.emergency', name: 'Emergency Leave', resource: 'leave', action: 'emergency' },

        // Student Track permissions
        { id: 'track.submit', name: 'Submit Track Report', resource: 'track', action: 'submit' },
        { id: 'track.open_review', name: 'Open Review Window', resource: 'track', action: 'open_review' },
        { id: 'track.finalise', name: 'Finalise Track Report', resource: 'track', action: 'finalise' },
        { id: 'track.lock', name: 'Lock Track Report', resource: 'track', action: 'lock' },

        // Admin permissions
        { id: 'admin.user_manage', name: 'Manage Users', resource: 'admin', action: 'user_manage' },
        { id: 'admin.role_manage', name: 'Manage Roles', resource: 'admin', action: 'role_manage' },
        { id: 'admin.system_config', name: 'System Configuration', resource: 'admin', action: 'system_config' },
        { id: 'admin.audit_view', name: 'View Audit Logs', resource: 'admin', action: 'audit_view' },
      ];

      // Cache permissions
      for (const permission of permissions) {
        this.permissionCache.set(permission.id, permission);
      }

      logger.info(`Initialized ${permissions.length} system permissions`);
    } catch (error) {
      logger.error('Failed to initialize permissions', error);
      throw error;
    }
  }

  /**
   * Initialize system roles
   */
  public async initializeRoles(): Promise<void> {
    try {
      const roles: Role[] = [
        {
          id: 'student',
          name: 'student',
          displayName: 'Student',
          permissions: [
            'workflow.read',
            'assignment.submit',
            'leave.submit',
            'track.submit'
          ],
          conditions: {
            own_data_only: true,
            enrolled_subjects_only: true
          }
        },
        {
          id: 'teacher',
          name: 'teacher',
          displayName: 'Teacher/Faculty',
          permissions: [
            'workflow.create',
            'workflow.read',
            'workflow.update',
            'workflow.transition',
            'attendance.open',
            'attendance.close',
            'attendance.mark',
            'attendance.finalise',
            'assignment.publish',
            'assignment.open_submissions',
            'assignment.evaluate',
            'assignment.complete_evaluation',
            'assignment.finalise',
            'marks.submit',
            'marks.review',
            'leave.approve',
            'leave.reject'
          ],
          conditions: {
            assigned_subjects_only: true,
            own_students_only: true
          }
        },
        {
          id: 'admin',
          name: 'admin',
          displayName: 'Administrator',
          permissions: [
            'workflow.create',
            'workflow.read',
            'workflow.update',
            'workflow.transition',
            'workflow.delete',
            'workflow.lock',
            'attendance.open',
            'attendance.close',
            'attendance.mark',
            'attendance.finalise',
            'attendance.lock',
            'assignment.publish',
            'assignment.open_submissions',
            'assignment.evaluate',
            'assignment.complete_evaluation',
            'assignment.finalise',
            'marks.submit',
            'marks.review',
            'marks.finalise',
            'marks.lock',
            'leave.submit',
            'leave.approve',
            'leave.reject',
            'leave.emergency',
            'track.submit',
            'track.open_review',
            'track.finalise',
            'track.lock',
            'admin.user_manage',
            'admin.role_manage',
            'admin.system_config',
            'admin.audit_view'
          ]
        },
        {
          id: 'hod',
          name: 'hod',
          displayName: 'Head of Department',
          permissions: [
            'workflow.read',
            'workflow.transition',
            'attendance.finalise',
            'attendance.lock',
            'assignment.finalise',
            'marks.review',
            'marks.finalise',
            'marks.lock',
            'leave.approve',
            'leave.reject',
            'leave.emergency',
            'track.finalise',
            'track.lock',
            'admin.user_manage',
            'admin.audit_view'
          ]
        },
        {
          id: 'guest_faculty',
          name: 'guest_faculty',
          displayName: 'Guest Faculty',
          permissions: [
            'workflow.read',
            'attendance.mark',
            'assignment.evaluate'
          ],
          conditions: {
            assigned_subjects_only: true,
            time_bound: true
          }
        }
      ];

      // Cache roles
      for (const role of roles) {
        this.roleCache.set(role.id, role);
      }

      logger.info(`Initialized ${roles.length} system roles`);
    } catch (error) {
      logger.error('Failed to initialize roles', error);
      throw error;
    }
  }

  /**
   * Check if user has permission for specific action on resource
   */
  public async hasPermission(
    userId: string,
    permission: string,
    resourceContext?: ResourceContext
  ): Promise<boolean> {
    try {
      // Get user permissions (with caching)
      const userPermissions = await this.getUserPermissions(userId);

      // Check direct permission
      if (!userPermissions.has(permission)) {
        return false;
      }

      // Check resource-specific conditions
      if (resourceContext) {
        return await this.checkResourceConditions(userId, permission, resourceContext);
      }

      return true;
    } catch (error) {
      logger.error(`Failed to check permission for user ${userId}`, error);
      return false;
    }
  }

  /**
   * Get user permissions with caching
   */
  public async getUserPermissions(userId: string): Promise<Set<string>> {
    // Check cache first
    if (this.userPermissionCache.has(userId)) {
      return this.userPermissionCache.get(userId)!;
    }

    try {
      // Get user from database
      const userResult = await this.db.query(
        'SELECT role FROM users WHERE id = $1 AND is_active = true',
        [userId]
      );

      if (!userResult.rows[0]) {
        return new Set();
      }

      const user = userResult.rows[0];
      const role = this.roleCache.get(user.role);

      if (!role) {
        logger.warn(`Unknown role: ${user.role} for user: ${userId}`);
        return new Set();
      }

      // Combine role permissions with user-specific permissions
      const permissions = new Set(role.permissions);

      // Cache the permissions
      this.userPermissionCache.set(userId, permissions);

      return permissions;
    } catch (error) {
      logger.error(`Failed to get permissions for user ${userId}`, error);
      return new Set();
    }
  }

  /**
   * Check resource-specific conditions
   */
  private async checkResourceConditions(
    userId: string,
    permission: string,
    resourceContext: ResourceContext
  ): Promise<boolean> {
    try {
      // Get user and role information
      const userResult = await this.db.query(
        'SELECT role FROM users WHERE id = $1',
        [userId]
      );

      if (!userResult.rows[0]) {
        return false;
      }

      const user = userResult.rows[0];
      const role = this.roleCache.get(user.role);

      if (!role || !role.conditions) {
        return true; // No conditions to check
      }

      // Check various conditions based on resource type
      switch (resourceContext.type) {
        case 'workflow':
          return await this.checkWorkflowConditions(userId, resourceContext, role.conditions);
        case 'attendance':
          return await this.checkAttendanceConditions(userId, resourceContext, role.conditions);
        case 'assignment':
          return await this.checkAssignmentConditions(userId, resourceContext, role.conditions);
        default:
          return true;
      }
    } catch (error) {
      logger.error(`Failed to check resource conditions for user ${userId}`, error);
      return false;
    }
  }

  /**
   * Check workflow-specific conditions
   */
  private async checkWorkflowConditions(
    userId: string,
    resourceContext: ResourceContext,
    conditions: Record<string, any>
  ): Promise<boolean> {
    // Example: Check if user is assigned to this workflow
    if (conditions.assigned_workflows_only && resourceContext.id) {
      const result = await this.db.query(
        'SELECT 1 FROM workflows WHERE id = $1 AND assignee_id = $2',
        [resourceContext.id, userId]
      );
      return result.rows.length > 0;
    }

    return true;
  }

  /**
   * Check attendance-specific conditions
   */
  private async checkAttendanceConditions(
    userId: string,
    resourceContext: ResourceContext,
    conditions: Record<string, any>
  ): Promise<boolean> {
    // Example: Check if user is the teacher for this attendance session
    if (conditions.assigned_subjects_only && resourceContext.id) {
      const result = await this.db.query(
        `SELECT 1 FROM attendance_records 
         WHERE id = $1 AND created_by = $2`,
        [resourceContext.id, userId]
      );
      return result.rows.length > 0;
    }

    return true;
  }

  /**
   * Check assignment-specific conditions
   */
  private async checkAssignmentConditions(
    userId: string,
    resourceContext: ResourceContext,
    conditions: Record<string, any>
  ): Promise<boolean> {
    // Example: Check if user is the teacher for this assignment
    if (conditions.assigned_subjects_only && resourceContext.id) {
      const result = await this.db.query(
        'SELECT 1 FROM assignments WHERE id = $1 AND created_by = $2',
        [resourceContext.id, userId]
      );
      return result.rows.length > 0;
    }

    return true;
  }

  /**
   * Clear user permission cache (useful when roles change)
   */
  public clearUserPermissionCache(userId?: string): void {
    if (userId) {
      this.userPermissionCache.delete(userId);
    } else {
      this.userPermissionCache.clear();
    }
  }

  /**
   * Get all available permissions
   */
  public getPermissions(): Permission[] {
    return Array.from(this.permissionCache.values());
  }

  /**
   * Get all available roles
   */
  public getRoles(): Role[] {
    return Array.from(this.roleCache.values());
  }

  /**
   * Get role by name
   */
  public getRole(roleName: string): Role | undefined {
    return this.roleCache.get(roleName);
  }
}