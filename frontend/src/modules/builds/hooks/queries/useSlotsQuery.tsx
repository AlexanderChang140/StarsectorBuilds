import {
    SHIP_WEAPON_SLOT_FULL_KEYS,
    type ShipWeaponSlotFull,
} from '@starsector-builds/shared/ships/schema';
import type { ApiResponse, Projection } from '@starsector-builds/shared/types';
import { useQuery } from '@tanstack/react-query';

import { buildApiRequest, buildFields } from '@/api/apiRequestBuilder';
import fetchSafe from '@/api/fetchSafe';

import { SHIP_WEAPON_SLOT_KEYS } from '../../constants/keys';

export default function useSlotsQuery(shipVid: number | null) {
    const shipWeaponSlotQuery = useQuery({
        queryKey: ['buildSlots', shipVid],
        queryFn: async () => {
            if (shipVid == null) {
                throw new Error('Missing ship ID');
            }
            const shipWeaponSlotsRequest = buildApiRequest({
                endpoint: `/api/ship-versions/${shipVid}/slots`,
                params: {
                    fields: buildFields(SHIP_WEAPON_SLOT_FULL_KEYS),
                },
            });
            const res = await fetchSafe<
                ApiResponse<
                    Projection<
                        ShipWeaponSlotFull,
                        typeof SHIP_WEAPON_SLOT_KEYS
                    >[]
                >
            >(shipWeaponSlotsRequest);
            return res;
        },
        enabled: shipVid != null,
    });

    return shipWeaponSlotQuery;
}
