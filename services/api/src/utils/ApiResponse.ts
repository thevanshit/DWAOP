import { Response } from 'express';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Standardized API response helper for consistent response formatting
 * across all endpoints.
 */
export class ApiResponse {
  /**
   * Send a success response
   */
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode = 200
  ): void {
    const response: Record<string, unknown> = {
      success: true,
    };
    if (data !== undefined) response.data = data;
    if (message) response.message = message;
    res.status(statusCode).json(response);
  }

  /**
   * Send a success response with pagination
   */
  static successWithPagination<T>(
    res: Response,
    data: T,
    pagination: PaginationInfo,
    message?: string
  ): void {
    const response: Record<string, unknown> = {
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
      },
    };
    if (message) response.message = message;
    res.status(200).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created<T>(res: Response, data?: T, message = 'Created successfully'): void {
    ApiResponse.success(res, data, message, 201);
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    message: string,
    statusCode = 400,
    details?: unknown
  ): void {
    const response: Record<string, unknown> = {
      success: false,
      error: message,
    };
    if (details !== undefined) response.details = details;
    res.status(statusCode).json(response);
  }

  /**
   * Send a validation error response
   */
  static validationError(
    res: Response,
    errors: unknown[],
    message = 'Validation failed'
  ): void {
    res.status(422).json({
      success: false,
      error: message,
      details: errors,
    });
  }
}

export default ApiResponse;
