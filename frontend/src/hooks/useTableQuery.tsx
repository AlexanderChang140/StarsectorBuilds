import { useLocation } from 'react-router';
import type { Entries, SortOrder } from '../types/generic';

type TableQuery<T> = {
    filter?: Partial<Record<keyof T, string[]>>;
    sort?: keyof T;
    order?: SortOrder;
    limit?: number;
    offset?: number;
};

export default function useTableQuery<T>(
    validSortKeys: (keyof T)[],
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
            ? (rawSort as keyof T)
            : undefined;

    const rawOrder = query.get('order');
    const order =
        rawOrder === 'ASC' || rawOrder === 'DESC' ? rawOrder : undefined;

    const rawLimit = query.get('limit');
    const limit =
        rawLimit && !isNaN(Number(rawLimit)) ? Number(rawLimit) : undefined;

    const rawOffset = query.get('offset');
    const offset =
        rawOffset && !isNaN(Number(rawOffset)) ? Number(rawOffset) : undefined;
    return { filter, sort, order, limit, offset };
}

export function buildTableQuery<T>(params: {
    filter?: Partial<Record<keyof T, string[]>>;
    sort?: keyof T;
    order?: SortOrder;
    limit?: number;
    offset?: number;
}) {
    const query = new URLSearchParams();

    if (params.filter) {
        for (const [key, values] of Object.entries(params.filter) as Entries<
            Partial<Record<keyof T, string[]>>
        >) {
            if (!values) continue;
            for (const v of values) {
                query.append(String(key), v);
            }
        }
    }

    if (params.sort) query.set('sort', params.sort as string);
    if (params.order) query.set('order', params.order);
    if (params.limit != null) query.set('limit', params.limit.toString());
    if (params.offset != null) query.set('offset', params.offset.toString());

    return query.toString();
}
