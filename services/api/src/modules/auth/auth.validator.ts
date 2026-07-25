import { body } from 'express-validator';

/**
 * Validation rules for user login
 */
export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

/**
 * Validation rules for user registration (admin only)
 */
export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters')
    .trim(),
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters')
    .trim(),
  body('role')
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Role must be one of: student, teacher, admin'),
];

/**
 * Validation rules for token refresh
 */
export const refreshValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

/**
 * Validation rules for password change
 */
export const changePasswordValidator = [
  body('currentPassword')
    .isLength({ min: 6 })
    .withMessage('Current password must be at least 6 characters'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];
