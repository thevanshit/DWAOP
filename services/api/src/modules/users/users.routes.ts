import { Router } from 'express';
import { AuthMiddleware } from '@/middleware/auth';
import { UsersService } from './users.service';
import * as validators from './users.validator';
import * as controller from './users.controller';

/**
 * Create users router with dependency injection.
 * All routes are protected - authentication is required.
 */
export function createUsersRouter(
  authMiddleware: AuthMiddleware,
  usersService: UsersService
): Router {
  const router = Router();

  // All user routes require authentication
  router.use(authMiddleware.authenticate);

  // GET /api/users - List users with pagination and filters
  router.get('/', validators.listUsersValidator, controller.listUsers(usersService));

  // GET /api/users/:id - Get user by ID
  router.get('/:id', controller.getUserById(usersService));

  // PUT /api/users/:id - Update user profile
  router.put('/:id', validators.updateUserValidator, controller.updateUser(usersService));

  return router;
}
