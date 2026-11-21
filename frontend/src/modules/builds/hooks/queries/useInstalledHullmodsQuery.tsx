import type { HullmodVersionFull } from '@starsector-builds/shared/hullmods/types';
import type { PaginatedResponse, Projection } from '@starsector-builds/shared/types';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';

import { HULLMOD_KEYS } from '../../constants/keys';
import { QUERY_LIMIT } from '../../constants/query';

const HULLMOD_VERSION_ID: keyof HullmodVersionFull = 'hullmod_version_id';

export default function useInstalledHullmodsQuery(hullmodVersionIds: number[]) {
    const limit = QUERY_LIMIT;

    const request = buildApiRequest({
        endpoint: `/api/hullmod-versions`,
        params: {
            fields: buildFields(HULLMOD_KEYS),
            filter: {
                [HULLMOD_VERSION_ID]: {
                    values: hullmodVersionIds,
                },
                hide: { values: [false] },
            },
            limit,
        },
    });

    return useQuery({
        queryKey: ['buildHullmods', [...hullmodVersionIds].sort()],
        queryFn: () =>
            fetchSafe<
                PaginatedResponse<
                    Projection<HullmodVersionFull, typeof HULLMOD_KEYS>
                >
            >(request),
        enabled: hullmodVersionIds.length > 0,
        placeholderData: (prev) =>
            hullmodVersionIds.length > 0 ? prev : undefined,
    });
}
