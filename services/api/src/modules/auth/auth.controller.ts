import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthModuleService } from './auth.service';

/**
 * POST /api/auth/login
 * Authenticate user with email and password.
 * Includes account lockout checking and audit logging.
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
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await authService.login(
        { email, password },
        ipAddress,
        userAgent
      );

      res.json({
        success: true,
        data: {
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
          },
        },
        ...(result.warning ? { warning: result.warning } : {}),
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/register
 * Create new user account (admin only).
 * Includes password policy validation.
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
            emailVerified: user.emailVerified,
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
 * Refresh access token using a valid refresh token.
 * Implements token rotation.
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
      const ipAddress = req.ip || req.socket.remoteAddress;

      const tokens = await authService.refresh(token, ipAddress);

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/logout
 * Logout user by invalidating refresh token.
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
      const ipAddress = req.ip || req.socket.remoteAddress;

      if (userId && token) {
        await authService.logout(userId, token, ipAddress);
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
 * Change current user's password with policy validation and history check.
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

      const result = await authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * GET /api/auth/me
 * Get current authenticated user's profile.
 */
export const getMe = (authService: AuthModuleService) => {
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

      // Fetch fresh user data including email_verified status
      const userData = await authService.getMe(req.user.id);

      res.json({
        success: true,
        data: {
          user: userData || {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            permissions: req.user.permissions,
            departmentId: req.user.departmentId,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/verify-email
 * Verify email address using verification token.
 */
export const verifyEmail = (authService: AuthModuleService) => {
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

      const { token } = req.body;
      const result = await authService.verifyEmail(token);

      if (result.verified) {
        res.json({
          success: true,
          message: 'Email verified successfully',
        });
      } else {
        res.status(400).json({
          error: 'Invalid or expired verification token',
        });
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/send-verification
 * Send email verification to the current user.
 */
export const sendVerification = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const result = await authService.generateEmailVerification(req.user.id);

      res.json({
        success: true,
        message: 'Verification email sent',
        data: {
          expiresAt: result.expiresAt,
          // In production, the link would be sent via email, not returned
          ...(process.env.NODE_ENV === 'development' ? { link: result.link } : {}),
        },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * GET /api/auth/sessions
 * Get all active sessions for the current user.
 */
export const getSessions = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const authHeader = req.headers.authorization;
      const currentToken = authHeader?.startsWith('Bearer ')
        ? authHeader.substring(7)
        : undefined;

      const sessions = await authService.getUserSessions(req.user.id, currentToken);

      res.json({
        success: true,
        data: { sessions },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * DELETE /api/auth/sessions/:sessionId
 * Revoke a specific session.
 */
export const revokeSession = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const sessionId = req.params.sessionId!;
      const revoked = await authService.revokeSession(req.user.id, sessionId);

      if (revoked) {
        res.json({
          success: true,
          message: 'Session revoked successfully',
        });
      } else {
        res.status(404).json({ error: 'Session not found' });
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * DELETE /api/auth/sessions
 * Revoke all sessions except current.
 */
export const revokeOtherSessions = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const authHeader = req.headers.authorization;
      const currentToken = authHeader?.startsWith('Bearer ')
        ? authHeader.substring(7)
        : undefined;

      const count = await authService.revokeOtherSessions(req.user.id, currentToken || '');

      res.json({
        success: true,
        message: `Revoked ${count} other session(s)`,
        data: { revokedCount: count },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * GET /api/auth/lock-status
 * Get the current lock status for the authenticated user.
 */
export const getLockStatus = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const status = await authService.getAccountLockStatus(req.user.id);

      res.json({
        success: true,
        data: { lockStatus: status },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/validate-password
 * Validate password strength without changing it.
 */
export const validatePassword = (authService: AuthModuleService) => {
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

      const { password } = req.body;
      const validation = authService.validatePassword(password);

      res.json({
        success: true,
        data: {
          valid: validation.valid,
          strength: validation.strength,
          score: validation.score,
          errors: validation.errors,
        },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * GET /api/auth/security-policy
 * Get the current security policy configuration.
 */
export const getSecurityPolicy = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const passwordPolicy = authService.getPasswordPolicy();
      const lockoutConfig = authService.getLockoutConfig();

      res.json({
        success: true,
        data: {
          passwordPolicy: {
            minLength: passwordPolicy.minLength,
            maxLength: passwordPolicy.maxLength,
            requireUppercase: passwordPolicy.requireUppercase,
            requireLowercase: passwordPolicy.requireLowercase,
            requireNumbers: passwordPolicy.requireNumbers,
            requireSpecialChars: passwordPolicy.requireSpecialChars,
            preventReuseCount: passwordPolicy.preventReuseCount,
            expiryDays: passwordPolicy.expiryDays,
          },
          lockoutPolicy: {
            maxFailedAttempts: lockoutConfig.maxFailedAttempts,
            lockoutDurationMinutes: lockoutConfig.lockoutDurationMinutes,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * GET /api/auth/audit-logs
 * Get auth audit logs for the current user.
 */
export const getAuditLogs = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const logs = await authService.getUserAuditLogs(req.user.id, limit, offset);

      res.json({
        success: true,
        data: { logs },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/admin/lock/:userId
 * Admin: lock a user account.
 */
export const adminLockAccount = (authService: AuthModuleService) => {
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

      const userId = req.params.userId!;
      const { durationMinutes } = req.body;

      await authService.adminLockAccount(userId, durationMinutes);

      res.json({
        success: true,
        message: durationMinutes
          ? `Account locked for ${durationMinutes} minutes`
          : 'Account locked indefinitely',
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * POST /api/auth/admin/unlock/:userId
 * Admin: unlock a user account.
 */
export const adminUnlockAccount = (authService: AuthModuleService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId!;

      await authService.adminUnlockAccount(userId);

      res.json({
        success: true,
        message: 'Account unlocked successfully',
      });
    } catch (error) {
      next(error);
    }
  };
};
