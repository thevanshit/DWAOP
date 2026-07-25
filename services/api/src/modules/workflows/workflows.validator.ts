import { body, param, query } from 'express-validator';

/**
 * Validation rules for creating a workflow
 */
export const createWorkflowValidator = [
  body('type')
    .isIn(['attendance_session', 'assignment', 'internal_marks', 'leave_request', 'student_track_report'])
    .withMessage('Workflow type must be a valid type'),
  body('title')
    .isLength({ min: 3, max: 500 })
    .trim()
    .withMessage('Title must be between 3 and 500 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('assigneeId')
    .optional()
    .isUUID()
    .withMessage('Assignee ID must be a valid UUID'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be one of: low, medium, high, critical'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
];

/**
 * Validation rules for listing workflows
 */
export const listWorkflowsValidator = [
  query('type')
    .optional()
    .isIn(['attendance_session', 'assignment', 'internal_marks', 'leave_request', 'student_track_report'])
    .withMessage('Invalid workflow type'),
  query('assigneeId')
    .optional()
    .isUUID()
    .withMessage('Assignee ID must be a valid UUID'),
  query('status')
    .optional()
    .isString()
    .withMessage('Status must be a string'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  query('departmentId')
    .optional()
    .isUUID()
    .withMessage('Department ID must be a valid UUID'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

/**
 * Validation rules for transitioning a workflow
 */
export const transitionWorkflowValidator = [
  param('id')
    .isUUID()
    .withMessage('Workflow ID must be a valid UUID'),
  body('toState')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Target state is required'),
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason must not exceed 500 characters'),
];

/**
 * Validation rules for adding a comment
 */
export const addCommentValidator = [
  param('id')
    .isUUID()
    .withMessage('Workflow ID must be a valid UUID'),
  body('comment')
    .isLength({ min: 1, max: 2000 })
    .trim()
    .withMessage('Comment must be between 1 and 2000 characters'),
  body('isInternal')
    .optional()
    .isBoolean()
    .withMessage('isInternal must be a boolean'),
];
