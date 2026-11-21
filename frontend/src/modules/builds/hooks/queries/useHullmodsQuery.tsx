import type { HullmodVersionFull } from '@starsector-builds/shared/hullmods/types';
import type {
    PaginatedResponse,
    Projection,
} from '@starsector-builds/shared/types';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';

import { HULLMOD_KEYS } from '../../constants/keys';
import { QUERY_LIMIT } from '../../constants/query';

const MOD_VERSION_ID: keyof HullmodVersionFull = 'mod_version_id';

export default function useHullmodsQuery(
    modVersionIds: number[],
    pageIndex: number,
) {
    const limit = QUERY_LIMIT;

    const hullmodsRequest = buildApiRequest({
        endpoint: '/api/hullmod-versions',
        params: {
            fields: buildFields(HULLMOD_KEYS),
            filter: {
                [MOD_VERSION_ID]: {
                    values: modVersionIds,
                },
                hide: { values: [false] },
            },
            limit,
            offset: pageIndex * limit,
        },
    });

    return useQuery({
        queryKey: ['buildHullmods', hullmodsRequest],
        queryFn: () =>
            fetchSafe<
                PaginatedResponse<
                    Projection<HullmodVersionFull, typeof HULLMOD_KEYS>
                >
            >(hullmodsRequest),
        enabled: modVersionIds.length > 0,
        placeholderData: (prev) =>
            modVersionIds.length > 0 ? prev : undefined,
    });
}
