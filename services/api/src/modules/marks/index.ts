import { Router } from 'express';
import { ModuleDependencies, Module } from '@/modules';
import { MarksRepository } from './marks.repository';
import { MarksService } from './marks.service';
import * as validators from './marks.validator';
import * as controller from './marks.controller';

/**
 * Create and register the marks module.
 * basePath: /api/marks — all routes require authentication.
 */
export function createMarksModule(deps: ModuleDependencies): Module {
  const repository = new MarksRepository();
  const marksService = new MarksService(repository);
  const router = Router();
  const { authMiddleware } = deps;

  // All marks routes require authentication
  router.use(authMiddleware.authenticate);

  // GET /api/marks — List marks with filters
  router.get('/', validators.validateList, controller.list(marksService));

  // GET /api/marks/subject/:subjectId — Get marks by subject
  router.get('/subject/:subjectId', validators.validateGetSubjectMarks, controller.getSubjectMarks(marksService));

  // POST /api/marks/entry — Enter marks
  router.post('/entry', validators.validateEnterMarks, controller.enterMarks(marksService));

  // PUT /api/marks/:id/submit — Submit marks for review
  router.put('/:id/submit', validators.validateSubmitMarks, controller.submitMarks(marksService));

  // PUT /api/marks/:id/finalise — Finalise marks
  router.put('/:id/finalise', validators.validateFinaliseMarks, controller.finaliseMarks(marksService));

  // PUT /api/marks/:id/lock — Lock marks (immutable)
  router.put('/:id/lock', validators.validateLockMarks, controller.lockMarks(marksService));

  return {
    name: 'marks',
    basePath: '/api/marks',
    router,
  };
}
