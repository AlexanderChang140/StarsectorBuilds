import type { SortOrder } from '@/types/generic';

type StringKeys<T> = Extract<keyof T, string>;

export default function getSortParams<
    T,
    TSortKeys extends readonly (keyof T)[],
>(
    query: URLSearchParams,
    validSortKeys: TSortKeys,
    defaults?: {
        sort?: TSortKeys[number];
        order?: SortOrder;
    },
) {
    const rawSort = query.get('sort');
    const sort =
        rawSort && validSortKeys.includes(rawSort as keyof T)
            ? (rawSort as StringKeys<T>)
            : (defaults?.sort as StringKeys<T>);

    const rawOrder = query.get('order');
    const order =
        rawOrder === 'ASC' || rawOrder === 'DESC' ? rawOrder : defaults?.order;

    return { sort, order };
}
