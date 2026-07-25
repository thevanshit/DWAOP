import { Router } from 'express';
import { Module, ModuleDependencies } from '@/modules';
import { DepartmentsRepository } from './departments.repository';
import { DepartmentsService } from './departments.service';
import { createDepartmentController } from './departments.controller';
import {
  getDepartmentValidator,
} from './departments.validator';

/**
 * Create the Departments module with listing and detail routes.
 *
 * basePath: /api/departments
 * All routes require authentication.
 */
export function createDepartmentsModule(deps: ModuleDependencies): Module {
  const { authMiddleware } = deps;

  // Dependency injection wiring
  const repository = new DepartmentsRepository();
  const service = new DepartmentsService(repository);
  const controller = createDepartmentController(service);

  const router = Router();

  // Apply authentication to all department routes
  router.use(authMiddleware.authenticate);

  // GET /api/departments - List all departments
  router.get('/', controller.listDepartments);

  // GET /api/departments/:id - Department details
  router.get('/:id', getDepartmentValidator, controller.getDepartmentById);

  return {
    name: 'departments',
    basePath: '/api/departments',
    router,
  };
}
