import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'deptwp_platform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

const migrations = [
  // Add account lockout columns to users table
  `ALTER TABLE users 
   ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
   ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
   ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`,

  // Create password_history table
  `CREATE TABLE IF NOT EXISTS password_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // Create email_verification_tokens table
  `CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // Add index on email_verification_tokens
  `CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user 
   ON email_verification_tokens(user_id);`,

  `CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token 
   ON email_verification_tokens(token);`,

  // Create login_attempts table for detailed audit
  `CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL DEFAULT false,
    failure_reason VARCHAR(100),
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE INDEX IF NOT EXISTS idx_login_attempts_user 
   ON login_attempts(user_id);`,

  `CREATE INDEX IF NOT EXISTS idx_login_attempts_time 
   ON login_attempts(attempted_at);`,

  // Add index on refresh_tokens expiry for cleanup
  `CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires 
   ON refresh_tokens(expires_at);`,
];

async function migrateV2() {
  const client = await pool.connect();
  try {
    console.log('Connected to database for v2 migration');

    for (let i = 0; i < migrations.length; i++) {
      const sql = migrations[i];
      console.log(`Running migration ${i + 1}/${migrations.length}...`);
      await client.query(sql as string);
      console.log(`Migration ${i + 1} completed`);
    }

    console.log('All v2 migrations completed successfully');
  } catch (error) {
    console.error('Migration v2 failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateV2();
