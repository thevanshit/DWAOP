
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'dwaop_platform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Connected to database');

        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        console.log(`Reading schema from ${schemaPath}`);

        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        await client.query(schema);

        console.log('Schema executed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
