import { BaseRepository } from '@/core/repository';
import { UserFilters, UpdateUserData } from './users.service';

export interface UserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  departmentId: string | null;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Repository for user-related database operations.
 * Extends BaseRepository for common query patterns.
 */
export class UsersRepository extends BaseRepository {
  /**
   * Retrieve paginated users with optional filtering
   */
  async findAll(filters: UserFilters) {
    const { page, limit, role, search, departmentId } = filters;
    const params: any[] = [];
    const conditions: string[] = [];
    let paramIndex = 0;

    // Role filter
    if (role) {
      paramIndex++;
      conditions.push(`u.role = $${paramIndex}`);
      params.push(role);
    }

    // Department filter
    if (departmentId) {
      paramIndex++;
      conditions.push(`u.department_id = $${paramIndex}`);
      params.push(departmentId);
    }

    // Text search across name and email
    if (search) {
      paramIndex++;
      const searchPattern = `%${search}%`;
      conditions.push(
        `(u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`
      );
      params.push(searchPattern);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const baseQuery = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.role,
             u.department_id, u.is_active, u.email_verified,
             u.last_login, u.created_at, u.updated_at
      FROM users u
    `;

    const countQuery = `SELECT COUNT(*) as count FROM users u ${whereClause}`;

    return this.queryPaginated(baseQuery + whereClause + ' ORDER BY u.created_at DESC', countQuery, params, page, limit);
  }

  /**
   * Find a single user by their ID
   */
  async findById(id: string): Promise<UserRecord | null> {
    const row = await this.queryOne(
      `SELECT id, email, first_name, last_name, role,
              department_id, is_active, email_verified,
              last_login, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (!row) return null;

    return this.mapRow(row);
  }

  /**
   * Update a user's profile fields
   */
  async update(id: string, data: UpdateUserData): Promise<UserRecord | null> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 0;

    if (data.firstName !== undefined) {
      paramIndex++;
      setClauses.push(`first_name = $${paramIndex}`);
      params.push(data.firstName);
    }

    if (data.lastName !== undefined) {
      paramIndex++;
      setClauses.push(`last_name = $${paramIndex}`);
      params.push(data.lastName);
    }

    if (data.email !== undefined) {
      paramIndex++;
      setClauses.push(`email = $${paramIndex}`);
      params.push(data.email);
    }

    if (data.role !== undefined) {
      paramIndex++;
      setClauses.push(`role = $${paramIndex}`);
      params.push(data.role);
    }

    if (data.departmentId !== undefined) {
      paramIndex++;
      setClauses.push(`department_id = $${paramIndex}`);
      params.push(data.departmentId);
    }

    if (data.isActive !== undefined) {
      paramIndex++;
      setClauses.push(`is_active = $${paramIndex}`);
      params.push(data.isActive);
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    // Always update the updated_at timestamp
    paramIndex++;
    setClauses.push(`updated_at = $${paramIndex}`);
    params.push(new Date());

    // Add the ID as the last parameter
    paramIndex++;
    params.push(id);

    const row = await this.queryOne(
      `UPDATE users
       SET ${setClauses.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, email, first_name, last_name, role,
                 department_id, is_active, email_verified,
                 last_login, created_at, updated_at`,
      params
    );

    if (!row) return null;

    return this.mapRow(row);
  }

  /**
   * Map a database row to a UserRecord
   */
  private mapRow(row: any): UserRecord {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      departmentId: row.department_id,
      isActive: row.is_active,
      emailVerified: row.email_verified,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
