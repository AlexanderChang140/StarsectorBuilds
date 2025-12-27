import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseFilterWithExcludedKeys } from '../../../utils/parser/filterParser.ts';
import { SHIP_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseShipVersionsFilter<
    TExcludeKeys extends readonly (typeof SHIP_VERSIONS_FULL_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys<
        DB['ship_versions_full'],
        typeof SHIP_VERSIONS_FULL_COLUMNS,
        TExcludeKeys
    >(query, SHIP_VERSIONS_FULL_COLUMNS, excludeKeys);
}
