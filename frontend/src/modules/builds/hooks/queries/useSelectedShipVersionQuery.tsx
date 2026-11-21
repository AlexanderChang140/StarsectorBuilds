import type { ShipVersionFull } from '@starsector-builds/shared/ships/schema';

import useSelectedVersionQuery from '@/hooks/useSelectedVersionQuery';

import { SELECTED_SHIP_VERSION_KEYS } from '../../constants/keys';

export function useSelectedShipVersionQuery(
    shipId: number | null,
    selectedVersion: number | null,
) {
    return useSelectedVersionQuery<
        ShipVersionFull,
        typeof SELECTED_SHIP_VERSION_KEYS
    >({
        queryKey: 'selectedShipVersion',
        versionId: selectedVersion,
        versionIdKey: 'ship_version_id',
        versionKeys: SELECTED_SHIP_VERSION_KEYS,
        versionEndpoint: shipId ? `/api/ships/${shipId}/versions` : null,
    });
}
