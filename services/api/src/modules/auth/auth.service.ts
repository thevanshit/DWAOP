import { AuthService as CoreAuthService } from '@/core/auth/service';

/**
 * Module-level wrapper around the core AuthService.
 * Provides a clean API for the auth module controllers
 * while delegating all business logic to the core service.
 */
export class AuthModuleService {
  constructor(private authService: CoreAuthService) {}

  /**
   * Authenticate user with email and password
   */
  async login(credentials: { email: string; password: string }) {
    return this.authService.login(credentials);
  }

  /**
   * Create a new user account
   */
  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId?: string;
  }) {
    return this.authService.createUser(userData);
  }

  /**
   * Refresh access token using a valid refresh token
   */
  async refresh(refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  /**
   * Logout user by invalidating refresh token
   */
  async logout(userId: string, refreshToken: string) {
    return this.authService.logout(userId, refreshToken);
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    return this.authService.changePassword(userId, currentPassword, newPassword);
  }
}
