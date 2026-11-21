import { WEAPON_VERSION_FULL_KEYS } from '@starsector-builds/shared/weapons/schema';

import type { WeaponVersionsFullRow } from '../../db/tables.ts';
import type { FilterableColumnKeys } from '../../db/helpers/filter.ts';
import { removeArrayKeys } from '../../utils/helpers.ts';

export const WEAPON_TYPE_LIST = [
    'BALLISTIC',
    'ENERGY',
    'MISSILE',
    'HYBRID',
    'COMPOSITE',
    'SYNERGY',
    'UNIVERSAL',
    'LAUNCH_BAY',
    'SYSTEM',
    'DECORATIVE',
    'BUILT_IN',
    'STATION_MODULE',
] as const;

export const WEAPON_VERSIONS_FILTER_COLUMNS = removeArrayKeys(
    WEAPON_VERSION_FULL_KEYS,
    ['groups', 'hints', 'no_dps_tooltip', 'tags'],
) satisfies FilterableColumnKeys<WeaponVersionsFullRow>;
