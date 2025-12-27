import type { WeaponVersionsFull } from '../../../db/db.js';
import type { ColumnOrder } from '../../../db/fragments/order.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseSort } from '../../../utils/parser/sortParser.ts';
import { WEAPON_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseWeaponVersionsSort(
    query: ReqQuery,
): ColumnOrder<WeaponVersionsFull> {
    return parseSort<WeaponVersionsFull>(query, WEAPON_VERSIONS_FULL_COLUMNS);
}
