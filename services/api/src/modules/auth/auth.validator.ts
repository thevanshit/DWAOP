import { body, param, query } from 'express-validator';

/**
 * Validation rules for user login.
 */
export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Enhanced validation rules for user registration (admin only).
 * Includes password strength validation.
 */
export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters')
    .trim(),
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters')
    .trim(),
  body('role')
    .isIn(['student', 'teacher', 'admin', 'hod', 'guest_faculty'])
    .withMessage('Role must be one of: student, teacher, admin, hod, guest_faculty'),
];

/**
 * Validation rules for token refresh.
 */
export const refreshValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

/**
 * Enhanced validation rules for password change.
 * Enforces stronger password requirements.
 */
export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('New password must contain at least one special character'),
];

/**
 * Validation rules for email verification.
 */
export const verifyEmailValidator = [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required'),
];

/**
 * Validation rules for resending verification email.
 */
export const resendVerificationValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
];

/**
 * Validation rules for session revocation.
 */
export const revokeSessionValidator = [
  param('sessionId')
    .isUUID()
    .withMessage('Valid session ID is required'),
];

/**
 * Validation rules for password validation endpoint.
 */
export const validatePasswordValidator = [
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
];

/**
 * Validation rules for admin account lockout operations.
 */
export const adminLockAccountValidator = [
  param('userId')
    .isUUID()
    .withMessage('Valid user ID is required'),
  body('durationMinutes')
    .optional()
    .isInt({ min: 1, max: 43200 })
    .withMessage('Duration must be between 1 minute and 30 days'),
];
