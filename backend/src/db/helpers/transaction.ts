import type { PoolClient } from 'pg';

import { pool } from '../client.ts';

export async function startTransaction<T>(
    f: (client: PoolClient) => T,
    msg: string = 'Failed to complete transaction',
) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await f(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(msg, {
            cause: err,
        });
    } finally {
        client.release();
    }
}
