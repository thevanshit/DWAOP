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

/**
 * Role hierarchy definition.
 * Higher index = higher privilege.
 * Used for role-based authorization with hierarchy awareness.
 */
export const ROLE_HIERARCHY: Record<string, number> = {
  student: 0,
  guest_faculty: 1,
  teacher: 2,
  hod: 3,
  dept_admin: 4,
  registrar: 5,
  admin: 6,
  auditor: 7,
};

export class AuthMiddleware {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Authenticate JWT token middleware.
   * Verifies the access token and attaches user info to the request.
   */
  public authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.substring(7);

      try {
        const payload = this.authService.verifyToken(token);

        // Attach user to request
        req.user = {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions,
          departmentId: payload.departmentId,
        };

        next();
      } catch (tokenError) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
      }
    } catch (error) {
      logger.error('Authentication middleware error', error);
      res.status(500).json({ error: 'Authentication error' });
    }
  };

  /**
   * Permission-based authorization middleware.
   * Checks if the authenticated user has the specified permission.
   */
  public requirePermission = (permission: string) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Authentication required' });
          return;
        }

        if (!req.user.permissions.includes(permission)) {
          logger.warn(
            `Permission denied: user ${req.user.id} attempted ${permission}`
          );
          res.status(403).json({
            error: 'Insufficient permissions',
            required: permission,
          });
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
   * Role-based authorization middleware with hierarchy support.
   * 
   * - If a string is provided, checks if user's role matches exactly.
   * - If an array is provided, checks if user's role is in the list.
   * - If `{ minRole: string }` is provided, checks if user's role level
   *   is at least as high as the specified role (hierarchy check).
   */
  public requireRole = (roles: string | string[] | { minRole: string }) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Authentication required' });
          return;
        }

        // Check if using minRole (hierarchy-based)
        if (typeof roles === 'object' && !Array.isArray(roles) && roles.minRole) {
          const userLevel = ROLE_HIERARCHY[req.user.role] ?? -1;
          const requiredLevel = ROLE_HIERARCHY[roles.minRole] ?? -1;

          if (userLevel < requiredLevel) {
            logger.warn(
              `Role hierarchy denied: user ${req.user.id} (${req.user.role}) < required (${roles.minRole})`
            );
            res.status(403).json({
              error: 'Insufficient role',
              required: `At least ${roles.minRole}`,
              current: req.user.role,
            });
            return;
          }
        } else {
          // Exact role matching
          const allowedRoles = Array.isArray(roles) ? roles : [roles];
          if (!allowedRoles.includes(req.user.role)) {
            logger.warn(
              `Role denied: user ${req.user.id} (${req.user.role}) not in [${allowedRoles.join(', ')}]`
            );
            res.status(403).json({
              error: 'Insufficient role permissions',
              required: allowedRoles,
              current: req.user.role,
            });
            return;
          }
        }

        next();
      } catch (error) {
        logger.error('Role authorization middleware error', error);
        res.status(500).json({ error: 'Authorization error' });
      }
    };
  };

  /**
   * Optional authentication — doesn't fail if no token is present,
   * but will attach user info if a valid token is provided.
   */
  public optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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
            permissions: payload.permissions,
            departmentId: payload.departmentId,
          };
        } catch (tokenError) {
          // Token is invalid, but we don't fail the request
          logger.warn('Invalid token in optional auth');
        }
      }

      next();
    } catch (error) {
      logger.error('Optional authentication middleware error', error);
      next(); // Don't fail the request
    }
  };

  /**
   * Department-scoped authorization middleware.
   * Ensures the user belongs to the same department as the resource.
   * Useful for multi-department data isolation.
   */
  public requireDepartmentAccess = (resourceDepartmentId?: string) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Authentication required' });
          return;
        }

        // Admin can access any department
        if (req.user.role === 'admin') {
          next();
          return;
        }

        const targetDeptId = resourceDepartmentId || req.params.departmentId;

        if (!targetDeptId) {
          next();
          return;
        }

        if (req.user.departmentId !== targetDeptId) {
          logger.warn(
            `Department access denied: user ${req.user.id} attempted cross-department access`
          );
          res.status(403).json({
            error: 'Access denied: cross-department access not permitted',
          });
          return;
        }

        next();
      } catch (error) {
        logger.error('Department authorization middleware error', error);
        res.status(500).json({ error: 'Authorization error' });
      }
    };
  };

  /**
   * Ownership verification middleware.
   * Ensures the user owns the resource being accessed.
   * The resourceOwnerId can be a function or a parameter name.
   */
  public requireOwnership = (
    ownerIdSource: string | ((req: Request) => string | undefined)
  ) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Authentication required' });
          return;
        }

        // Admin can access any resource
        if (req.user.role === 'admin') {
          next();
          return;
        }

        let resourceOwnerId: string | undefined;

        if (typeof ownerIdSource === 'function') {
          resourceOwnerId = ownerIdSource(req);
        } else {
          resourceOwnerId = req.params[ownerIdSource] || req.body[ownerIdSource];
        }

        if (!resourceOwnerId) {
          next();
          return;
        }

        if (req.user.id !== resourceOwnerId) {
          logger.warn(
            `Ownership denied: user ${req.user.id} attempted to access resource owned by ${resourceOwnerId}`
          );
          res.status(403).json({
            error: 'Access denied: you do not own this resource',
          });
          return;
        }

        next();
      } catch (error) {
        logger.error('Ownership middleware error', error);
        res.status(500).json({ error: 'Authorization error' });
      }
    };
  };
}

/**
 * Factory function to create middleware with auth service injection.
 */
export const createAuthMiddleware = (
  authService: AuthService
): AuthMiddleware => {
  return new AuthMiddleware(authService);
};

export default AuthMiddleware;
