import type { PoolClient } from 'pg';

import type { Inserted } from '../../types/generic.ts';
import { pool } from '../client.ts';

export async function insert<TRecord extends object, TReturning extends object>(
    tableName: string,
    args: {
        record: TRecord;
        conflictKeys?: (keyof TRecord)[] | undefined;
        returnKeys?: (keyof TReturning)[] | undefined;
        client?: PoolClient | undefined;
    },
): Promise<TReturning & Inserted> {
    const { record, conflictKeys = [], returnKeys = [], client } = args;

    const keys = Object.keys(record) as (keyof TRecord)[];
    const values = keys.map((k) => record[k]);
    const columns = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const conflictString = conflictKeys.join(', ');
    const conflictClause = conflictKeys.length
        ? `ON CONFLICT (${conflictString}) DO NOTHING`
        : '';
    const returnString = returnKeys.join(', ');
    const returningClause = returnKeys.length
        ? `RETURNING ${returnString}`
        : 'RETURNING 1';
    const whereString = conflictKeys.length
        ? conflictKeys
              .map((c, i) => `${String(c)} = $${keys.length + i + 1}`)
              .join(' AND ')
        : '';
    const whereClause = conflictKeys.length ? `WHERE ${whereString}` : '';
    const whereValues = conflictKeys.map((c) => record[c]);

    const query = `
        WITH ins AS (
            INSERT INTO ${tableName} (${columns})
            VALUES (${placeholders})
            ${conflictClause}
            ${returningClause}
        )
        SELECT ${returnKeys}${
        returnKeys.length ? ',' : ''
    } TRUE AS inserted FROM ins
        UNION ALL
        SELECT ${returnKeys}${returnKeys.length ? ',' : ''} FALSE AS inserted
        FROM ${tableName}
        ${whereClause}
        LIMIT 1;
    `;

    const db = client ?? pool;
    const { rows } = await db.query<TReturning & Inserted>(query, [
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

type MakeInsertReturn<TRecord, TFullRecord> = (args: {
    record: TRecord;
    returnKeys?: (keyof TFullRecord)[];
    client?: PoolClient | undefined;
}) => Promise<TFullRecord & Inserted>;

export function makeInsertReturn<TFullRecord extends object>(
    tableName: string,
    conflictKeys?: (keyof TFullRecord)[],
): MakeInsertReturn<TFullRecord, TFullRecord>;

export function makeInsertReturn<
    TRecord extends object,
    TFullRecord extends object,
>(
    tableName: string,
    conflictKeys?: (keyof TRecord)[],
): MakeInsertReturn<TRecord, TFullRecord>;

/**
 * Create a typed insert helper bound to a specific table and optional conflict keys.
 *
 * @template TRecord - The shape of the record being inserted (input DTO).
 * @template TFullRecord - The shape of the full record returned by the database (includes DB-generated fields).
 *
 * @param tableName - The name of the database table to insert into.
 * @param conflictKeys - Optional array of keys from TRecord used for conflict resolution (e.g. ON CONFLICT ... DO UPDATE).
 *
 * @returns A function which accepts an object with:
 *  - record: TRecord — the values to insert,
 *  - returnKeys?: (keyof TFullRecord)[] — optional list of columns to return from the inserted row,
 *  - client?: PoolClient — optional database client/transaction to execute the query with.
 *
 * The returned function delegates to `insert<TRecord, TFullRecord>` with the provided table name and conflict keys,
 * and resolves to a promise of the inserted full record extended with `Inserted` metadata (i.e. `Promise<TFullRecord & Inserted>`).
 *
 * @example
 * const insertUser = makeInsertReturn<UserInput, UserRow>('users', ['email']);
 * const inserted = await insertUser({ record: { name: 'Alice' }, returnKeys: ['id', 'created_at'] });
 */
export function makeInsertReturn<
    TRecord extends object,
    TFullRecord extends object,
>(
    tableName: string,
    conflictKeys?: (keyof TRecord)[] | undefined,
): MakeInsertReturn<TRecord, TFullRecord> {
    return async (args: {
        record: TRecord;
        returnKeys?: (keyof TFullRecord)[] | undefined;
        client?: PoolClient | undefined;
    }): Promise<TFullRecord & Inserted> => {
        return insert<TRecord, TFullRecord>(tableName, {
            ...args,
            conflictKeys,
        });
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
    insertItemFn: (args: {
        record: { code: TItem };
        returnKeys: 'id'[];
        client?: PoolClient | undefined;
    }) => Promise<{ id: number; inserted: boolean }>,
    insertJunctionFn: (args: {
        record: TJunction;
        returnKeys?: (keyof TJunction)[];
        client?: PoolClient | undefined;
    }) => Promise<{ inserted: boolean }>,
    junctionForeignKeys: {
        instanceKey: keyof TJunction;
        itemKey: keyof TJunction;
    },
    client?: PoolClient | undefined,
): Promise<void> {
    await Promise.all(
        items.map(async (item) => {
            const { id } = await insertItemFn({
                record: { code: item },
                returnKeys: ['id'],
                client,
            });

            const junction = {
                [junctionForeignKeys.instanceKey]: instanceId,
                [junctionForeignKeys.itemKey]: id,
            } as TJunction;
            if (client) {
                await insertJunctionFn({ record: junction, client });
            } else {
                await insertJunctionFn({ record: junction });
            }
        }),
    );
}
