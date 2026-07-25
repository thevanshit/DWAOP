import { body, param, query } from 'express-validator';

/**
 * Validation rules for listing leave requests
 */
export const listLeavesValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('studentId')
    .optional()
    .isUUID()
    .withMessage('Student ID must be a valid UUID'),
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Status must be one of: pending, approved, rejected'),
  query('leaveType')
    .optional()
    .isIn(['medical', 'academic', 'personal', 'emergency', 'official'])
    .withMessage('Leave type must be one of: medical, academic, personal, emergency, official'),
];

/**
 * Validation rules for creating a leave request
 */
export const createLeaveValidator = [
  body('leaveType')
    .isIn(['medical', 'academic', 'personal', 'emergency', 'official'])
    .withMessage('Leave type is required and must be a valid type'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  body('totalDays')
    .isInt({ min: 1 })
    .withMessage('Total days must be a positive integer'),
  body('reason')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Reason must be between 10 and 2000 characters'),
  body('supportingDocuments')
    .optional()
    .isArray()
    .withMessage('Supporting documents must be an array'),
  body('isEmergency')
    .optional()
    .isBoolean()
    .withMessage('isEmergency must be a boolean'),
];

/**
 * Validation rules for getting a leave request by ID
 */
export const getLeaveByIdValidator = [
  param('id')
    .isUUID()
    .withMessage('Leave ID must be a valid UUID'),
];

/**
 * Validation rules for approving a leave request
 */
export const approveLeaveValidator = [
  param('id')
    .isUUID()
    .withMessage('Leave ID must be a valid UUID'),
];

/**
 * Validation rules for rejecting a leave request
 */
export const rejectLeaveValidator = [
  param('id')
    .isUUID()
    .withMessage('Leave ID must be a valid UUID'),
  body('reason')
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters'),
];

/**
 * Validation rules for listing pending leaves
 */
export const pendingLeavesValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
