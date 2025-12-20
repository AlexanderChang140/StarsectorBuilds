import type { PoolClient } from 'pg';

import { pool } from '../client.ts';
import type { DB, Generated } from '../db.js';
import { type Filter, createFilterFragment } from './filter.ts';
import type { SelectableRow } from '../../types/generic.ts';
import { createFromClause } from '../fragments/from.ts';
import { createLimitClause } from '../fragments/limit.ts';
import { createOffsetClause } from '../fragments/offset.ts';
import { createOrderClause, type ColumnOrder } from '../fragments/order.ts';
import { createSelectClause } from '../fragments/select.ts';
import { createWhereClause } from '../fragments/where.ts';

/**
 * Select multiple rows with a typed column list.
 *
 * @template TTable - Table name in the schema.
 * @template TSelection - Column keys to return from the table.
 * @param table - Target table name.
 * @param selection - Readonly array of columns to return.
 * @param options - Optional query settings (where filter, client override).
 * @returns Rows containing only the requested columns.
 */
export async function select<
    TTable extends keyof DB,
    TSelection extends keyof SelectableRow<DB[TTable]>,
    TWhereKeys extends keyof DB[TTable] = keyof DB[TTable],
>(
    table: TTable,
    selection: readonly TSelection[],
    options?: {
        where?: Pick<SelectableRow<DB[TTable]>, TWhereKeys> | undefined;
        client?: PoolClient | undefined;
    },
) {
    const { query: partial, values } = createSelectQuery(
        table,
        selection,
        options,
    );
    const query = partial + ';';

    const executor = options?.client ?? pool;
    const { rows } = await executor.query<
        Pick<SelectableRow<DB[TTable]>, TSelection>
    >(query, values);
    return rows;
}

/**
 * Build a typed select with optional allowed WHERE keys.
 *
 * @template TTable - Table name in the schema.
 * @template TSelection - Column keys to return from the table.
 * @template TWhereKey - Keys permitted in the WHERE clause.
 * @param table - Target table name.
 * @param selection - Readonly array of columns to return.
 * @param allowedKeys - Optional whitelist for WHERE keys.
 * @returns Function that executes select with optional where/client.
 */
export function makeSelect<
    TTable extends keyof DB,
    TSelection extends keyof SelectableRow<DB[TTable]>,
    TWhereKey extends keyof SelectableRow<DB[TTable]> = keyof SelectableRow<
        DB[TTable]
    >,
>(
    table: TTable,
    selection: readonly TSelection[],
    allowedKeys?: readonly TWhereKey[],
) {
    return async (options?: {
        where?: Pick<SelectableRow<DB[TTable]>, TWhereKey>;
        client?: PoolClient | undefined;
    }) => {
        const allowed: Pick<SelectableRow<DB[TTable]>, TWhereKey> | undefined =
            options?.where && allowedKeys
                ? (Object.fromEntries(
                      Object.entries(options.where).filter(([k]) =>
                          allowedKeys.includes(k as TWhereKey),
                      ),
                  ) as Pick<SelectableRow<DB[TTable]>, TWhereKey>)
                : options?.where;
        return select(table, selection, { ...options, where: allowed });
    };
}

const s = makeSelect('ship_instances', ['data_hash'], ['id']);
s({ where: { id: 1 } });

/**
 * Select a single row with a typed column list.
 *
 * @template TTable - Table name in the schema.
 * @template TSelection - Column keys to return from the table.
 * @param table - Target table name.
 * @param selection - Readonly array of columns to return.
 * @param options - Optional query settings (where filter, client override).
 * @returns The matching row or undefined.
 */
export async function selectOne<
    TTable extends keyof DB,
    TSelection extends keyof SelectableRow<DB[TTable]>,
    TWhereKeys extends keyof SelectableRow<DB[TTable]> = SelectableRow<
        keyof DB[TTable]
    >,
>(
    table: TTable,
    selection: readonly TSelection[],
    options?: {
        where?: Pick<SelectableRow<DB[TTable]>, TWhereKeys>;
        client?: PoolClient;
    },
) {
    const { query: partial, values } = createSelectQuery(
        table,
        selection,
        options,
    );
    const query = partial + 'LIMIT 1;';

    const executor = options?.client ?? pool;
    const { rows } = await executor.query<
        Pick<SelectableRow<DB[TTable]>, TSelection>
    >(query, values);
    return rows[0];
}

/**
 * Build a typed single-row selector for a table.
 *
 * @template TTable - Table name in the schema.
 * @template TSelection - Column keys to return from the table.
 * @template TWhereKeys - Keys permitted in the WHERE clause (defaults to all keys).
 * @param table - Target table name.
 * @param selection - Readonly array of columns to return.
 * @returns Function that runs the select with optional where/client.
 */
export function makeSelectOne<
    TTable extends keyof DB,
    TSelection extends keyof SelectableRow<DB[TTable]>,
    TWhereKeys extends keyof SelectableRow<DB[TTable]> = keyof SelectableRow<
        DB[TTable]
    >,
>(table: TTable, selection: readonly TSelection[]) {
    return async (options?: {
        where?: Pick<SelectableRow<DB[TTable]>, TWhereKeys>;
        client?: PoolClient;
    }) => selectOne(table, selection, options);
}

