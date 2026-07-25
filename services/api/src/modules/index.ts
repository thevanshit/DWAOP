import { Router } from 'express';
import { AuthMiddleware } from '@/middleware/auth';
import { AuthService } from '@/core/auth/service';
import { RBACService } from '@/core/rbac/service';
import { WorkflowEngine } from '@/core/workflow/engine';
import { NotificationService } from '@/services/notification';

import { createAuthModule } from './auth';
import { createUsersModule } from './users';
import { createStudentsModule } from './students';
import { createFacultyModule } from './faculty';
import { createDepartmentsModule } from './departments';
import { createAttendanceModule } from './attendance';
import { createAssignmentsModule } from './assignments';
import { createMarksModule } from './marks';
import { createLeavesModule } from './leaves';
import { createWorkflowsModule } from './workflows';
import { createDashboardModule } from './dashboard';

export interface ModuleDependencies {
  authService: AuthService;
  rbacService: RBACService;
  workflowEngine: WorkflowEngine;
  notificationService: NotificationService;
  authMiddleware: AuthMiddleware;
}

export interface Module {
  name: string;
  basePath: string;
  router: Router;
}

/**
 * Register all modules to the Express app
 */
export function registerModules(app: any, deps: ModuleDependencies): void {
  const modules: Module[] = [
    createAuthModule(deps),
    createUsersModule(deps),
    createStudentsModule(deps),
    createFacultyModule(deps),
    createDepartmentsModule(deps),
    createAttendanceModule(deps),
    createAssignmentsModule(deps),
    createMarksModule(deps),
    createLeavesModule(deps),
    createWorkflowsModule(deps),
    createDashboardModule(deps),
  ];

  for (const mod of modules) {
    app.use(mod.basePath, mod.router);
  }
}
