import type { Entries, Order } from '../../types/generic.ts';

export type ColumnOrder<T> = Partial<Record<keyof T, Order>>;

export function createOrder<T>(columns: ColumnOrder<T> | undefined): string {
    if (!columns) return '';

    const columnFragments: string[] = [];
    for (const [col, order] of Object.entries(columns) as Entries<
        ColumnOrder<T>
    >) {
        columnFragments.push(`${String(col)} ${order}`);
    }
    const clause = columnFragments.join(', ');
    return clause;
}

export function createOrderWithAliases<T>(
    aliases: Record<string, ColumnOrder<T> | undefined>,
): string {
    const columnFragments: string[] = [];
    for (const [alias, columns] of Object.entries(aliases)) {
        if (!columns) continue;
        for (const [column, order] of Object.entries(columns) as Entries<
            ColumnOrder<T>
        >)
            columnFragments.push(`${alias}.${String(column)} ${order}`);
    }
    const clause = columnFragments.join(', ');
    return clause;
}
