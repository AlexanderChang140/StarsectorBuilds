import type {
    ShipVersionFull,
    ShipWeaponSlotFull,
} from '@starsector-builds/shared/ships/schema';
import type { Projection } from '@starsector-builds/shared/types';

import type { SELECTED_SHIP_VERSION_KEYS } from './constants/keys';

export type ImageSize = {
    naturalWidth: number;
    naturalHeight: number;
    displayWidth: number;
    displayHeight: number;
};

export type ShipData = Projection<
    ShipVersionFull,
    typeof SELECTED_SHIP_VERSION_KEYS
>;

export type ActiveSlot = Pick<
    ShipWeaponSlotFull,
    'weapon_slot_id' | 'weapon_size' | 'weapon_type'
>;
