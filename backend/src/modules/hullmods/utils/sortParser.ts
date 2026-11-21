import type { ColumnOrder } from '../../../db/fragments/order.ts';
import type { HullmodVersionsFullRow } from '../../../db/tables.ts';
import { parseSort } from '../../../server/parser/sortParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';

export const HULLMOD_TABLE_KEYS = [
    'display_name',
    'manufacturer',
    'cost_capital',
    'cost_cruiser',
    'cost_destroyer',
    'base_value',
] as const satisfies (keyof HullmodVersionsFullRow)[];

export function parseHullmodTableSort(
    query: ReqQuery,
): ColumnOrder<HullmodVersionsFullRow> {
    return parseSort(query, HULLMOD_TABLE_KEYS);
}
