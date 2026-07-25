import { query, param, body } from 'express-validator';

/**
 * Validation chain for GET /api/students
 */
export const listStudentsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('batchId').optional().isUUID(),
  query('departmentId').optional().isUUID(),
  query('search').optional().isString().trim(),
  query('status').optional().isIn(['active', 'inactive']),
];

/**
 * Validation chain for GET /api/students/at-risk
 */
export const atRiskStudentsValidator = [
  query('departmentId').optional().isUUID(),
];

/**
 * Validation chain for GET /api/students/:id
 */
export const getStudentValidator = [
  param('id').isUUID().withMessage('Valid student ID is required'),
];

/**
 * Validation chain for GET /api/students/:id/attendance
 */
export const getStudentAttendanceValidator = [
  param('id').isUUID(),
  query('batchId').optional().isUUID(),
  query('subjectId').optional().isUUID(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];

/**
 * Validation chain for GET /api/students/:id/assignments
 */
export const getStudentAssignmentsValidator = [
  param('id').isUUID(),
];

/**
 * Validation chain for GET /api/students/:id/marks
 */
export const getStudentMarksValidator = [
  param('id').isUUID(),
  query('subjectId').optional().isUUID(),
  query('batchId').optional().isUUID(),
];

/**
 * Validation chain for GET /api/students/:id/eligibility
 */
export const getStudentEligibilityValidator = [
  param('id').isUUID(),
];

/**
 * Validation chain for PUT /api/students/:id
 */
export const updateStudentValidator = [
  param('id').isUUID(),
  body('firstName').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('lastName').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('phone').optional().isString().trim(),
  body('avatarUrl').optional().isString().trim().isURL(),
];
