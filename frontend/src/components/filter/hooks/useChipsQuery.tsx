import type { PaginatedResponse } from '@shared/types';
import { type UseQueryResult, useQueries } from '@tanstack/react-query';

import { buildApiRequest } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';
import type { ApiEndpoint } from '@/api/types';
import { typedEntries } from '@/utils/object';

import type { ChipState } from './useChipFilterState';

export default function useChipsQuery<
    TCategory,
    TChip,
    TChipKeys extends readonly (keyof TChip)[],
>(
    queryKey: string,
    endpoint: ApiEndpoint,
    fieldKeys: TChipKeys,
    categoryKey: keyof TChip,
    chips: Record<string, ChipState<TCategory>>,
) {
    const chipsRequests = Object.fromEntries(
        typedEntries(chips).map(([categoryValue]) => [
            categoryValue,
            buildApiRequest({
                endpoint: endpoint,
                params: {
                    [categoryKey]: categoryValue,
                    fields: fieldKeys.join(','),
                },
            }),
        ]),
    );

    const chipsQueries: UseQueryResult<PaginatedResponse<TChip>>[] = useQueries(
        {
            queries: typedEntries(chipsRequests).map(
                ([categoryValue, request]) => ({
                    queryKey: [queryKey, categoryValue],
                    queryFn: () => fetchSafe(request),
                    keepPreviousData: true,
                }),
            ),
        },
    );

    return { categoryValues: Object.keys(chipsRequests), chipsQueries };
}
