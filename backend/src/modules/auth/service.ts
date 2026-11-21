import crypto from 'crypto';

import argon2 from 'argon2';
import type { PoolClient } from 'pg';

import { SESSION_TTL_MS } from './constants.ts';
import { pool } from '../../db/client.ts';
import { deleteRow } from '../../db/helpers/delete.ts';
import { createFilterCondition, type Filter } from '../../db/helpers/filter.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { startTransaction } from '../../db/helpers/transaction.ts';
import type { SessionsRow, UsersRow } from '../../db/tables.ts';
import type { InsertableRow } from '../../db/types.ts';
import {
    ConflictError,
    DatabaseError,
    UnauthorizedError,
} from '../../server/error.ts';
import { getUser, insertUser } from '../users/service.ts';

export async function signup(
    username: string,
    password: string,
    email: string,
) {
    // TODO: Set config for password hashing
    const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
        hashLength: 16,
    });

    return startTransaction(async (client) => {
        const userRecord: InsertableRow<UsersRow> = {
            username,
            password_hash: hash,
            email,
        };
        const user = await insertUser({
            record: userRecord,
            returnKeys: ['id', 'username'],
            client,
        });

        if (!user.inserted) {
            throw new ConflictError('Failed to insert user');
        }

        const token = await createSession(user.id, client);
        return { token, username: user.username };
    });
}

export async function login(
    identifier: string,
    password: string,
    client?: PoolClient,
) {
    const user = await getUser(['id', 'password_hash', 'username'], {
        filter: {
            OR: [
                { username: createFilterCondition(identifier) },
                { email: createFilterCondition(identifier) },
            ],
        },
    });

    if (!user || !(await argon2.verify(user.password_hash, password))) {
        throw new UnauthorizedError('Failed to authorize user');
    }

    const token = await createSession(user.id, client);

    return { token, username: user.username };
}

export async function logout(token: string) {
    return deleteSession(token);
}

export async function validateSession(token: string, client?: PoolClient) {
    const query = `
        SELECT s.user_id, u.username
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = $1 AND s.expires_at > NOW()
        LIMIT 1;
    `;

    const executor = client ?? pool;

    const result = await executor?.query<{ user_id: number; username: string }>(
        query,
        [token],
    );

    return result?.rows[0];
}

async function createSession(userId: number, client?: PoolClient) {
    const token = createToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    const row = await insertSession({
        record: { user_id: userId, token, expires_at: expiresAt },
        client,
    });

    if (!row.inserted) {
        throw new DatabaseError('Failed to create session token');
    }

    return token;
}

function createToken() {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
}

const insertSession = makeInsertReturn('sessions');

async function deleteSession(token: string, client?: PoolClient) {
    const where: Filter<SessionsRow> = {
        token: createFilterCondition(token),
    };

    return deleteRow('sessions', where, { client });
}
