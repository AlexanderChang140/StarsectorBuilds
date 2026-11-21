import type { PoolClient } from 'pg';

import { pool } from '../client.ts';
import type { Filter } from './filter.ts';
import { createWhereClause } from '../fragments/where.ts';
import type { Table } from '../tables.ts';

export async function deleteRow<TTable extends keyof Table>(
    table: TTable,
    where: Filter<Table[TTable]>,
    options?: {
        client?: PoolClient | undefined;
    },
) {
    const { clause: whereClause, values } = createWhereClause(where);
    const query = `DELETE FROM ${table} ${whereClause}`;
    const executor = options?.client ?? pool;
    const result = await executor.query(query, values);

    return result.rowCount != 0;
}
