import { query, param, body } from 'express-validator';

/**
 * Validation for GET /api/attendance/sessions
 */
export const validateGetSessions = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('batchId').optional().isUUID().withMessage('batchId must be a valid UUID'),
  query('subjectId').optional().isUUID().withMessage('subjectId must be a valid UUID'),
  query('teacherId').optional().isUUID().withMessage('teacherId must be a valid UUID'),
  query('date').optional().isISO8601().withMessage('date must be a valid ISO 8601 date'),
];

/**
 * Validation for POST /api/attendance/sessions
 */
export const validateCreateSession = [
  body('subjectId').isUUID().withMessage('subjectId is required and must be a UUID'),
  body('batchId').isUUID().withMessage('batchId is required and must be a UUID'),
  body('teacherId').isUUID().withMessage('teacherId is required and must be a UUID'),
  body('scheduledDate').isISO8601().withMessage('scheduledDate must be a valid ISO 8601 date'),
  body('startTime').optional().isISO8601().withMessage('startTime must be a valid ISO 8601 date'),
  body('endTime').optional().isISO8601().withMessage('endTime must be a valid ISO 8601 date'),
  body('gracePeriodMinutes').optional().isInt({ min: 0, max: 60 }).withMessage('gracePeriodMinutes must be between 0 and 60'),
  body('location').optional().isString().trim().withMessage('location must be a string'),
];

/**
 * Validation for GET /api/attendance/sessions/:id
 */
export const validateGetSessionById = [
  param('id').isUUID().withMessage('Session ID must be a valid UUID'),
];

/**
 * Validation for POST /api/attendance/records
 */
export const validateMarkAttendance = [
  body('sessionId').isUUID().withMessage('sessionId is required and must be a UUID'),
  body('records').isArray({ min: 1 }).withMessage('records must be a non-empty array'),
  body('records.*.studentId').isUUID().withMessage('Each record studentId must be a UUID'),
  body('records.*.status')
    .isIn(['present', 'absent', 'late', 'excused'])
    .withMessage('Status must be one of: present, absent, late, excused'),
];

/**
 * Validation for GET /api/attendance/batch/:batchId
 */
export const validateGetBatchAttendance = [
  param('batchId').isUUID().withMessage('Batch ID must be a valid UUID'),
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO 8601 date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO 8601 date'),
];
