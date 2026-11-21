import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import type { PoolClient } from 'pg';

import { pool } from './client.ts';
import { logger } from '../utils/logger.ts';

dotenv.config();

export async function setup() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const dirs = ['reset', 'schema', 'seed'];
        for (const dir of dirs) {
            await runSqlFiles(path.join(__dirname, 'sql', dir), client);
        }
        await seed(client);

        await client.query('COMMIT');
        logger.info('Database setup and seeding completed successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error('Database setup failed. Transaction rolled back.', {
            cause: err,
        });
    } finally {
        client.release();
        await pool.end();
    }
}

async function runSqlFiles(dir: string, client: PoolClient) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await runSqlFiles(fullPath, client);
        } else if (entry.isFile() && fullPath.endsWith('.sql')) {
            const sql = fs.readFileSync(fullPath, 'utf8');
            console.log();
            logger.info('Running:', fullPath);
            await client.query(sql);
            logger.info('Finished:', fullPath);
        }
    }
}

async function seed(client: PoolClient) {
    seedDeletedUser(client);
}

async function seedDeletedUser(client: PoolClient) {
    const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3);
    `;
    await client.query(query, [
        process.env.DELETED_USER,
        process.env.DELETED_USER_EMAIL,
        process.env.DELETED_USER_PASSWORD,
    ]);
}
