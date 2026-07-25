import { param } from 'express-validator';

/**
 * Validation chain for GET /api/departments/:id
 */
export const getDepartmentValidator = [
  param('id').isUUID().withMessage('Valid department ID is required'),
];
