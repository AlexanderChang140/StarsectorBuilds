import { useLocation } from 'react-router';

import getURLFilterParams from '@/api/params/getURLFilterParams';
import getURLPagination from '@/api/params/getURLPaginationParams';
import getURLSortParams from '@/api/params/getURLSortParams';
import type { Order } from '@/api/types';

export default function useTableParams<TKeys extends readonly string[]>(
    validSortKeys: TKeys,
    defaults?: {
        limit?: number;
        sort?: TKeys[number];
        order?: Order;
    },
) {
    const { search } = useLocation();
    const query = new URLSearchParams(search);

    const filter = getURLFilterParams(query, validSortKeys);

    const { field: sortField, order } = getURLSortParams(query, validSortKeys, {
        sortField: defaults?.sort,
        order: defaults?.order,
    });

    const { limit, offset } = getURLPagination(query, defaults?.limit);

    return { filter, sortField, order, limit, offset };
}
