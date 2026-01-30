import type { WeaponVersionsFull } from '../../../db/db.js';
import type { ColumnOrder } from '../../../db/fragments/order.ts';
import { parseSort } from '../../../server/parser/sortParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { WEAPON_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseWeaponVersionsSort(
    query: ReqQuery,
): ColumnOrder<WeaponVersionsFull> {
    return parseSort<WeaponVersionsFull>(query, WEAPON_VERSIONS_FULL_COLUMNS);
}
