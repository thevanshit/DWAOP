import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthModuleService } from './auth.service';

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export const login = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
        return;
      }

      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.user.role,
            departmentId: result.user.departmentId,
          },
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/register
 * Create new user account (admin only)
 */
export const register = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
        return;
      }

      const { email, password, firstName, lastName, role, departmentId } = req.body;

      const user = await authService.createUser({
        email,
        password,
        firstName,
        lastName,
        role,
        departmentId,
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            departmentId: user.departmentId,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export const refreshToken = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
        return;
      }

      const { refreshToken: token } = req.body;

      const tokens = await authService.refresh(token);

      res.json({
        success: true,
        data: {
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/logout
 * Logout user (invalidate refresh token)
 */
export const logout = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
        return;
      }

      const { refreshToken: token } = req.body;
      const userId = req.user?.id;

      if (userId && token) {
        await authService.logout(userId, token);
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/change-password
 * Change current user's password
 */
export const changePassword = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(req.user.id, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * GET /api/auth/me
 * Get current authenticated user's profile
 */
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          permissions: req.user.permissions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
