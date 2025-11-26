import type { PoolClient } from 'pg';

import type { Inserted } from '../../types/generic.ts';
import { pool } from '../client.ts';

export async function insert<T extends object>(
    tableName: string,
    record: T,
    conflicts: (keyof T)[],
): Promise<void> {
    const keys = Object.keys(record) as (keyof T)[];
    const values = keys.map((key) => record[key]);
    const columns = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
        INSERT INTO ${tableName} (${columns})
        VALUES (${placeholders})
        ON CONFLICT (${conflicts.join(', ')}) DO NOTHING;
    `;
    await pool.query(query, values);
}

/**
 * Inserts a record into the specified table and returns specified columns.
 * If a conflict occurs on the given columns, returns the existing record instead.
 *
 * @template T - The type of the record to insert.
 * @template R - The type of the record to return.
 * @param tableName - The name of the table to insert into.
 * @param record - The record to insert.
 * @param conflicts - The columns to check for conflicts.
 * @param returning - The columns to return from the inserted or existing record.
 * @returns A promise that resolves to the specified returning columns.
 * @throws If neither insertion nor selection of the existing record succeeds.
 */
export async function insertReturn<T extends object, R extends object>(
    tableName: string,
    record: T,
    conflicts: (keyof T)[] = [],
    returning: (keyof R)[] = [],
    client?: PoolClient,
): Promise<R & Inserted> {
    const keys = Object.keys(record) as (keyof T)[];
    const values = keys.map((k) => record[k]);
    const columns = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const conflictClause =
        conflicts.length > 0
            ? `ON CONFLICT (${conflicts.join(', ')}) DO NOTHING`
            : '';
    const returnKeys = returning.join(`, `);
    const returningClause = returning.length
        ? `RETURNING ${returnKeys}`
        : 'RETURNING 1';
    const where = conflicts
        .map((c, i) => `${String(c)} = $${keys.length + i + 1}`)
        .join(' AND ');
    const whereValues = conflicts.map((c) => record[c]);

    const query = `
        WITH ins AS (
            INSERT INTO ${tableName} (${columns})
            VALUES (${placeholders})
            ${conflictClause}
            ${returningClause}
        )
        SELECT ${returnKeys}${
        returning.length ? ',' : ''
    } TRUE AS inserted FROM ins
        UNION ALL
        SELECT ${returnKeys}${returning.length ? ',' : ''} FALSE AS inserted
        FROM ${tableName}
        WHERE ${where}
        LIMIT 1;
    `;

    const db = client ? client : pool;
    const { rows } = await db.query<R & Inserted>(query, [
        ...values,
        ...whereValues,
    ]);

    if (!rows[0]) {
        throw new Error(
            `Failed to insert or find record ${record} in ${tableName}`,
        );
    }
    return rows[0];
}

type MakeInsertReturn<T, R> = <K extends keyof R = never>(
    record: T,
    options?:
        | {
              returning?: K[];
              client?: PoolClient;
          }
        | undefined,
) => Promise<Pick<R, K> & Inserted>;

export function makeInsertReturn<T extends object>(
    tableName: string,
    conflictKeys: (keyof T)[],
): MakeInsertReturn<T, T>;

export function makeInsertReturn<T extends object, R extends object>(
    tableName: string,
    conflictKeys: (keyof T)[],
): MakeInsertReturn<T, R>;

/**
 * Creates an insert function for a specific database table that supports conflict resolution and optional returning of specified fields.
 *
 * @template T - The type representing the record to insert.
 * @template R - The type representing the full record as stored in the database.
 * @param tableName - The name of the table to insert into.
 * @param conflictKeys - The columns to check for conflicts.
 * @returns An asynchronous function that inserts a record into the table. The returned function accepts:
 *   - `record`: The record to insert.
 *   - `returning`: An optional array of keys from `R` specifying which fields to return.
 *   - Returns a Promise that resolves to either:
 *     - `void` if no fields are specified in `returning`.
 *     - An object containing only the requested fields if `returning` is provided.
 *
 * @example
 * const insertWeaponInstance = makeInsertReturn<InsertedWeaponInstance, WeaponInstance>('weapon_instances', ['data_hash']);
 * const weaponInstance = await insertWeaponInstance({ data_hash: 'hash' }, ['id', 'data_hash']);
 */
export function makeInsertReturn<T extends object, R extends object>(
    tableName: string,
    conflictKeys: (keyof T)[],
): MakeInsertReturn<T, R> {
    return async <K extends keyof R = never>(
        record: T,
        options?: {
            returning?: K[];
            client?: PoolClient;
        },
    ): Promise<Pick<R, K> & Inserted> => {
        const { returning = [], client } = options || {};
        return insertReturn<T, R>(
            tableName,
            record,
            conflictKeys,
            returning,
            client,
        );
    };
}

/**
 * Inserts multiple items and their corresponding junction records into the database.
 *
 * This function is useful for handling many-to-many relationships where you need to insert
 * items (e.g., tags, categories) and then create junction table records linking those items
 * to a parent instance (e.g., a post, user, etc.).
 *
 * @typeParam TItem - The type representing the item code (typically a string literal type).
 * @typeParam TJunction - The type representing the junction table record.
 *
 * @param items - An array of item codes to insert.
 * @param instanceId - The ID of the parent instance to associate with each item in the junction table.
 * @param insertItemFn - An async function that inserts an item and returns its ID.
 * @param insertJunctionFn - An async function that inserts a junction record.
 * @param junctionForeignKeys - An object specifying the keys in the junction table for the instance and item.
 *
 * @returns A Promise that resolves when all items and junction records have been inserted.
 */
export async function insertJunctionItems<
    TItem extends string,
    TJunction extends object,
>(
    items: TItem[],
    instanceId: number,
    insertItemFn: (
        record: { code: TItem },
        returning: { returning: 'id'[]; client?: PoolClient },
    ) => Promise<{ id: number; inserted: boolean }>,
    insertJunctionFn: (
        record: TJunction,
        returning?: { returning?: (keyof TJunction)[]; client?: PoolClient },
    ) => Promise<{ inserted: boolean }>,
    junctionForeignKeys: {
        instanceKey: keyof TJunction;
        itemKey: keyof TJunction;
    },
    client?: PoolClient,
): Promise<void> {
    await Promise.all(
        items.map(async (item) => {
            const { id } = await insertItemFn(
                { code: item },
                client ? { returning: ['id'], client } : { returning: ['id'] },
            );

            const junction = {
                [junctionForeignKeys.instanceKey]: instanceId,
                [junctionForeignKeys.itemKey]: id,
            } as TJunction;
            if (client) {
                await insertJunctionFn(junction, client ? { client } : {});
            } else {
                await insertJunctionFn(junction);
            }
        }),
    );
}
