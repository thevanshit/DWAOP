import { Router } from 'express';
import { Module, ModuleDependencies } from '@/modules';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import {
  listLeavesValidator,
  createLeaveValidator,
  getLeaveByIdValidator,
  approveLeaveValidator,
  rejectLeaveValidator,
  pendingLeavesValidator,
} from './leaves.validator';

/**
 * Create the Leaves module with routes, controller, and service.
 * Base path: /api/leaves
 * All routes require authentication.
 */
export function createLeavesModule(deps: ModuleDependencies): Module {
  const service = new LeavesService(deps.workflowEngine, deps.notificationService);
  const controller = new LeavesController(service);

  const router = Router();

  // Authentication applied to all routes
  router.use(deps.authMiddleware.authenticate);

  // GET /api/leaves - List leave requests
  router.get('/', listLeavesValidator, controller.list);

  // GET /api/leaves/pending - Get pending leaves
  router.get('/pending', pendingLeavesValidator, controller.getPending);

  // POST /api/leaves - Create leave request
  router.post('/', createLeaveValidator, controller.create);

  // GET /api/leaves/:id - Get leave by ID
  router.get('/:id', getLeaveByIdValidator, controller.getById);

  // PUT /api/leaves/:id/approve - Approve leave (teacher/admin)
  router.put(
    '/:id/approve',
    approveLeaveValidator,
    deps.authMiddleware.requireRole(['teacher', 'admin', 'hod']),
    controller.approve
  );

  // PUT /api/leaves/:id/reject - Reject leave (teacher/admin)
  router.put(
    '/:id/reject',
    rejectLeaveValidator,
    deps.authMiddleware.requireRole(['teacher', 'admin', 'hod']),
    controller.reject
  );

  return {
    name: 'leaves',
    basePath: '/api/leaves',
    router,
  };
}
