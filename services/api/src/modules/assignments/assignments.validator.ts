import { query, param, body } from 'express-validator';

/**
 * Validation for GET /api/assignments
 */
export const validateList = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('batchId').optional().isUUID().withMessage('batchId must be a valid UUID'),
  query('subjectId').optional().isUUID().withMessage('subjectId must be a valid UUID'),
  query('teacherId').optional().isUUID().withMessage('teacherId must be a valid UUID'),
];

/**
 * Validation for POST /api/assignments
 */
export const validateCreate = [
  body('subjectId').isUUID().withMessage('subjectId is required and must be a UUID'),
  body('batchId').isUUID().withMessage('batchId is required and must be a UUID'),
  body('title').isLength({ min: 3, max: 500 }).withMessage('Title must be 3-500 characters').trim(),
  body('maxMarks').isInt({ min: 1 }).withMessage('maxMarks must be a positive integer'),
  body('submissionDeadline').isISO8601().withMessage('submissionDeadline must be a valid ISO 8601 date'),
  body('description').optional().isString().trim().withMessage('description must be a string'),
  body('instructions').optional().isString().trim().withMessage('instructions must be a string'),
  body('lateSubmissionAllowed').optional().isBoolean().withMessage('lateSubmissionAllowed must be a boolean'),
  body('latePenaltyPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('latePenaltyPercentage must be between 0 and 100'),
];

/**
 * Validation for GET /api/assignments/:id
 */
export const validateGetById = [
  param('id').isUUID().withMessage('Assignment ID must be a valid UUID'),
];

/**
 * Validation for GET /api/assignments/:id/submissions
 */
export const validateGetSubmissions = [
  param('id').isUUID().withMessage('Assignment ID must be a valid UUID'),
];

/**
 * Validation for POST /api/assignments/:id/submit
 */
export const validateSubmit = [
  param('id').isUUID().withMessage('Assignment ID must be a valid UUID'),
];

/**
 * Validation for PUT /api/assignments/:submissionId/evaluate
 */
export const validateEvaluate = [
  param('submissionId').isUUID().withMessage('Submission ID must be a valid UUID'),
  body('marks').isInt({ min: 0 }).withMessage('marks must be a non-negative integer'),
  body('feedback').optional().isString().trim().withMessage('feedback must be a string'),
];
