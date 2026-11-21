import type { PaginatedResponse, Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';

import { WEAPON_KEYS } from '../../constants/keys';
import { QUERY_LIMIT } from '../../constants/query';

const WEAPON_VERSION_ID: keyof WeaponVersionFull = 'weapon_version_id';

export default function useInstalledWeaponsQuery(weaponVersionIds: number[]) {
    const limit = QUERY_LIMIT;

    const request = buildApiRequest({
        endpoint: `/api/weapon-versions`,
        params: {
            fields: buildFields(WEAPON_KEYS),
            filter: {
                [WEAPON_VERSION_ID]: {
                    values: weaponVersionIds,
                },
            },
            limit,
        },
    });

    return useQuery({
        queryKey: ['buildWeapons', [...weaponVersionIds].sort()],
        queryFn: () =>
            fetchSafe<
                PaginatedResponse<
                    Projection<WeaponVersionFull, typeof WEAPON_KEYS>
                >
            >(request),
        enabled: weaponVersionIds.length > 0,
        placeholderData: (prev) =>
            weaponVersionIds.length > 0 ? prev : undefined,
    });
}
