import { UsersRepository } from './users.repository';

export interface UserFilters {
  page: number;
  limit: number;
  role?: string;
  search?: string;
  departmentId?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  departmentId?: string | null;
  isActive?: boolean;
}

/**
 * Business logic layer for user operations.
 * Delegates data access to UsersRepository and applies
 * any domain-specific rules before returning results.
 */
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  /**
   * Retrieve paginated list of users with optional filtering
   */
  async findAll(filters: UserFilters) {
    return this.usersRepository.findAll(filters);
  }

  /**
   * Find a single user by their ID
   */
  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  /**
   * Update a user's profile fields
   */
  async update(id: string, data: UpdateUserData) {
    return this.usersRepository.update(id, data);
  }
}
