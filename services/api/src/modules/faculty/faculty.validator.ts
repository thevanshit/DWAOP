import { query, param } from 'express-validator';

/**
 * Validation chain for GET /api/faculty
 */
export const listFacultyValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('departmentId').optional().isUUID(),
  query('search').optional().isString().trim(),
  query('role').optional().isString().trim(),
];

/**
 * Validation chain for GET /api/faculty/:id
 */
export const getFacultyValidator = [
  param('id').isUUID().withMessage('Valid faculty ID is required'),
];

/**
 * Validation chain for GET /api/faculty/:id/workload
 */
export const getFacultyWorkloadValidator = [
  param('id').isUUID(),
];

/**
 * Validation chain for GET /api/faculty/:id/batches
 */
export const getFacultyBatchesValidator = [
  param('id').isUUID(),
];

/**
 * Validation chain for GET /api/faculty/:id/subjects
 */
export const getFacultySubjectsValidator = [
  param('id').isUUID(),
];
