import { body, param, query } from 'express-validator';

/**
 * Validation rules for listing users (query parameters)
 */
export const listUsersValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('role')
    .optional()
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Role must be one of: student, teacher, admin'),
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query must not be empty'),
  query('departmentId')
    .optional()
    .isUUID()
    .withMessage('Department ID must be a valid UUID'),
];

/**
 * Validation rules for updating a user profile
 */
export const updateUserValidator = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters')
    .trim(),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Role must be one of: student, teacher, admin'),
  body('departmentId')
    .optional({ values: 'null' })
    .isUUID()
    .withMessage('Department ID must be a valid UUID'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

/**
 * Validation for user ID parameter
 */
export const userIdParamValidator = [
  param('id')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
];
