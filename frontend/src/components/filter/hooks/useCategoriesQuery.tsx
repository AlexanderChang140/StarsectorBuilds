import type { PaginatedResponse } from '@shared/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { buildApiRequest } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';
import type { ApiEndpoint } from '@/api/types';

interface UseCategoriesQueryProps<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
> {
    input: string;
    exclude: string[];
    excludeKey: TCategoryKeys[number];
    filterKey: TCategoryKeys[number];
    queryKey: string;
    endpoint: ApiEndpoint;
    fieldKeys: TCategoryKeys;
}

export default function useCategoriesQuery<
    TCategory,
    TCategoryKeys extends readonly (keyof TCategory)[],
>({
    input,
    exclude,
    excludeKey,
    filterKey,
    queryKey,
    endpoint,
    fieldKeys,
}: UseCategoriesQueryProps<TCategory, TCategoryKeys>) {
    const categoriesSearchQuery = buildApiRequest({
        endpoint,
        params: {
            filter: {
                [String(filterKey)]: {
                    values: [input],
                    match: 'starts_with',
                },
                [excludeKey]: {
                    values: exclude,
                    not: true,
                },
            },
            fields: fieldKeys.join(','),
        },
    });

    return useQuery<PaginatedResponse<TCategory>>({
        queryKey: [queryKey, input, [...exclude].sort()],
        queryFn: () => fetchSafe(categoriesSearchQuery),
        placeholderData: keepPreviousData,
    });
}
