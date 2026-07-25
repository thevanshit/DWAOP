import { Router } from 'express';
import { ModuleDependencies, Module } from '@/modules';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceService } from './attendance.service';
import * as validators from './attendance.validator';
import * as controller from './attendance.controller';

/**
 * Create and register the attendance module.
 * basePath: /api/attendance — all routes require authentication.
 */
export function createAttendanceModule(deps: ModuleDependencies): Module {
  const repository = new AttendanceRepository();
  const attendanceService = new AttendanceService(repository);
  const router = Router();
  const { authMiddleware } = deps;

  // All attendance routes require authentication
  router.use(authMiddleware.authenticate);

  // GET /api/attendance/sessions — List sessions with filters
  router.get('/sessions', validators.validateGetSessions, controller.getSessions(attendanceService));

  // POST /api/attendance/sessions — Create a session
  router.post('/sessions', validators.validateCreateSession, controller.createSession(attendanceService));

  // GET /api/attendance/sessions/:id — Get session details with records
  router.get('/sessions/:id', validators.validateGetSessionById, controller.getSessionById(attendanceService));

  // POST /api/attendance/records — Mark attendance for a session
  router.post('/records', validators.validateMarkAttendance, controller.markAttendance(attendanceService));

  // GET /api/attendance/batch/:batchId — Batch attendance summary
  router.get('/batch/:batchId', validators.validateGetBatchAttendance, controller.getBatchAttendance(attendanceService));

  return {
    name: 'attendance',
    basePath: '/api/attendance',
    router,
  };
}
