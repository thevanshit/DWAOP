import { Router } from 'express';
import { AuthMiddleware } from '@/middleware/auth';
import {
  loginLimiter,
  registerLimiter,
  passwordChangeLimiter,
  emailVerificationLimiter,
  refreshLimiter,
} from '@/middleware/auth-rate-limiter';
import { AuthModuleService } from './auth.service';
import * as validators from './auth.validator';
import * as controller from './auth.controller';

/**
 * Create auth router with dependency injection.
 * All controllers receive their service dependency at route creation time.
 */
export function createAuthRouter(
  authMiddleware: AuthMiddleware,
  authService: AuthModuleService
): Router {
  const router = Router();

  // ──────────────────────────────────────────
  //  PUBLIC ROUTES
  // ──────────────────────────────────────────

  // Login with rate limiting to prevent brute-force
  router.post(
    '/login',
    loginLimiter,
    validators.loginValidator,
    controller.login(authService)
  );

  // Token refresh with rate limiting
  router.post(
    '/refresh',
    refreshLimiter,
    validators.refreshValidator,
    controller.refreshToken(authService)
  );

  // Email verification (public - user clicks link from email)
  router.post(
    '/verify-email',
    emailVerificationLimiter,
    validators.verifyEmailValidator,
    controller.verifyEmail(authService)
  );

  // Get security policy (public - client needs to know rules before registration)
  router.get('/security-policy', controller.getSecurityPolicy(authService));

  // Validate password strength (public - for registration form UX)
  router.post(
    '/validate-password',
    validators.validatePasswordValidator,
    controller.validatePassword(authService)
  );

  // ──────────────────────────────────────────
  //  PROTECTED ROUTES (Any authenticated user)
  // ──────────────────────────────────────────

  // Get current user profile
  router.get(
    '/me',
    authMiddleware.authenticate,
    controller.getMe(authService)
  );

  // Logout
  router.post(
    '/logout',
    authMiddleware.authenticate,
    validators.refreshValidator,
    controller.logout(authService)
  );

  // Change password
  router.post(
    '/change-password',
    authMiddleware.authenticate,
    passwordChangeLimiter,
    validators.changePasswordValidator,
    controller.changePassword(authService)
  );

  // Send email verification
  router.post(
    '/send-verification',
    authMiddleware.authenticate,
    emailVerificationLimiter,
    controller.sendVerification(authService)
  );

  // Get active sessions
  router.get(
    '/sessions',
    authMiddleware.authenticate,
    controller.getSessions(authService)
  );

  // Revoke a specific session
  router.delete(
    '/sessions/:sessionId',
    authMiddleware.authenticate,
    validators.revokeSessionValidator,
    controller.revokeSession(authService)
  );

  // Revoke all other sessions
  router.delete(
    '/sessions',
    authMiddleware.authenticate,
    controller.revokeOtherSessions(authService)
  );

  // Get account lock status
  router.get(
    '/lock-status',
    authMiddleware.authenticate,
    controller.getLockStatus(authService)
  );

  // Get auth audit logs
  router.get(
    '/audit-logs',
    authMiddleware.authenticate,
    controller.getAuditLogs(authService)
  );

  // ──────────────────────────────────────────
  //  ADMIN ROUTES
  // ──────────────────────────────────────────

  // Register new user (admin only)
  router.post(
    '/register',
    authMiddleware.authenticate,
    authMiddleware.requireRole(['admin']),
    registerLimiter,
    validators.registerValidator,
    controller.register(authService)
  );

  // Admin lock user account
  router.post(
    '/admin/lock/:userId',
    authMiddleware.authenticate,
    authMiddleware.requireRole(['admin']),
    validators.adminLockAccountValidator,
    controller.adminLockAccount(authService)
  );

  // Admin unlock user account
  router.post(
    '/admin/unlock/:userId',
    authMiddleware.authenticate,
    authMiddleware.requireRole(['admin']),
    controller.adminUnlockAccount(authService)
  );

  return router;
}
