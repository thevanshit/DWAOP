import { Router } from 'express';
import { ModuleDependencies, Module } from '@/modules';
import { AssignmentsRepository } from './assignments.repository';
import { AssignmentsService } from './assignments.service';
import * as validators from './assignments.validator';
import * as controller from './assignments.controller';

/**
 * Create and register the assignments module.
 * basePath: /api/assignments — all routes require authentication.
 */
export function createAssignmentsModule(deps: ModuleDependencies): Module {
  const repository = new AssignmentsRepository();
  const assignmentsService = new AssignmentsService(repository);
  const router = Router();
  const { authMiddleware } = deps;

  // All assignment routes require authentication
  router.use(authMiddleware.authenticate);

  // GET /api/assignments — List assignments
  router.get('/', validators.validateList, controller.list(assignmentsService));

  // POST /api/assignments — Create assignment (teacher/faculty)
  router.post(
    '/',
    authMiddleware.requirePermission('assignment.publish'),
    validators.validateCreate,
    controller.create(assignmentsService)
  );

  // GET /api/assignments/:id — Get assignment details
  router.get('/:id', validators.validateGetById, controller.getById(assignmentsService));

  // GET /api/assignments/:id/submissions — Get submissions for an assignment (teacher)
  router.get(
    '/:id/submissions',
    authMiddleware.requirePermission('assignment.evaluate'),
    validators.validateGetSubmissions,
    controller.getSubmissions(assignmentsService)
  );

  // POST /api/assignments/:id/submit — Submit an assignment (student)
  router.post(
    '/:id/submit',
    authMiddleware.requirePermission('assignment.submit'),
    validators.validateSubmit,
    controller.submit(assignmentsService)
  );

  // PUT /api/assignments/:submissionId/evaluate — Evaluate a submission (teacher)
  router.put(
    '/:submissionId/evaluate',
    authMiddleware.requirePermission('assignment.evaluate'),
    validators.validateEvaluate,
    controller.evaluate(assignmentsService)
  );

  return {
    name: 'assignments',
    basePath: '/api/assignments',
    router,
  };
}
