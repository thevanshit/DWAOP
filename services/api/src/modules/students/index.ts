import { Router } from 'express';
import { Module, ModuleDependencies } from '@/modules';
import { StudentsRepository } from './students.repository';
import { StudentsService } from './students.service';
import { createStudentController } from './students.controller';
import {
  listStudentsValidator,
  atRiskStudentsValidator,
  getStudentValidator,
  getStudentAttendanceValidator,
  getStudentAssignmentsValidator,
  getStudentMarksValidator,
  getStudentEligibilityValidator,
  updateStudentValidator,
} from './students.validator';

/**
 * Create the Students module with full CRUD and academic tracking routes.
 *
 * basePath: /api/students
 * All routes require authentication.
 */
export function createStudentsModule(deps: ModuleDependencies): Module {
  const { authMiddleware } = deps;

  // Dependency injection wiring
  const repository = new StudentsRepository();
  const service = new StudentsService(repository);
  const controller = createStudentController(service);

  const router = Router();

  // Apply authentication to all student routes
  router.use(authMiddleware.authenticate);

  // GET /api/students - List with filters
  router.get('/', listStudentsValidator, controller.listStudents);

  // GET /api/students/at-risk - At-risk students
  router.get('/at-risk', atRiskStudentsValidator, controller.getAtRiskStudents);

  // GET /api/students/:id - Student details
  router.get('/:id', getStudentValidator, controller.getStudentById);

  // GET /api/students/:id/attendance - Attendance history
  router.get('/:id/attendance', getStudentAttendanceValidator, controller.getStudentAttendance);

  // GET /api/students/:id/assignments - Assignments
  router.get('/:id/assignments', getStudentAssignmentsValidator, controller.getStudentAssignments);

  // GET /api/students/:id/marks - Marks
  router.get('/:id/marks', getStudentMarksValidator, controller.getStudentMarks);

  // GET /api/students/:id/eligibility - Exam eligibility
  router.get('/:id/eligibility', getStudentEligibilityValidator, controller.getStudentEligibility);

  // PUT /api/students/:id - Update profile
  router.put('/:id', updateStudentValidator, controller.updateStudent);

  return {
    name: 'students',
    basePath: '/api/students',
    router,
  };
}
