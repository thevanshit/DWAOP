import { Router } from 'express';
import { Module, ModuleDependencies } from '@/modules';
import { FacultyRepository } from './faculty.repository';
import { FacultyService } from './faculty.service';
import { createFacultyController } from './faculty.controller';
import {
  listFacultyValidator,
  getFacultyValidator,
  getFacultyWorkloadValidator,
  getFacultyBatchesValidator,
  getFacultySubjectsValidator,
} from './faculty.validator';

/**
 * Create the Faculty module with listing, details, and workload routes.
 *
 * basePath: /api/faculty
 * All routes require authentication.
 */
export function createFacultyModule(deps: ModuleDependencies): Module {
  const { authMiddleware } = deps;

  // Dependency injection wiring
  const repository = new FacultyRepository();
  const service = new FacultyService(repository);
  const controller = createFacultyController(service);

  const router = Router();

  // Apply authentication to all faculty routes
  router.use(authMiddleware.authenticate);

  // GET /api/faculty - List with filters
  router.get('/', listFacultyValidator, controller.listFaculty);

  // GET /api/faculty/:id - Faculty details
  router.get('/:id', getFacultyValidator, controller.getFacultyById);

  // GET /api/faculty/:id/workload - Workload summary
  router.get('/:id/workload', getFacultyWorkloadValidator, controller.getFacultyWorkload);

  // GET /api/faculty/:id/batches - Assigned batches
  router.get('/:id/batches', getFacultyBatchesValidator, controller.getFacultyBatches);

  // GET /api/faculty/:id/subjects - Assigned subjects
  router.get('/:id/subjects', getFacultySubjectsValidator, controller.getFacultySubjects);

  return {
    name: 'faculty',
    basePath: '/api/faculty',
    router,
  };
}
