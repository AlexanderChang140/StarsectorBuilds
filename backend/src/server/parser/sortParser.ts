import type { ColumnOrder } from '../../db/fragments/order.ts';
import type { SelectableRow } from '../../db/types.ts';
import type { QueryParam, ReqQuery } from '../../types/generic.ts';

export type SortKeys<T> = {
    [K in keyof T]: T[K] extends string | number | null ? K : never;
}[keyof T];

export type SortableColumnKeys<T> = readonly SortKeys<SelectableRow<T>>[];

export function parseSort<
    TData extends Record<string, unknown>,
    TKeys extends readonly SortKeys<TData>[],
>(query: ReqQuery, validKeys: TKeys): ColumnOrder<TData> {
    const rawSort = parseStringArray(query.sort).map((s) => {
        const [field, order] = s.split(':');
        return { field, order };
    });

    const sort = rawSort.filter(
        ({ field, order }) =>
            field &&
            validKeys.includes(field as TKeys[number]) &&
            order &&
            ['ASC', 'DESC'].includes(order),
    );

    return sort as ColumnOrder<TData>;
}

function parseStringArray(value: QueryParam): string[] {
    if (typeof value === 'string') return [value];

    if (Array.isArray(value)) {
        return value.filter((v): v is string => typeof v === 'string');
    }

    return [];
}
