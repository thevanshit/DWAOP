
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'dwaop_platform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log('Connected to database');

        const seedPath = path.join(__dirname, '../../seeds/users.sql');
        console.log(`Reading seed from ${seedPath}`);

        let seedSql = fs.readFileSync(seedPath, 'utf8');

        // Generate real hash for 'password123'
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);
        console.log('Generated hash for password123:', hash);

        // Replace the mock hash in SQL with the real hash
        // The mock hash in users.sql is: $2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ
        const mockHash = '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ';
        seedSql = seedSql.split(mockHash).join(hash);

        console.log('Executing seed...');
        await client.query(seedSql);

        console.log('Seed executed successfully');
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
