import {
    BUILD_FULL_KEYS,
    type BuildFull,
} from '@starsector-builds/shared/builds/types';
import type { Projection } from '@starsector-builds/shared/types';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';

export function useBuildQuery(buildId: number | null) {
    const hullmodsRequest = buildApiRequest({
        endpoint: buildId ? `/api/builds/${buildId}` : null,
        params: {
            fields: buildFields(BUILD_FULL_KEYS),
        },
    });

    return useQuery({
        queryKey: ['build', buildId],
        queryFn: () =>
            fetchSafe<Projection<BuildFull, typeof BUILD_FULL_KEYS>>(
                hullmodsRequest,
            ),
        enabled: buildId != null,
    });
}
