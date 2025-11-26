import type { ColumnOrder } from '../../db/helpers/order.ts';
import type { ReqQuery } from '../../types/generic.ts';

export function parseSort<T>(
    query: ReqQuery,
    validKeys: (keyof T)[],
): ColumnOrder<T> {
    for (const key of validKeys) {
        const value = String(query[key as string])?.toUpperCase();
        if (value === 'ASC' || value === 'DESC') {
            return { [key]: value } as ColumnOrder<T>;
        }
    }
    return {};
}
