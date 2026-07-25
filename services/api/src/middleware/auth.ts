import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/core/auth/service';
import { logger } from '@/utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        permissions: string[];
        departmentId?: string;
      };
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Authenticate JWT token middleware
   */
  public authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      try {
        const payload = this.authService.verifyToken(token);

        // Attach user to request
        req.user = {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions,
          departmentId: payload.departmentId
        };

        next();
      } catch (tokenError) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }
    } catch (error) {
      logger.error('Authentication middleware error', error);
      res.status(500).json({ error: 'Authentication error' });
    }
  };

  /**
   * Authorization middleware - check if user has required permission
   */
  public requirePermission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Authentication required' });
          return;
        }

        if (!req.user.permissions.includes(permission)) {
          res.status(403).json({ error: 'Insufficient permissions' });
          return;
        }

        next();
      } catch (error) {
        logger.error('Authorization middleware error', error);
        res.status(500).json({ error: 'Authorization error' });
      }
    };
  };

  /**
   * Role-based authorization middleware
   */
  public requireRole = (roles: string | string[]) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Authentication required' });
          return;
        }

        if (!allowedRoles.includes(req.user.role)) {
          res.status(403).json({ error: 'Insufficient role permissions' });
          return;
        }

        next();
      } catch (error) {
        logger.error('Role authorization middleware error', error);
        res.status(500).json({ error: 'Authorization error' });
      }
    };
  };

  /**
   * Optional authentication - doesn't fail if no token
   */
  public optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);

        try {
          const payload = this.authService.verifyToken(token);

          req.user = {
            id: payload.userId,
            email: payload.email,
            role: payload.role,
            permissions: payload.permissions
          };
        } catch (tokenError) {
          // Token is invalid, but we don't fail the request
          logger.warn('Invalid token in optional auth', tokenError);
        }
      }

      next();
    } catch (error) {
      logger.error('Optional authentication middleware error', error);
      next(); // Don't fail the request
    }
  };
}

// Factory function to create middleware with auth service
export const createAuthMiddleware = (authService: AuthService): AuthMiddleware => {
  return new AuthMiddleware(authService);
};