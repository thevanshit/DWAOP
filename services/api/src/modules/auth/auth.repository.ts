import { BaseRepository } from '@/core/repository';

/**
 * Repository for auth-specific database operations.
 * Currently a stub for future use - will handle user lookup,
 * token storage, and session management at the data layer.
 */
export class AuthRepository extends BaseRepository {
  // Stub for auth-specific DB operations
  // Future methods may include:
  // - findUserByEmail(email: string)
  // - storeRefreshToken(userId: string, token: string)
  // - revokeRefreshToken(userId: string, token: string)
  // - cleanupExpiredTokens()
}
