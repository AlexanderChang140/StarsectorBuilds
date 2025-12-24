import type { DB } from '../../../db/db.js';
import type { ColumnOrder } from '../../../db/fragments/order.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseSort } from '../../../utils/parser/sortParser.ts';

export const HULLMOD_TABLE_KEYS = [
    'display_name',
    'manufacturer',
    'cost_capital',
    'cost_cruiser',
    'cost_destroyer',
    'base_value',
] as const satisfies (keyof DB['hullmod_versions_full'])[];

export function parseHullmodTableSort(
    query: ReqQuery,
): ColumnOrder<DB['hullmod_versions_full']> {
    return parseSort<DB['hullmod_versions_full']>(query, HULLMOD_TABLE_KEYS);
}
