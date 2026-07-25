import { ModuleDependencies, Module } from '@/modules';
import { AuthModuleService } from './auth.service';
import { createAuthRouter } from './auth.routes';

/**
 * Create and register the auth module.
 * Factory pattern enables dependency injection from the module registry.
 */
export function createAuthModule(deps: ModuleDependencies): Module {
  const authService = new AuthModuleService(deps.authService);
  const router = createAuthRouter(deps.authMiddleware, authService);

  return {
    name: 'auth',
    basePath: '/api/auth',
    router,
  };
}
