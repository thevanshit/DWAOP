import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '@/core/auth/service';
import { logger } from '@/utils/logger';

export const createAuthRoutes = (authService: AuthService): Router => {
  const router = Router();

  /**
   * POST /api/auth/login
   * Login user with email and password
   */
  router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Authenticate user
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
            expiresIn: result.expiresIn
          }
        }
      });

      logger.info(`User logged in: ${result.user.email}`);
    } catch (error) {
      logger.error('Login failed', error);
      next(error);
    }
  });

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token
   */
  router.post('/refresh', [
    body('refreshToken').notEmpty(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { refreshToken } = req.body;

      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: {
          tokens
        }
      });
    } catch (error) {
      logger.error('Token refresh failed', error);
      next(error);
    }
  });

  /**
   * POST /api/auth/logout
   * Logout user (invalidate refresh token)
   */
  router.post('/logout', [
    body('refreshToken').notEmpty(),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { refreshToken } = req.body;
      const userId = req.user?.id; // Will be available if auth middleware is used

      if (userId) {
        await authService.logout(userId, refreshToken);
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Logout failed', error);
      next(error);
    }
  });

  /**
   * POST /api/auth/register
   * Create new user account (admin only)
   */
  router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').isLength({ min: 2, max: 50 }).trim(),
    body('lastName').isLength({ min: 2, max: 50 }).trim(),
    body('role').isIn(['student', 'teacher', 'admin']),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password, firstName, lastName, role, departmentId, attributes } = req.body;

      const user = await authService.createUser({
        email,
        password,
        firstName,
        lastName,
        role,
        departmentId,
        attributes
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
          }
        }
      });

      logger.info(`User created: ${user.email}`);
    } catch (error) {
      logger.error('User registration failed', error);
      next(error);
    }
  });

  /**
   * POST /api/auth/change-password
   * Change user password
   */
  router.post('/change-password', [
    body('currentPassword').isLength({ min: 6 }),
    body('newPassword').isLength({ min: 6 }),
  ], async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required'
        });
      }

      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(req.user.id, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

      logger.info(`Password changed for user: ${req.user.id}`);
    } catch (error) {
      logger.error('Password change failed', error);
      next(error);
    }
  });

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required'
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            permissions: req.user.permissions,
            attributes: req.user.attributes
          }
        }
      });
    } catch (error) {
      logger.error('Get user profile failed', error);
      next(error);
    }
  });

  return router;
};