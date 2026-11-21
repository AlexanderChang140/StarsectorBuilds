import type { Entries } from '../../types/generic.ts';
import type { Table } from '../tables.ts';
import type { Order } from '../types.ts';

export type ColumnOrder<T> = {
    field: keyof T;
    order: Order;
}[];

export function createOrderClause<TTable extends keyof Table>(
    columns: ColumnOrder<Table[TTable]> | undefined,
    isNullsLast: boolean = true,
) {
    if (columns === undefined || Object.keys(columns).length === 0) {
        return '';
    }

    const fragment = createOrderFragment<TTable>(columns);
    const nullsLast = isNullsLast ? ' NULLS LAST' : '';
    const clause = `ORDER BY ${fragment}${nullsLast}`;
    return clause;
}

export function createOrderFragment<TTable extends keyof Table>(
    columns: ColumnOrder<Table[TTable]> | undefined,
): string {
    if (columns === undefined) {
        return '';
    }

    const columnFragments: string[] = [];
    columns.forEach(({ field, order }) => {
        columnFragments.push(`${String(field)} ${order}`);
    });

    const clause = columnFragments.join(', ');
    return clause;
}

export function createOrderFragmentWithAliases<TTable extends keyof Table>(
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
