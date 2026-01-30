import type { DB } from '../../../db/db.js';
import type { ColumnOrder } from '../../../db/fragments/order.ts';
import {
    parseSort,
    type SortableColumnKeys,
} from '../../../server/parser/sortParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { removeArrayKeys } from '../../../utils/helpers.ts';
import { WEAPON_VERSIONS_FULL_COLUMNS } from '../constants.ts';

const WEAPON_VERSIONS_SORT_COLUMNS = removeArrayKeys(
    WEAPON_VERSIONS_FULL_COLUMNS,
    ['tags', 'hints', 'groups', 'no_dps_tooltip'],
) satisfies SortableColumnKeys<DB['weapon_versions_full']>;

export function parseWeaponVersionsSort(
    query: ReqQuery,
): ColumnOrder<DB['weapon_versions_full']> {
    return parseSort(query, WEAPON_VERSIONS_SORT_COLUMNS);
}
