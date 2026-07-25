import { Router } from 'express';
import { Module, ModuleDependencies } from '@/modules';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { dashboardWorkflowsValidator } from './dashboard.validator';

/**
 * Create the Dashboard module with routes, controller, and service.
 * Base path: /api/dashboard
 * All routes require authentication.
 */
export function createDashboardModule(deps: ModuleDependencies): Module {
  const service = new DashboardService(deps.workflowEngine);
  const controller = new DashboardController(service);

  const router = Router();

  // Authentication applied to all routes
  router.use(deps.authMiddleware.authenticate);

  // GET /api/dashboard/stats - Get role-based dashboard statistics
  router.get('/stats', controller.getStats);

  // GET /api/dashboard/workflows - Get role-based workflows
  router.get('/workflows', dashboardWorkflowsValidator, controller.getWorkflows);

  // GET /api/dashboard/analytics - Get role-based analytics
  router.get('/analytics', controller.getAnalytics);

  return {
    name: 'dashboard',
    basePath: '/api/dashboard',
    router,
  };
}
