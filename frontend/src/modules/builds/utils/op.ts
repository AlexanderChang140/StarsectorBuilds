import type { HullmodVersionFull } from '@starsector-builds/shared/hullmods/types';
import type { Projection } from '@starsector-builds/shared/types';
import type { WeaponVersionFull } from '@starsector-builds/shared/weapons/schema';
import type { WingVersionFull } from '@starsector-builds/shared/wings/schema';

import type { ShipSize } from '@/types/ship';

export function calculateOp({
    weapons,
    wings,
    hullmods,
    shipSize,
    capacitors,
    vents,
}: {
    weapons: Projection<WeaponVersionFull, ['op_cost']>[];
    wings: Projection<WingVersionFull, ['op_cost']>[];
    hullmods: Projection<HullmodVersionFull, HullmodOpCostKeys>[];
    shipSize: ShipSize;
    capacitors: number;
    vents: number;
}) {
    return (
        weapons.reduce((acc, weapon) => acc + (weapon.op_cost ?? 0), 0) +
        hullmods.reduce(
            (acc, hullmod) => acc + getHullmodOpCost(shipSize, hullmod),
            0,
        ) +
        wings.reduce((acc, wing) => acc + wing.op_cost, 0) +
        capacitors +
        vents
    );
}

export type HullmodOpCostKeys = [
    'cost_frigate',
    'cost_destroyer',
    'cost_cruiser',
    'cost_capital',
];

export function getHullmodOpCost(
    shipSize: ShipSize,
    costs: Projection<HullmodVersionFull, HullmodOpCostKeys>,
) {
    shipSize = shipSize.toLowerCase() as ShipSize;
    if (shipSize === 'frigate') {
        return costs.cost_frigate;
    } else if (shipSize === 'destroyer') {
        return costs.cost_destroyer;
    } else if (shipSize === 'cruiser') {
        return costs.cost_cruiser;
    } else if (shipSize === 'capital_ship') {
        return costs.cost_capital;
    } else {
        return 0;
    }
}
