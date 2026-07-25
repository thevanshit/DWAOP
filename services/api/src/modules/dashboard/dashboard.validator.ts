import { query } from 'express-validator';

/**
 * Validation rules for dashboard workflows endpoint
 */
export const dashboardWorkflowsValidator = [
  query('type')
    .optional()
    .isString()
    .withMessage('Type must be a string'),
  query('status')
    .optional()
    .isString()
    .withMessage('Status must be a string'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
];
