import { useLocation } from 'react-router';

import type { SortOrder } from '../types/generic';
import { parseIntOrNaN } from '../utils/parse';

type StringKeys<T> = Extract<keyof T, string>;

export type TableQuery<T> = {
    filter?: Partial<Record<keyof T, string[]>>;
    sort?: StringKeys<T>;
    order?: SortOrder;
    limit?: number;
    offset?: number;
};

export default function useTableQuery<
    T,
    TSortKeys extends readonly (keyof T)[],
>(
    validSortKeys: TSortKeys,
    defaults?: {
        limit?: number;
        sort?: TSortKeys[number];
        order?: SortOrder;
    },
): TableQuery<T> {
    const { search } = useLocation();
    const query = new URLSearchParams(search);

    const filter: Partial<Record<keyof T, string[]>> = {};

    for (const key of validSortKeys) {
        const values = query.getAll(String(key));
        filter[key] = values;
    }

    const rawSort = query.get('sort');
    const sort =
        rawSort && validSortKeys.includes(rawSort as keyof T)
            ? (rawSort as StringKeys<T>)
            : (defaults?.sort as StringKeys<T>);

    const rawOrder = query.get('order');
    const order =
        rawOrder === 'ASC' || rawOrder === 'DESC' ? rawOrder : defaults?.order;

    const rawLimit = query.get('limit');
    const parsedLimit = parseIntOrNaN(rawLimit);
    const limit = !Number.isNaN(parsedLimit) ? parsedLimit : defaults?.limit;

    const rawPage = query.get('page');
    const parsedOffset = (parseIntOrNaN(rawPage) - 1) * (limit ?? 0);
    const offset = !Number.isNaN(parsedOffset) ? parsedOffset : 0;

    return { filter, sort, order, limit, offset };
}
