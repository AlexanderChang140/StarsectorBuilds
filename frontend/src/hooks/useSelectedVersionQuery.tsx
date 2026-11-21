import type { ApiResponse, Projection } from '@starsector-builds/shared/types';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';
import type { ApiEndpoint, ControlParams } from '@/api/types';

type VersionData = {
    major: number;
    minor: number;
    patch: string;
};

interface UseSelectedVersionQueryProps<
    TData extends VersionData,
    TKeys extends (keyof TData)[],
> {
    queryKey: string;
    versionId: number | undefined | null;
    versionIdKey: TKeys[number];
    versionKeys: TKeys;
    versionEndpoint: ApiEndpoint | null;
}

export default function useSelectedVersionQuery<
    TData extends VersionData,
    TKeys extends (keyof TData)[],
>({
    queryKey,
    versionId,
    versionIdKey,
    versionKeys,
    versionEndpoint,
}: UseSelectedVersionQueryProps<TData, TKeys>) {
    const options: Partial<ControlParams> =
        versionId != null
            ? { filter: { [versionIdKey]: { values: [versionId] } } }
            : {
                  sort: [
                      ['major', 'ASC'],
                      ['minor', 'ASC'],
                      ['patch', 'ASC'],
                  ],
                  limit: 1,
              };

    const versionRequest = buildApiRequest({
        endpoint: versionEndpoint,
        params: {
            fields: buildFields(versionKeys),
            ...options,
        },
    });

    const versionKey = versionId !== null ? versionId : 'latest';
    const versionQuery = useQuery({
        queryKey: [queryKey, versionKey],
        queryFn: async () => {
            const res =
                await fetchSafe<
                    ApiResponse<Projection<TData, typeof versionKeys>[]>
                >(versionRequest);
            return res.data[0] ?? null;
        },
        enabled: versionEndpoint != null,
    });

    return versionQuery;
}
