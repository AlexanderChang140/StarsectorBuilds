import { SHIP_VERSION_FULL_KEYS } from '@starsector-builds/shared/ships/schema';

import type { FilterableColumnKeys } from '../../db/helpers/filter.ts';
import type { ShipVersionsFullRow } from '../../db/tables.ts';
import type { SortableColumnKeys } from '../../server/parser/sortParser.ts';
import { removeArrayKeys } from '../../utils/helpers.ts';

export const SHIP_VERSION_FULL_FILTER_KEYS = removeArrayKeys(
    SHIP_VERSION_FULL_KEYS,
    [
        'tags',
        'hints',
        'acceleration',
        'built_in_weapons',
        'built_in_wings',
        'built_in_hullmods',
    ],
) satisfies FilterableColumnKeys<ShipVersionsFullRow>;

export const SHIP_VERSION_FULL_SORT_KEYS = removeArrayKeys(
    SHIP_VERSION_FULL_KEYS,
    [
        'tags',
        'hints',
        'built_in_weapons',
        'built_in_wings',
        'built_in_hullmods',
    ],
) satisfies SortableColumnKeys<ShipVersionsFullRow>;
