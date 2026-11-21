import type { PaginatedResponse, Projection } from '@starsector-builds/shared/types';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';
import type { Sort } from '@/api/types';

import { WING_KEYS } from '../../constants/keys';
import { QUERY_LIMIT } from '../../constants/query';

const MOD_VERSION_ID: keyof WingVersionFull = 'mod_version_id';

export default function useWingsQuery(
    modVersionIds: number[],
    pageIndex: number,
) {
    const limit = QUERY_LIMIT;

    const sort: Sort<(typeof WING_KEYS)[number]>[] = [['op_cost', 'DESC']];

    const wingsRequest = buildApiRequest({
        endpoint: '/api/wing-versions',
        params: {
            fields: buildFields(WING_KEYS),
            filter: {
                [MOD_VERSION_ID]: {
                    values: modVersionIds,
                },
            },
            sort,
            limit,
            offset: pageIndex * limit,
        },
    });

    return useQuery({
        queryKey: ['buildWings', wingsRequest],
        queryFn: () =>
            fetchSafe<
                PaginatedResponse<Projection<WingVersionFull, typeof WING_KEYS>>
            >(wingsRequest),
        enabled: modVersionIds.length > 0,
        placeholderData: (prev) =>
            modVersionIds.length > 0 ? prev : undefined,
    });
}
