import { Router } from 'express';
import { Module, ModuleDependencies } from '@/modules';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import {
  createWorkflowValidator,
  listWorkflowsValidator,
  transitionWorkflowValidator,
  addCommentValidator,
} from './workflows.validator';

/**
 * Create the Workflows module with routes, controller, and service.
 * Base path: /api/workflows
 * All routes require authentication.
 */
export function createWorkflowsModule(deps: ModuleDependencies): Module {
  const service = new WorkflowsService(deps.workflowEngine);
  const controller = new WorkflowsController(service);

  const router = Router();

  // Authentication applied to all routes
  router.use(deps.authMiddleware.authenticate);

  // POST /api/workflows - Create a new workflow
  router.post('/', createWorkflowValidator, controller.create);

  // GET /api/workflows - List workflows with filters and pagination
  router.get('/', listWorkflowsValidator, controller.list);

  // GET /api/workflows/type-definitions - Get available workflow types
  // Must be registered before /:id to avoid matching 'type-definitions' as an ID
  router.get('/type-definitions', controller.getTypeDefinitions);

  // GET /api/workflows/:id - Get workflow by ID
  router.get('/:id', controller.getById);

  // POST /api/workflows/:id/transition - Transition workflow state
  router.post('/:id/transition', deps.authMiddleware.requirePermission('workflow.transition'), transitionWorkflowValidator, controller.transition);

  // GET /api/workflows/:id/history - Get transition history
  router.get('/:id/history', controller.getHistory);

  // GET /api/workflows/:id/comments - Get workflow comments
  router.get('/:id/comments', controller.getComments);

  // POST /api/workflows/:id/comments - Add a comment
  router.post('/:id/comments', addCommentValidator, controller.addComment);

  return {
    name: 'workflows',
    basePath: '/api/workflows',
    router,
  };
}