export async function selectExists<TTable extends keyof DB>(
    table: TTable,
    options?: {
        where?: Partial<DB[TTable]>;
        client?: PoolClient;
    },
): Promise<boolean> {
    const fromClause = createFromClause(table);
    const { clause: whereClause, values } = createWhereClause(options?.where);

    const query = `
        SELECT EXISTS (
            SELECT 1
            ${fromClause}
            ${whereClause}
        );
    `;
    const result = await pool.query(query, values);
    return result.rows[0]?.exists ?? false;
}

export function makeSelectExists<TTable extends keyof DB>(table: TTable) {
    return async (options?: {
        where?: Partial<DB[TTable]>;
        client?: PoolClient;
    }) => selectExists(table, options);
}

/**
 * Run a full select with optional filter/order/pagination.
 *
 * @template TFilter - Shape of the filter input.
 * @template TTable - Table name in the schema.
 * @template TRow - Row type (defaults to DB[TTable]).
 * @param table - Target table name.
 * @param selection - Readonly array of columns to return.
 * @param options - Optional filter/order/limit/offset/client settings.
 * @returns Rows containing only the requested columns.
 */
export async function selectFull<
    TFilter extends Filter,
    TTable extends keyof DB,
    TRow = DB[TTable],
>(
    table: TTable,
    selection: readonly (keyof TRow)[],
    options?: {
        filter?: TFilter;
        order?: ColumnOrder<TRow>;
        limit?: number;
        offset?: number;
        client?: PoolClient | undefined;
    },
): Promise<Pick<TRow, (typeof selection)[number]>[]> {
    const selectClause = createSelectClause(selection);
    const fromClause = createFromClause(table);

    const { clause: filterFragment, params } = createFilterFragment(
        options?.filter,
    );
    const filterClause = filterFragment ? `WHERE ${filterFragment}` : '';

    const orderClause = createOrderClause(options?.order);

    const limitClause = createLimitClause(options?.limit);
    const offsetClause = createOffsetClause(options?.offset);

    const query = `
        ${selectClause}
        ${fromClause}
        ${filterClause}
        ${orderClause}
        ${limitClause}
        ${offsetClause};
    `;

    const executor = options?.client ? options.client : pool;
    const result = await executor.query<Pick<TRow, (typeof selection)[number]>>(
        query,
        params,
    );
    return result.rows;
}

/**
 * Build a reusable full-select function with optional filter/order/pagination.
 *
 * @template TFilter - Shape of the filter input.
 * @template TTable - Table name in the schema.
 * @template TRow - Row type (defaults to DB[TTable]).
 * @param table - Target table name.
 * @param selection - Readonly array of columns to return.
 * @returns Function that executes selectFull with optional settings.
 */
export function makeSelectFull<
    TFilter extends Filter,
    TTable extends keyof DB,
    TRow = DB[TTable],
>(table: TTable, selection: readonly (keyof TRow)[]) {
    return async (options?: {
        filter?: TFilter;
        order?: ColumnOrder<TRow>;
        limit?: number;
        offset?: number;
        client?: PoolClient | undefined;
    }) => selectFull(table, selection, options);
}

/**
 * Higher-order helper that builds filtered select functions.
 *
 * @template TFilter - Shape of the filter input.
 * @returns Factory that accepts table and columns, producing a filtered select function.
 */
export function makeSelectFullWithFilter<TFilter extends Filter>() {
    return function <TTable extends keyof DB, TRow = DB[TTable]>(
        table: TTable,
        selection: readonly (keyof TRow)[],
    ) {
        return async (options?: {
            filter?: TFilter;
            order?: ColumnOrder<TRow>;
            limit?: number;
            offset?: number;
            client?: PoolClient;
        }) => {
            return selectFull(table, selection, options);
        };
    };
}

type TableWithIdCode = {
    [K in keyof DB]: DB[K] extends { id: Generated<number>; code: string }
        ? K
        : never;
}[keyof DB];

/**
 * Select rows with id/code and map codes to ids.
 *
 * @template TTable - Table that has numeric id and string code columns.
 * @param table - Target table name.
 * @param client - Optional database client override.
 * @returns Mapping of code to id.
 */
export async function selectCodeIdRecord<TTable extends TableWithIdCode>(
    table: TTable,
    client?: PoolClient,
) {
    const selection = ['id', 'code'] as const;
    const options = client ? { client } : {};
    const rows = await select(table, selection, options);
    return rows.reduce((acc, row) => {
        acc[row.code] = row.id;
        return acc;
    }, {} as Record<string, number>);
}

/**
 * Build a helper that returns the code→id map for a table.
 *
 * @template TTable - Table that has numeric id and string code columns.
 * @param table - Target table name.
 * @returns Function that executes selectCodeIdRecord with optional client.
 */
export function makeSelectCodeIdRecord<TTable extends TableWithIdCode>(
    table: TTable,
) {
    return async (client?: PoolClient) => selectCodeIdRecord(table, client);
}

function createSelectQuery<
    TTable extends keyof DB,
    TSelection extends keyof SelectableRow<DB[TTable]>,
    TWhereKeys extends keyof SelectableRow<DB[TTable]> = keyof SelectableRow<
        DB[TTable]
    >,
>(
    table: TTable,
    selection: readonly TSelection[],
    options?: {
        where?: Pick<SelectableRow<DB[TTable]>, TWhereKeys> | undefined;
        order?: ColumnOrder<DB[TTable]>;
        limit?: number;
        offset?: number;
    },
) {
    const selectClause = createSelectClause(selection);
    const fromClause = createFromClause(table);
    const { clause: whereClause, values } = createWhereClause(options?.where);
    const query = `
        ${selectClause}
        ${fromClause}
        ${whereClause}
    `;
    return { query, values };
}
