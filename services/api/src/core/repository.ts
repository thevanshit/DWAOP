import Database from '@/config/database';

/**
 * Base repository with common database operations.
 * All module repositories extend this class.
 */
export abstract class BaseRepository {
  protected db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  /**
   * Execute a raw SQL query
   */
  protected async query(text: string, params?: any[]): Promise<any> {
    return this.db.query(text, params);
  }

  /**
   * Execute a query and return the first row
   */
  protected async queryOne(text: string, params?: any[]): Promise<any> {
    const result = await this.db.query(text, params);
    return result.rows[0] || null;
  }

  /**
   * Execute a query and return all rows
   */
  protected async queryAll(text: string, params?: any[]): Promise<any[]> {
    const result = await this.db.query(text, params);
    return result.rows;
  }

  /**
   * Get paginated results
   */
  protected async queryPaginated(
    text: string,
    countText: string,
    params: any[],
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: any[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const offset = (page - 1) * limit;
    const dataParams = [...params, limit, offset];
    const dataResult = await this.db.query(`${text} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, dataParams);
    const countResult = await this.db.query(countText, params);

    const total = parseInt(countResult.rows[0]?.count || '0', 10);

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Execute a transaction
   */
  protected async transaction<T>(callback: (query: (text: string, params?: any[]) => Promise<any>) => Promise<T>): Promise<T> {
    return this.db.transaction(async (client) => {
      const txQuery = (text: string, params?: any[]) => client.query(text, params);
      return callback(txQuery);
    });
  }

  /**
   * Build WHERE clause dynamically from non-undefined filter values
   */
  protected buildWhereClause(
    filters: Record<string, any>,
    columnMap: Record<string, string>,
    paramIndexOffset: number = 0
  ): { clause: string; params: any[]; index: number } {
    const conditions: string[] = [];
    const params: any[] = [];
    let index = paramIndexOffset;

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        const column = columnMap[key] || key;
        index++;
        conditions.push(`${column} = $${index}`);
        params.push(value);
      }
    }

    return {
      clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params,
      index,
    };
  }
}
