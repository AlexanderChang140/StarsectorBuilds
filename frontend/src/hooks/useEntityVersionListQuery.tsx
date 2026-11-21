import type { PaginatedResponse, Projection } from '@starsector-builds/shared/types';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';
import type { ApiEndpoint } from '@/api/types';

type VersionData = {
    major: number;
    minor: number;
    patch: string;
};

interface UseVersionListQueryProps<
    TData extends VersionData,
    TKeys extends (keyof TData)[],
> {
    queryKey: string;
    entityId: number;
    versionKeys: TKeys;
    versionEndpoint: ApiEndpoint;
    limit?: number;
}

export default function useEntityVersionListQuery<
    TData extends VersionData,
    TKeys extends (keyof TData)[],
>({
    queryKey,
    entityId,
    versionKeys,
    versionEndpoint,
    limit = 20,
}: UseVersionListQueryProps<TData, TKeys>) {
    const versionListRequest = buildApiRequest({
        endpoint: versionEndpoint,
        params: {
            fields: buildFields<TData>(versionKeys),
            sort: [
                ['major', 'ASC'],
                ['minor', 'ASC'],
                ['patch', 'ASC'],
            ],
            limit,
        },
    });
    const versionListQuery = useQuery<
        PaginatedResponse<Projection<TData, typeof versionKeys>>
    >({
        queryKey: [queryKey, entityId],
        queryFn: () =>
            fetchSafe<PaginatedResponse<Projection<TData, typeof versionKeys>>>(
                versionListRequest,
            ),
    });
    return versionListQuery;
}
