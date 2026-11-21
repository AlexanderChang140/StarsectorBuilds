import type { PaginatedResponse } from '@starsector-builds/shared/types';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, normalizeQueryParams } from '../apiRequestBuilder';
import fetchSafe from '../fetchSafe';
import type { ApiEndpoint, ControlParams } from '../types';

interface UsePaginatedQueryProps {
    endpoint: ApiEndpoint;
    resourceKey: string;
    params: Partial<ControlParams>;
    isEnabled?: boolean;
}

export function usePaginatedQuery<T>({
    endpoint,
    resourceKey,
    params,
    isEnabled = true,
}: UsePaginatedQueryProps) {
    const request = buildApiRequest({
        endpoint,
        params,
    });
    const key = normalizeQueryParams(params) ?? null;
    const query = useQuery({
        queryKey: [resourceKey, key],
        queryFn: () => fetchSafe<PaginatedResponse<T>>(request),
        enabled: isEnabled,
    });

    return {
        data: query.data?.data ?? [],
        total: query.data?.meta.total ?? 0,
        isPending: query.isPending,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
    };
}
