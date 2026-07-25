import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { UsersService } from './users.service';

/**
 * GET /api/users
 * List users with pagination, filtering, and search
 */
export const listUsers = (usersService: UsersService) => {
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

      const { page, limit, role, search, departmentId } = req.query;

      const result = await usersService.findAll({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        role: role as string | undefined,
        search: search as string | undefined,
        departmentId: departmentId as string | undefined,
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * GET /api/users/:id
 * Get a single user by ID
 */
export const getUserById = (usersService: UsersService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const user = await usersService.findById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * PUT /api/users/:id
 * Update a user profile
 */
export const updateUser = (usersService: UsersService) => {
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

      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const existing = await usersService.findById(id);
      if (!existing) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const { firstName, lastName, email, role, departmentId, isActive } = req.body;

      const user = await usersService.update(id, {
        firstName,
        lastName,
        email,
        role,
        departmentId,
        isActive,
      });

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };
};
