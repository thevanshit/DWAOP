import { query, param, body } from 'express-validator';

/**
 * Validation for GET /api/marks
 */
export const validateList = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('batchId').optional().isUUID().withMessage('batchId must be a valid UUID'),
  query('subjectId').optional().isUUID().withMessage('subjectId must be a valid UUID'),
  query('studentId').optional().isUUID().withMessage('studentId must be a valid UUID'),
  query('teacherId').optional().isUUID().withMessage('teacherId must be a valid UUID'),
  query('status')
    .optional()
    .isIn(['draft', 'submitted', 'under_review', 'finalised', 'locked'])
    .withMessage('Status must be one of: draft, submitted, under_review, finalised, locked'),
];

/**
 * Validation for GET /api/marks/subject/:subjectId
 */
export const validateGetSubjectMarks = [
  param('subjectId').isUUID().withMessage('Subject ID must be a valid UUID'),
  query('batchId').optional().isUUID().withMessage('batchId must be a valid UUID'),
];

/**
 * Validation for POST /api/marks/entry
 */
export const validateEnterMarks = [
  body('studentId').isUUID().withMessage('studentId is required and must be a UUID'),
  body('subjectId').isUUID().withMessage('subjectId is required and must be a UUID'),
  body('batchId').isUUID().withMessage('batchId is required and must be a UUID'),
  body('assignmentMarks').optional().isInt({ min: 0 }).withMessage('assignmentMarks must be a non-negative integer'),
  body('testMarks').optional().isInt({ min: 0 }).withMessage('testMarks must be a non-negative integer'),
  body('attendanceMarks').optional().isInt({ min: 0 }).withMessage('attendanceMarks must be a non-negative integer'),
];

/**
 * Validation for PUT /api/marks/:id/submit
 */
export const validateSubmitMarks = [
  param('id').isUUID().withMessage('Marks entry ID must be a valid UUID'),
];

/**
 * Validation for PUT /api/marks/:id/finalise
 */
export const validateFinaliseMarks = [
  param('id').isUUID().withMessage('Marks entry ID must be a valid UUID'),
];

/**
 * Validation for PUT /api/marks/:id/lock
 */
export const validateLockMarks = [
  param('id').isUUID().withMessage('Marks entry ID must be a valid UUID'),
];
