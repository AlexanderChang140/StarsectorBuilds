import type { Projection } from '@starsector-builds/shared/types';
import type { Generated } from 'kysely';
import type { PoolClient } from 'pg';

import { pool } from '../client.ts';
import {
    createFilterFragment,
    type Filter,
    type FilterableKeys,
} from './filter.ts';
import { createFromClause } from '../fragments/from.ts';
import { createLimitClause } from '../fragments/limit.ts';
import { createOffsetClause } from '../fragments/offset.ts';
import { createOrderClause } from '../fragments/order.ts';
import { createSelectClause } from '../fragments/select.ts';
import { createWhereClause } from '../fragments/where.ts';
import type { Table } from '../tables.ts';
import type {
    FilterableRow,
    Options,
    SelectableRow,
    Selection,
} from '../types.ts';

/**
 * Run a select with optional filter/order/pagination.
 *
 * @template TTable - Table name in the schema.
 * @template TSelection - Column keys to return from the table.
 * @param table - Target table name.
 * @param selection - Readonly array of columns to return.
 * @param options - Optional filter/order/limit/offset/client settings.
 * @returns Rows containing only the requested columns.
 */
export async function select<
    TTable extends keyof Table,
    TSelection extends Selection<SelectableRow<Table[TTable]>>,
>(
    table: TTable,
    selection: TSelection,
    options?: Options<Table[TTable]> | undefined,
): Promise<Projection<SelectableRow<Table[TTable]>, TSelection>[]> {
    const selectClause = createSelectClause(selection);
    const fromClause = createFromClause(table);
    const { clause: filterFragment, params } = createFilterFragment(
        options?.filter,
    );
    const filterClause = filterFragment ? `WHERE ${filterFragment}` : '';

    const orderClause = createOrderClause<TTable>(
        options?.order,
        options?.isNullsLast,
    );

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
    const result = await executor.query(query, params);
    return result.rows;
}

/**
 * Build a typed select query factory with optional allowed FILTER keys.
 *
 * @template TTable Table name in the schema.
 * @template TAllowedKeys Keys permitted in the filter clause.
 * @param table Table name.
 * @param allowedKeys Optional whitelist for filterable keys.
 * @returns Function that executes selectFull with optional restricted filters/options.
 */
export function makeSelect<
    TTable extends keyof Table,
    TAllowedKeys extends FilterableKeys<FilterableRow<Table[TTable]>>,
    TSelection extends Selection<SelectableRow<Table[TTable]>>,
>(table: TTable, allowedKeys?: readonly TAllowedKeys[]) {
    return async (
        selection: TSelection,
        options?: Options<Table[TTable]> | undefined,
    ) => {
        const filtered =
            options?.filter && allowedKeys
                ? (Object.fromEntries(
                      Object.entries(options.filter).filter(([k]) =>
                          (allowedKeys as readonly string[]).includes(k),
                      ),
                  ) as Filter<FilterableRow<Table[TTable]>>) 
                : options?.filter;

        return select(table, selection, {
            ...options,
            filter: filtered,
        });
    };
}

/**
 * Select a single row with a typed column list.
 *
 * @template TTable - Table name in the schema.
 * @param table - Target table name.
 * @param selection - Readonly array of columns to return.
 * @param options - Optional query settings (where filter, client override).
 * @returns The matching row or undefined.
 */
export async function selectOne<
    TTable extends keyof Table,
    TSelection extends Selection<SelectableRow<Table[TTable]>>,
>(
    table: TTable,
    selection: TSelection,
    options?: Options<Table[TTable]> | undefined,
): Promise<Projection<SelectableRow<Table[TTable]>, TSelection> | undefined> {
    return (
        await select(table, selection, {
            ...options,
            limit: 1,
        })
    )[0];
}

/**
 * Build a typed single-row selector for a table.
 *
 * @template TTable - Table name in the schema.
 * @param table - Target table name.
 * @param selection - Readonly array of columns to return.
 * @returns Function that runs the select with optional where/client.
 */
export function makeSelectOne<
    TTable extends keyof Table,
    TSelection extends Selection<SelectableRow<Table[TTable]>>,
>(table: TTable, selection: TSelection) {
    return async (options?: {
        where?: Filter<Table[TTable]>;
        client?: PoolClient;
    }) => selectOne(table, selection, options);
}

export async function selectExists<TTable extends keyof Table>(
    table: TTable,
    options?: {
        where?: Filter<Table[TTable]>;
        client?: PoolClient | undefined;
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
    const executor = options?.client ?? pool;
    const result = await executor.query(query, values);
    return result.rows[0]?.exists ?? false;
}

export function makeSelectExists<TTable extends keyof Table>(table: TTable) {
    return async (options?: {
        where?: Filter<Table[TTable]>;
        client?: PoolClient | undefined;
    }) => selectExists(table, options);
}

export type PaginatedResult<T> = {
    rows: T[];
    total: number;
};

export async function selectWithCount<
    TTable extends keyof Table,
    TSelection extends Selection<SelectableRow<Table[TTable]>>,
>(
    table: TTable,
    selection: TSelection,
    options?: Options<Table[TTable]>,
): Promise<
    PaginatedResult<Projection<SelectableRow<Table[TTable]>, TSelection>>
> {
    const selectClause = createSelectClause(selection);
    const fromClause = createFromClause(table);
    const { clause: filterFragment, params } = createFilterFragment(
        options?.filter,
    );
    const filterClause = filterFragment ? `WHERE ${filterFragment}` : '';
    const orderClause = createOrderClause<TTable>(options?.order);
    const limitClause = createLimitClause(options?.limit);
    const offsetClause = createOffsetClause(options?.offset);

    const query = `
        SELECT *,
               COUNT(*) OVER() AS __total_count
        FROM (
            ${selectClause}
            ${fromClause}
            ${filterClause}
            ${orderClause}
        ) base
        ${limitClause}
        ${offsetClause};
    `;

    const executor = options?.client ?? pool;
    const result = await executor.query<
        Projection<SelectableRow<Table[TTable]>, TSelection> & {
            __total_count: number;
        }
    >(query, params);
    const rows = result.rows.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ __total_count, ...row }) => row,
    ) as Projection<SelectableRow<Table[TTable]>, TSelection>[];
    const total = result.rows[0]?.__total_count ?? 0;

    return { rows, total };
}

type TableWithIdCode = {
    [K in keyof Table]: Table[K] extends { id: Generated<number>; code: string }
        ? K
        : never;
}[keyof Table];

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
    const options = client ? { client } : {};
    const rows = await select(table, ['id', 'code'], options);
    return rows.reduce(
        (acc, row) => {
            if (row.code != null && row.id != null) {
                acc[String(row.code)] = Number(row.id);
            }
            return acc;
        },
        {} as Record<string, number>,
    );
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
