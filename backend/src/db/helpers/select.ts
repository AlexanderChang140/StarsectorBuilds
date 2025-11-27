import type { PoolClient, QueryResultRow } from 'pg';

import { pool } from '../client.ts';

/**
 * Retrieve multiple rows from a database table selecting only the specified columns.
 *
 * @template TRow - The full row type returned by the query (must extend QueryResultRow).
 * @template TSelection - Keys of TRow that should be selected (columns to include in the result).
 *
 * @param tableName - The name of the database table to query.
 * @param selection - An array of keys from TRow indicating which columns to return.
 * @param options - Optional settings for the query.
 * @param options.where - Partial object used to build the WHERE clause; only rows matching these column/value pairs are returned.
 * @param options.client - Optional database client to execute the query (useful for transactions).
 *
 * @returns A promise that resolves to an array of rows with only the selected columns (Pick<TRow, TSelection>[]).
 *
 * @throws Propagates any database/query errors thrown by the underlying client.
 *
 * @example
 * // Select all users, returning only the "id" and "email" columns:
 * const users = await select<UserRow, 'id' | 'email'>('users', ['id', 'email']);
 *
 * @example
 * // Select users with a specific status, returning only the "name" column:
 * const activeUsers = await select<UserRow, 'name'>('users', ['name'], { where: { status: 'active' } });
 */
export async function select<
    TRow extends QueryResultRow,
    TSelection extends keyof TRow,
>(
    tableName: string,
    selection: TSelection[],
    options?: {
        where?: Partial<TRow>;
        client?: PoolClient;
    },
): Promise<Pick<TRow, TSelection>[]> {
    const { where, client } = options || {};
    const { values: whereValues } = where ? createWhereClause(where) : {};
    const query = makeSelectQuery<TRow>(tableName, selection, options) + ';';

    const db = client ? client : pool;
    const { rows } = await db.query<Pick<TRow, TSelection>>(query, whereValues);
    return rows;
}

/**
 * Retrieve a single row from a database table selecting only the specified columns.
 *
 * @template TRow - The full row type returned by the query (must extend QueryResultRow).
 * @template TSelection - Keys of TRow that should be selected (columns to include in the result).
 *
 * @param tableName - The name of the database table to query.
 * @param selection - An array of keys from TRow indicating which columns to return.
 * @param options - Optional settings for the query.
 * @param options.where - Partial object used to build the WHERE clause; only rows matching these column/value pairs are considered.
 * @param options.client - Optional database client to execute the query (useful for transactions).
 *
 * @returns A promise that resolves to a single row with only the selected columns (Pick<TRow, TSelection>) or undefined if no matching row is found.
 *
 * @throws Propagates any database/query errors thrown by the underlying client.
 *
 * @example
 * // Select a single user by id, returning only the "id" and "email" columns:
 * const user = await selectOne<UserRow, 'id' | 'email'>('users', ['id', 'email'], { where: { id: 1 } });
 */
export async function selectOne<
    TRow extends QueryResultRow,
    TSelection extends keyof TRow,
>(
    tableName: string,
    selection: TSelection[],
    options?: {
        where?: Partial<TRow>;
        client?: PoolClient;
    },
): Promise<Pick<TRow, TSelection> | undefined> {
    const { where, client } = options || {};
    const { values: whereValues } = where ? createWhereClause(where) : {};
    const query =
        makeSelectQuery<TRow>(tableName, selection, options) + 'LIMIT 1;';

    const db = client ? client : pool;
    const { rows } = await db.query<Pick<TRow, TSelection>>(query, whereValues);
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

export function makeSelect<
    TRow extends QueryResultRow,
    TSelection extends keyof TRow,
>(
    table: string,
    selection: TSelection[],
): (options?: { client?: PoolClient }) => Promise<Pick<TRow, TSelection>[]>;

export function makeSelect<
    TRow extends QueryResultRow,
    TSelection extends keyof TRow,
    TWhere extends Partial<TRow>,
>(
    table: string,
    selection: TSelection[],
): (options: {
    where: TWhere;
    client?: PoolClient;
}) => Promise<Pick<TRow, TSelection>[]>;

/**
 * Factory that creates a typed selector for retrieving multiple rows from a table.
 *
 * @template TRow - The full row type returned by the query (must extend QueryResultRow).
 * @template TSelection - Keys of TRow that should be selected (columns to include in the result).
 * @template TWhere - Partial shape used for the WHERE clause; defaults to an empty partial of TRow.
 *
 * @param table - The name of the database table to query.
 * @param selection - An array of keys from TRow indicating which columns to return.
 *
 * @returns A function that accepts an options object:
 *  - where?: TWhere — an optional partial filter used to build the WHERE clause,
 *  - client?: PoolClient — an optional database client to execute the query (useful for transactions).
 * The returned function resolves to an array of Pick<TRow, TSelection> containing the selected columns.
 *
 * @throws Any errors thrown by the underlying select implementation are propagated.
 */
export function makeSelect<
    TRow extends QueryResultRow,
    TSelection extends keyof TRow,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TWhere extends Partial<TRow> = {},
>(table: string, selection: TSelection[]) {
    return async (options?: {
        where?: TWhere;
        client?: PoolClient;
    }): Promise<Pick<TRow, TSelection>[]> => {
        return select<TRow, TSelection>(table, selection, options);
    };
}

export function makeSelectOne<
    TRow extends QueryResultRow,
    TSelection extends keyof TRow,
>(
    table: string,
    selection: TSelection[],
): (options?: {
    client?: PoolClient;
}) => Promise<Pick<TRow, TSelection> | undefined>;

export function makeSelectOne<
    TRow extends QueryResultRow,
    TSelection extends keyof TRow,
    TWhere extends Partial<TRow>,
>(
    table: string,
    selection: TSelection[],
): (options: {
    where: TWhere;
    client?: PoolClient;
}) => Promise<Pick<TRow, TSelection> | undefined>;

/**
 * Factory that creates a typed selector for retrieving a single row from a table.
 *
 * @template TRow - The full row type returned by the query (must extend QueryResultRow).
 * @template TSelection - Keys of TRow that should be selected (columns to include in the result).
 * @template TWhere - Partial shape used for the WHERE clause; defaults to an empty partial of TRow.
 *
 * @param table - The name of the database table to query.
 * @param selection - An array of keys from TRow indicating which columns to return.
 *
 * @returns A function that accepts an options object:
 *  - where?: TWhere — an optional partial filter used to build the WHERE clause,
 *  - client?: PoolClient — an optional database client to execute the query (useful for transactions).
 * The returned function resolves to a Pick<TRow, TSelection> containing the selected columns, or undefined if no matching row is found.
 *
 * @remarks
 * The produced function delegates to selectOne<TRow, TSelection>(...) internally and will surface any errors thrown by the underlying query execution.
 */
export function makeSelectOne<
    TRow extends QueryResultRow,
    TSelection extends keyof TRow,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    TWhere extends Partial<TRow> = {},
>(table: string, selection: TSelection[]) {
    return async (options?: {
        where?: TWhere;
        client?: PoolClient;
    }): Promise<Pick<TRow, TSelection> | undefined> => {
        return selectOne<TRow, TSelection>(table, selection, options);
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
