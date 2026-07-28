/**
 * Custom application error with HTTP status code support.
 * Used across all controllers for consistent error handling.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(401, message);
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError(403, message);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(404, message);
  }

  static conflict(message: string): AppError {
    return new AppError(409, message);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(500, message);
  }
}

export default AppError;
