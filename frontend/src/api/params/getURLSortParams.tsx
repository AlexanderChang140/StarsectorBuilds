import { isValidOrder } from '@/utils/isValidOrder';

import type { Order } from '../types';

export default function getURLSortParams<TKeys extends readonly string[]>(
    query: URLSearchParams,
    validSortKeys: TKeys,
    defaults?: {
        sortField?: TKeys[number];
        order?: Order;
    },
): {
    field?: TKeys[number];
    order?: Order;
} {
    const rawField = query.get('sort');

    const field =
        rawField && validSortKeys.includes(rawField)
            ? rawField
            : defaults?.sortField;

    const rawOrder = query.get('order');
    const order = isValidOrder(rawOrder) ? rawOrder : defaults?.order;

    return { field, order };
}
