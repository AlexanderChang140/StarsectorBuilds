import { useLocation } from 'react-router';

import getURLFilterParams from '@/api/params/getURLFilterParams';
import getURLPagination from '@/api/params/getURLPaginationParams';
import getURLSortParams from '@/api/params/getURLSortParams';
import type { SortOrder } from '@/types/generic';

export default function useTableParams<K extends readonly string[]>(
    validSortKeys: K,
    defaults?: {
        limit?: number;
        sort?: K[number];
        order?: SortOrder;
    },
) {
    const { search } = useLocation();
    const query = new URLSearchParams(search);

    const filter = getURLFilterParams(query, validSortKeys);

    const { sort, order } = getURLSortParams(query, validSortKeys, {
        sort: defaults?.sort,
        order: defaults?.order,
    });

    const { limit, offset } = getURLPagination(query, defaults?.limit);

    return { filter, sort, order, limit, offset };
}
