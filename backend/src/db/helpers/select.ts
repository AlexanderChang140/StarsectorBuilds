import type { PoolClient, QueryResultRow } from 'pg';

import { pool } from '../client.ts';

export async function select<T extends QueryResultRow, K extends keyof T>(
    tableName: string,
    selection: K[],
    options?: {
        where?: Partial<T>;
        client?: PoolClient;
    },
): Promise<Pick<T, K>[]> {
    const { where, client } = options || {};
    const { values: whereValues } = where ? createWhereClause(where) : {};
    const query = makeSelectQuery<T>(tableName, selection, options) + ';';

    const db = client ? client : pool;
    const { rows } = await db.query<Pick<T, K>>(query, whereValues);
    return rows;
}

export async function selectOne<T extends QueryResultRow, K extends keyof T>(
    tableName: string,
    selection: K[],
    options?: {
        where?: Partial<T>;
        client?: PoolClient;
    },
): Promise<Pick<T, K> | undefined> {
    const { where, client } = options || {};
    const { values: whereValues } = where ? createWhereClause(where) : {};
    const query =
        makeSelectQuery<T>(tableName, selection, options) + 'LIMIT 1;';

    const db = client ? client : pool;
    const { rows } = await db.query<Pick<T, K>>(query, whereValues);
    return rows[0];
}

function makeSelectQuery<T extends QueryResultRow>(
    tableName: string,
    selection: (keyof T)[],
    options?: {
        where?: Partial<T>;
        client?: PoolClient;
    },
): string {
    const { where } = options || {};
    const selectClause = createSelectClause(selection);
    const { fragment: whereFragment } = where ? createWhereClause(where) : {};
    const whereClause = whereFragment ? `WHERE ${whereFragment}` : '';
    const query = `
        ${selectClause}
        FROM ${tableName}
        ${whereClause}
    `;
    return query;
}

export function makeSelect<T extends QueryResultRow, K extends keyof T>(
    table: string,
    selection: K[],
): (options?: { client?: PoolClient }) => Promise<Pick<T, K>[]>;

export function makeSelect<
    T extends QueryResultRow,
    K extends keyof T,
    W extends Partial<T>,
>(
    table: string,
    selection: K[],
): (options: { where: W; client?: PoolClient }) => Promise<Pick<T, K>[]>;

export function makeSelect<
    T extends QueryResultRow,
    K extends keyof T,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    W extends Partial<T> = {},
>(table: string, selection: K[]) {
    return async (options?: {
        where?: W;
        client?: PoolClient;
    }): Promise<Pick<T, K>[]> => {
        return select<T, K>(table, selection, options);
    };
}

export function makeSelectOne<T extends QueryResultRow, K extends keyof T>(
    table: string,
    selection: K[],
): (options?: { client?: PoolClient }) => Promise<Pick<T, K> | undefined>;

export function makeSelectOne<
    T extends QueryResultRow,
    K extends keyof T,
    W extends Partial<T>,
>(
    table: string,
    selection: K[],
): (options: {
    where: W;
    client?: PoolClient;
}) => Promise<Pick<T, K> | undefined>;

/**
 * Factory that creates a typed selector for retrieving a single row from a table.
 *
 * @template T - The full row type returned by the query (must extend QueryResultRow).
 * @template K - Keys of T that should be selected (columns to include in the result).
 * @template W - Partial shape used for the WHERE clause; defaults to an empty partial of T.
 *
 * @param table - The name of the database table to query.
 * @param selection - An array of keys from T indicating which columns to return.
 *
 * @returns A function that accepts an options object:
 *  - where?: W — an optional partial filter used to build the WHERE clause,
 *  - client?: PoolClient — an optional database client to execute the query (useful for transactions).
 * The returned function resolves to a Pick<T, K> containing the selected columns, or undefined if no matching row is found.
 *
 * @remarks
 * The produced function delegates to selectOne<T, K>(...) internally and will surface any errors thrown by the underlying query execution.
 */
export function makeSelectOne<
    T extends QueryResultRow,
    K extends keyof T,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    W extends Partial<T> = {},
>(table: string, selection: K[]) {
    return async (options?: {
        where?: W;
        client?: PoolClient;
    }): Promise<Pick<T, K> | undefined> => {
        return selectOne<T, K>(table, selection, options);
    };
}

export async function selectCodeIdRecord(
    tableName: string,
    client?: PoolClient,
) {
    const options = client ? { client } : {};
    const rows = await select(tableName, ['id', 'code'], options);
    return rows.reduce((acc, row) => {
        acc[row.code] = row.id;
        return acc;
    }, {} as Record<string, number>);
}

export function makeSelectCodeIdRecord(tableName: string) {
    return async (client?: PoolClient) => selectCodeIdRecord(tableName, client);
}

function createSelectClause<K>(values: K[]): string {
    const fragment = `SELECT ${values.join(', ')}`;
    return fragment;
}

function createWhereClause<T extends object>(
    where: T,
): { fragment: string; values: unknown[] } {
    let i = 1;
    const fragment = Object.keys(where)
        .map((k) => `${k} = $${i++}`)
        .join(' AND ');
    const values = Object.values(where);
    return { fragment, values };
}
