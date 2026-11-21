import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';

import type { ShipSize } from '@/types/ship';

const MAX_FLUX_ITEM_MAP: Record<ShipSize, number> = {
    frigate: 10,
    destroyer: 20,
    cruiser: 40,
    capital_ship: 50,
};

export function getMaxFluxItems(shipSize: string | undefined) {
    if (!shipSize) {
        return 0;
    }
    return MAX_FLUX_ITEM_MAP[shipSize.toLowerCase() as ShipSize] ?? 0;
}

export function getCapacity(capacitors: number) {
    return capacitors * 200;
}

export function getDissipation(vents: number) {
    return vents * 10;
}

export function calculateWeaponFluxUpkeep(
    weapons: Projection<
        WeaponVersionFull,
        ['flux_per_second', 'flux_per_shot', 'burst_delay', 'burst_size']
    >[],
) {
    return weapons.reduce((upkeep, w) => {
        if (w.flux_per_second) {
            return upkeep + w.flux_per_second;
        }

        if (w.flux_per_shot) {
            const burstDelay = w.burst_delay ?? 1;
            const burstSize = w.burst_size ?? 1;
            return upkeep + (w.flux_per_shot * burstSize) / burstDelay;
        }

        return upkeep;
    }, 0);
}
