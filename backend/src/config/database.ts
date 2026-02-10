import { Pool, PoolConfig } from 'pg';
import { logger } from '@/utils/logger';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  name: string;
  user: string;
  password: string;
  ssl?: boolean;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor(config: DatabaseConfig) {
    const poolConfig: PoolConfig = {
      host: config.host,
      port: config.port,
      database: config.name || config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      max: config.max || 20,
      idleTimeoutMillis: config.idleTimeoutMillis || 30000,
      connectionTimeoutMillis: config.connectionTimeoutMillis || 2000,
    };

    this.pool = new Pool(poolConfig);

    // Handle pool errors
    this.pool.on('error', (err: Error) => {
      logger.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    // Log connection events in development
    if (process.env.NODE_ENV === 'development') {
      this.pool.on('connect', () => {
        logger.debug('New database client connected');
      });

      this.pool.on('remove', () => {
        logger.debug('Database client removed');
      });
    }
  }

  public static getInstance(config?: DatabaseConfig): Database {
    if (!Database.instance) {
      if (!config) {
        throw new Error('Database configuration is required for first initialization');
      }
      Database.instance = new Database(config);
    }
    return Database.instance;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Executed query', { text, duration, rows: result.rowCount });
      }
      
      return result;
    } catch (error) {
      logger.error('Database query error', { text, error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  public async getClient() {
    return this.pool.connect();
  }

  public async transaction<T>(callback: (client: import('pg').PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database connection pool closed');
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health');
      return result.rows[0].health === 1;
    } catch (error) {
      logger.error('Database health check failed', error);
      return false;
    }
  }

  public getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

export default Database;