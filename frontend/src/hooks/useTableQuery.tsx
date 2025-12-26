import { useLocation } from 'react-router';

import type { SortOrder } from '../types/generic';
import { parseIntOrNaN } from '../utils/parse';

export type TableQuery<T> = {
    filter?: Partial<Record<keyof T, string[]>>;
    sort?: keyof T;
    order?: SortOrder;
    limit?: number;
    offset?: number;
};

export function buildQueryString<T extends object | undefined>(query?: T) {
    if (!query) return '';
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
        } else if (value != null) {
            params.set(key, String(value));
        }
    });
    return params.toString();
}

export default function useTableQuery<T>(
    validSortKeys: readonly (keyof T)[],
    defaults?: {
        limit?: number;
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
            ? (rawSort as keyof T)
            : undefined;

    const rawOrder = query.get('order');
    const order =
        rawOrder === 'ASC' || rawOrder === 'DESC' ? rawOrder : undefined;

    const rawLimit = query.get('limit');
    const parsedLimit = parseIntOrNaN(rawLimit);
    const limit = !Number.isNaN(parsedLimit) ? parsedLimit : defaults?.limit;

    const rawPage = query.get('page');
    const parsedOffset = (parseIntOrNaN(rawPage) - 1) * (limit ?? 0);
    const offset = !Number.isNaN(parsedOffset) ? parsedOffset : undefined;

    return { filter, sort, order, limit, offset };
}
