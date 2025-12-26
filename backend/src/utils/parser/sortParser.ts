import type { ColumnOrder } from '../../db/fragments/order.ts';
import type { ReqQuery } from '../../types/generic.ts';

export function parseSort<T>(
    query: ReqQuery,
    validKeys: readonly (keyof T)[],
): ColumnOrder<T> {
    const sort = String(query.sort);
    const order = String(query.order);

    if (
        validKeys.includes(sort as keyof T) &&
        ['ASC', 'DESC'].includes(order)
    ) {
        return { [sort]: order } as ColumnOrder<T>;
    }
    return {};
}
