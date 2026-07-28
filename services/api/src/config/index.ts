import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export interface Config {
  port: number;
  nodeEnv: string;
  database: {
    host: string;
    port: number;
    name: string;
    database: string;
    user: string;
    password: string;
    ssl: boolean;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  upload: {
    dir: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origin: string;
    credentials: boolean;
  };
  logging: {
    level: string;
    file: string;
  };
  websocket: {
    port: number;
  };
  audit: {
    retentionDays: number;
  };
  workflow: {
    timeoutHours: number;
    escalationHours: number;
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'deptwp_platform',
    database: process.env.DB_NAME || 'deptwp_platform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000', 10),
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET environment variable is required'); })(),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || (() => { throw new Error('JWT_REFRESH_SECRET environment variable is required'); })(),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },

  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,jpeg,png').split(','),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },

  websocket: {
    port: parseInt(process.env.WS_PORT || '3002', 10),
  },

  audit: {
    retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || '365', 10),
  },

  workflow: {
    timeoutHours: parseInt(process.env.WORKFLOW_TIMEOUT_HOURS || '24', 10),
    escalationHours: parseInt(process.env.WORKFLOW_ESCALATION_HOURS || '48', 10),
  },
};

// Warn about optional production environment variables
const isProduction = config.nodeEnv === 'production';
const prodRequiredVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingProdVars = prodRequiredVars.filter(v => !process.env[v]);

if (isProduction && missingProdVars.length > 0) {
  throw new Error(`Missing required environment variables for production: ${missingProdVars.join(', ')}`);
}

export default config;