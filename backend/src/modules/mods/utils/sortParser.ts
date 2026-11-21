import type { ColumnOrder } from '../../../db/fragments/order.ts';
import type { ModsRow, ModVersionsFullRow } from '../../../db/tables.ts';
import {
    parseSort,
    type SortableColumnKeys,
} from '../../../server/parser/sortParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { removeArrayKeys } from '../../../utils/helpers.ts';
import { MOD_COLUMNS, MOD_VERSION_FULL_COLUMNS } from '../constants.ts';

export function parseModsSort(query: ReqQuery): ColumnOrder<ModsRow> {
    return parseSort<ModsRow>(query, MOD_COLUMNS);
}

const MOD_VERSION_SORT_COLUMNS = removeArrayKeys(MOD_VERSION_FULL_COLUMNS, [
    'data_changed',
]) satisfies SortableColumnKeys<ModVersionsFullRow>;

export function parseModVersionsSort(
    query: ReqQuery,
): ColumnOrder<ModVersionsFullRow> {
    return parseSort<ModVersionsFullRow>(query, MOD_VERSION_SORT_COLUMNS);
}
