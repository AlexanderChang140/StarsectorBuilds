import type { PaginatedResponse, Projection } from '@starsector-builds/shared/types';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';

import { WING_KEYS } from '../../constants/keys';
import { QUERY_LIMIT } from '../../constants/query';

const WING_VERSION_ID: keyof WingVersionFull = 'wing_version_id';

export default function useInstalledWingsQuery(wingVids: number[]) {
    const limit = QUERY_LIMIT;

    const request = buildApiRequest({
        endpoint: `/api/wing-versions`,
        params: {
            fields: buildFields(WING_KEYS),
            filter: {
                [WING_VERSION_ID]: {
                    values: wingVids,
                },
            },
            limit,
        },
    });

    return useQuery({
        queryKey: ['buildWings', [...wingVids].sort()],
        queryFn: () =>
            fetchSafe<
                PaginatedResponse<Projection<WingVersionFull, typeof WING_KEYS>>
            >(request),
        enabled: wingVids.length > 0,
        placeholderData: (prev) => (wingVids.length > 0 ? prev : undefined),
    });
}
