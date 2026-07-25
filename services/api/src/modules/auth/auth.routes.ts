import { Router } from 'express';
import { AuthMiddleware } from '@/middleware/auth';
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

  // Public routes
  router.post('/login', validators.loginValidator, controller.login(authService));
  router.post('/refresh', validators.refreshValidator, controller.refreshToken(authService));

  // Protected routes
  router.post(
    '/register',
    authMiddleware.authenticate,
    authMiddleware.requireRole(['admin']),
    validators.registerValidator,
    controller.register(authService)
  );

  router.post(
    '/logout',
    authMiddleware.authenticate,
    validators.refreshValidator,
    controller.logout(authService)
  );

  router.post(
    '/change-password',
    authMiddleware.authenticate,
    validators.changePasswordValidator,
    controller.changePassword(authService)
  );

  router.get('/me', authMiddleware.authenticate, controller.getMe);

  return router;
}
