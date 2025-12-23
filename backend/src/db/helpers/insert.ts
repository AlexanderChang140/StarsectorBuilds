import type { PoolClient } from 'pg';

import { pool } from '../client.ts';
import type { DB } from '../db.js';
import { createFromClause } from '../fragments/from.ts';
import { createWhereClause } from '../fragments/where.ts';
import type { InsertableRow, SelectableRow, Inserted } from '../types.ts';

/**
 * Insert a row with conflict handling (returns existing on conflict).
 *
 * @template TTable - Target table name.
 * @param table - Table to insert into.
 * @param args - Insert settings.
 * @param args.record - Row to insert.
 * @param args.conflictKeys - Columns that trigger conflict handling (default none).
 * @param args.returnKeys - Columns to return (default RETURNING 1).
 * @param args.client - Optional DB client (defaults to pool).
 * @returns Inserted or existing row plus `inserted` flag.
 * @throws If no row is inserted or found.
 */
export async function insert<TTable extends keyof DB>(
    table: TTable,
    args: {
        record: InsertableRow<DB[TTable]>;
        conflictKeys?: readonly (keyof InsertableRow<DB[TTable]>)[] | undefined;
        returnKeys?: readonly (keyof SelectableRow<DB[TTable]>)[] | undefined;
        client?: PoolClient | undefined;
    },
): Promise<SelectableRow<DB[TTable]> & Inserted> {
    const { record, conflictKeys = [], returnKeys = [], client } = args;

    const keys = Object.keys(record) as (keyof InsertableRow<DB[TTable]>)[];
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

    const where = conflictKeys.reduce((acc, key) => {
        acc[key] = record[key];
        return acc;
    }, {} as Record<(typeof conflictKeys)[number], InsertableRow<DB[TTable]>[keyof InsertableRow<DB[TTable]>]>);

    const { clause: whereClause, values: whereValues } = createWhereClause(
        where,
        keys.length + 1,
    );

    const fromClause = createFromClause(table);

    const query = `
        WITH ins AS (
            INSERT INTO ${table} (${columns})
            VALUES (${placeholders})
            ${conflictClause}
            ${returningClause}
        )
        SELECT ${returnKeys}${
        returnKeys.length ? ',' : ''
    } TRUE AS inserted FROM ins
        UNION ALL
        SELECT ${returnKeys}${returnKeys.length ? ',' : ''} FALSE AS inserted
        ${fromClause}
        ${whereClause}
        LIMIT 1;
    `;

    const executor = client ?? pool;
    const { rows } = await executor.query<SelectableRow<DB[TTable]> & Inserted>(
        query,
        [...values, ...whereValues],
    );

    if (!rows[0]) {
        throw new Error(
            `Failed to insert or find record ${record} in ${table}`,
        );
    }
    return rows[0];
}

/**
 * Build a typed insert helper with conflict handling.
 *
 * @template TTable - Target table name.
 * @param table - Table to insert into.
 * @param conflictKeys - Columns that trigger conflict handling.
 * @returns Function that runs the insert with optional client.
 */
export function makeInsert<TTable extends keyof DB>(
    table: TTable,
    conflictKeys?: (keyof InsertableRow<DB[TTable]>)[] | undefined,
) {
    return async (args: {
        record: InsertableRow<DB[TTable]>;
        client?: PoolClient | undefined;
    }): Promise<SelectableRow<DB[TTable]> & Inserted> => {
        return insert(table, {
            ...args,
            conflictKeys,
        });
    };
}

/**
 * Build a typed insert helper with conflict handling.
 *
 * @template TTable - Target table name.
 * @param table - Table to insert into.
 * @param conflictKeys - Columns that trigger conflict handling.
 * @returns Function that runs the insert with optional return keys/client.
 */
export function makeInsertReturn<TTable extends keyof DB>(
    table: TTable,
    conflictKeys?: (keyof InsertableRow<DB[TTable]>)[] | undefined,
) {
    return async (args: {
        record: InsertableRow<DB[TTable]>;
        returnKeys?: readonly (keyof SelectableRow<DB[TTable]>)[] | undefined;
        client?: PoolClient | undefined;
    }): Promise<SelectableRow<DB[TTable]> & Inserted> => {
        return insert(table, {
            ...args,
            conflictKeys,
        });
    };
}

/**
 * Insert many items and their junction rows (many-to-many helper).
 *
 * @template TItem - Item code type.
 * @template TJunction - Junction row shape.
 * @param items - Item codes to insert.
 * @param instanceId - Parent instance id.
 * @param insertItemFn - Inserts an item and returns its id.
 * @param insertJunctionFn - Inserts a junction row.
 * @param junctionForeignKeys - Keys in the junction row for instance/item.
 * @param client - Optional DB client.
 * @returns Promise when all inserts complete.
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
) {
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
