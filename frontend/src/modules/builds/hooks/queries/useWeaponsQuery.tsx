import type { PaginatedResponse, Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';
import type { Filter, Sort } from '@/api/types';

import type { ActiveSlot } from '../../types';
import { WEAPON_KEYS } from '../../constants/keys';
import { QUERY_LIMIT } from '../../constants/query';
import { expandWeaponSize, expandWeaponType } from '../../utils/weapons';

const MOD_VERSION_ID: keyof WeaponVersionFull = 'mod_version_id';
const WEAPON_SIZE: keyof WeaponVersionFull = 'weapon_size';
const WEAPON_TYPE: keyof WeaponVersionFull = 'weapon_type';

export default function useWeaponsQuery(
    modVersionIds: number[],
    activeSlot: ActiveSlot | null,
    pageIndex: number,
) {
    const limit = QUERY_LIMIT;

    const slotFilters: Record<string, Filter> = activeSlot
        ? {
              [WEAPON_SIZE]: {
                  values: expandWeaponSize(activeSlot.weapon_size),
              },
              [WEAPON_TYPE]: {
                  values: expandWeaponType(activeSlot.weapon_type),
              },
          }
        : {};

    const sort: Sort<(typeof WEAPON_KEYS)[number]>[] = [
        ['weapon_size_id', 'DESC'], ['op_cost', 'DESC']
    ];

    const weaponsRequest = buildApiRequest({
        endpoint: `/api/weapon-versions`,
        params: {
            fields: buildFields(WEAPON_KEYS),
            filter: {
                [MOD_VERSION_ID]: {
                    values: modVersionIds,
                },
                ...slotFilters,
            },
            sort,
            limit,
            offset: pageIndex * limit,
        },
    });

    return useQuery({
        queryKey: ['buildWeapons', weaponsRequest],
        queryFn: () =>
            fetchSafe<
                PaginatedResponse<
                    Projection<WeaponVersionFull, typeof WEAPON_KEYS>
                >
            >(weaponsRequest),
        enabled: modVersionIds.length > 0,
        placeholderData: (prev) =>
            modVersionIds.length > 0 ? prev : undefined,
    });
}
