import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

import { pool } from './client.ts';

dotenv.config();

export async function setup() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dirs = ['reset', 'schema', 'seed'];
    for (const dir of dirs) {
        await runSqlFiles(path.join(__dirname, 'sql', dir));
    }
    await seed();
    pool.end();
}

async function runSqlFiles(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await runSqlFiles(fullPath);
        } else if (entry.isFile() && fullPath.endsWith('.sql')) {
            const sql = fs.readFileSync(fullPath, 'utf8');
            console.log('Running:', fullPath);
            await pool.query(sql);
            console.log('Finished:', fullPath);
        }
    }
}

async function seed() {
    seedDeletedUser();
}

async function seedDeletedUser() {
    const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3);
    `;
    pool.query(query, [
        process.env.DELETED_USER,
        process.env.DELETED_USER_EMAIL,
        process.env.DELETED_USER_PASSWORD,
    ]);
}
