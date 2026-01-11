import type { DB } from '../../../db/db.js';
import type { ColumnOrder } from '../../../db/fragments/order.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseSort } from '../../../utils/parser/sortParser.ts';
import { MOD_COLUMNS, MOD_VERSION_FULL_COLUMNS } from '../constants.ts';

export function parseModsSort(query: ReqQuery): ColumnOrder<DB['mods']> {
    return parseSort<DB['mods']>(query, MOD_COLUMNS);
}

export function parseModVersionsSort(
    query: ReqQuery,
): ColumnOrder<DB['mod_versions_full']> {
    return parseSort<DB['mod_versions_full']>(query, MOD_VERSION_FULL_COLUMNS);
}
