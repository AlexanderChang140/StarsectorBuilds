import { useLocation } from 'react-router';

import type { SortOrder } from '@/types/generic';
import getFilterParams from '@/utils/query/getFilterParams';
import getPagination from '@/utils/query/getPaginationParams';
import getSortParams from '@/utils/query/getSortParams';

type StringKeys<T> = Extract<keyof T, string>;

export type TableQuery<T> = {
    filter?: Partial<Record<keyof T, string[]>>;
    sort?: StringKeys<T>;
    order?: SortOrder;
    limit?: number;
    offset?: number;
};

export default function useTableParams<
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

    const filter = getFilterParams<T, TSortKeys>(query, validSortKeys);

    const { sort, order } = getSortParams<T, TSortKeys>(query, validSortKeys, {
        sort: defaults?.sort,
        order: defaults?.order,
    });

    const { limit, offset } = getPagination(query, defaults?.limit);

    return { filter, sort, order, limit, offset };
}
