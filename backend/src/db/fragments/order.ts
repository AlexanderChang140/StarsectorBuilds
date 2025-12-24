import type { Entries } from '../../types/generic.ts';
import type { DB } from '../db.js';
import type { Order } from '../types.ts';

export type ColumnOrder<T> = Partial<Record<keyof T, Order>>;

export function createOrderClause<TTable extends keyof DB>(
    columns: ColumnOrder<DB[TTable]> | undefined,
) {
    if (columns === undefined || Object.keys(columns).length === 0) {
        return '';
    }

    const fragment = createOrderFragment<TTable>(columns);
    const clause = `ORDER BY ${fragment}`;
    return clause;
}

export function createOrderFragment<TTable extends keyof DB>(
    columns: ColumnOrder<DB[TTable]> | undefined,
): string {
    if (columns === undefined) {
        return '';
    }

    const columnFragments: string[] = [];
    for (const [col, order] of Object.entries(columns) as Entries<
        ColumnOrder<DB[TTable]>
    >) {
        columnFragments.push(`${String(col)} ${order}`);
    }
    const clause = columnFragments.join(', ');
    return clause;
}

export function createOrderFragmentWithAliases<TTable extends keyof DB>(
    aliases: Record<string, ColumnOrder<TTable> | undefined>,
): string {
    const columnFragments: string[] = [];
    for (const [alias, columns] of Object.entries(aliases)) {
        if (!columns) continue;
        for (const [column, order] of Object.entries(columns) as Entries<
            ColumnOrder<TTable>
        >)
            columnFragments.push(`${alias}.${String(column)} ${order}`);
    }
    const clause = columnFragments.join(', ');
    return clause;
}
