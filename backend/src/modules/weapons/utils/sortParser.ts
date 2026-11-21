import { WEAPON_VERSION_FULL_KEYS } from '@starsector-builds/shared/weapons/schema';

import type { ColumnOrder } from '../../../db/fragments/order.ts';
import type { WeaponVersionsFullRow } from '../../../db/tables.ts';
import {
    parseSort,
    type SortableColumnKeys,
} from '../../../server/parser/sortParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { removeArrayKeys } from '../../../utils/helpers.ts';

const WEAPON_VERSIONS_SORT_COLUMNS = removeArrayKeys(WEAPON_VERSION_FULL_KEYS, [
    'tags',
    'hints',
    'groups',
    'no_dps_tooltip',
]) satisfies SortableColumnKeys<WeaponVersionsFullRow>;

export function parseWeaponVersionsSort(
    query: ReqQuery,
): ColumnOrder<WeaponVersionsFullRow> {
    return parseSort(query, WEAPON_VERSIONS_SORT_COLUMNS);
}
