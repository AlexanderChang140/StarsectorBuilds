import type { DB } from '../../../db/db.js';
import type { ColumnOrder } from '../../../db/fragments/order.ts';
import {
    parseSort,
    type SortableColumnKeys,
} from '../../../server/parser/sortParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { removeArrayKeys } from '../../../utils/helpers.ts';
import { MOD_COLUMNS, MOD_VERSION_FULL_COLUMNS } from '../constants.ts';

export function parseModsSort(query: ReqQuery): ColumnOrder<DB['mods']> {
    return parseSort<DB['mods']>(query, MOD_COLUMNS);
}

const MOD_VERSION_SORT_COLUMNS = removeArrayKeys(MOD_VERSION_FULL_COLUMNS, [
    'data_changed',
]) satisfies SortableColumnKeys<DB['mod_versions_full']>;

export function parseModVersionsSort(
    query: ReqQuery,
): ColumnOrder<DB['mod_versions_full']> {
    return parseSort<DB['mod_versions_full']>(query, MOD_VERSION_SORT_COLUMNS);
}
