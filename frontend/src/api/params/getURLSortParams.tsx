import type { SortOrder } from '@/types/generic';

export default function getURLSortParams<K extends readonly string[]>(
    query: URLSearchParams,
    validSortKeys: K,
    defaults?: {
        sort?: K[number];
        order?: SortOrder;
    },
): {
    sort?: K[number];
    order?: SortOrder;
} {
    const rawSort = query.get('sort');

    const sort =
        rawSort && (validSortKeys as readonly string[]).includes(rawSort)
            ? (rawSort as K[number])
            : defaults?.sort;

    const rawOrder = query.get('order');
    const order =
        rawOrder === 'ASC' || rawOrder === 'DESC' ? rawOrder : defaults?.order;

    return { sort, order };
}
