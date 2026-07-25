import { ModuleDependencies, Module } from '@/modules';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { createUsersRouter } from './users.routes';

/**
 * Create and register the users module.
 * Factory pattern enables dependency injection from the module registry.
 */
export function createUsersModule(deps: ModuleDependencies): Module {
  const usersRepository = new UsersRepository();
  const usersService = new UsersService(usersRepository);
  const router = createUsersRouter(deps.authMiddleware, usersService);

  return {
    name: 'users',
    basePath: '/api/users',
    router,
  };
}
