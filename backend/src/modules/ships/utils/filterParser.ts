import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import { removeArrayKeys } from '../../../utils/helpers.ts';
import {
    parseFilterWithExcludedKeys,
    type FilterableColumnKeys,
} from '../../../utils/parser/filterParser.ts';
import { SHIP_VERSIONS_FULL_COLUMNS } from '../constants.ts';
import { ShipVersionsFullSchema } from '../schema.ts';

const SHIP_VERSIONS_FILTER_COLUMNS = removeArrayKeys(
    SHIP_VERSIONS_FULL_COLUMNS,
    ['tags', 'hints', 'acceleration'],
) satisfies FilterableColumnKeys<DB['ship_versions_full']>;

export function parseShipVersionsFilter<
    TExcludeKeys extends
        readonly (typeof SHIP_VERSIONS_FILTER_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys(
        query,
        ShipVersionsFullSchema,
        SHIP_VERSIONS_FILTER_COLUMNS,
        excludeKeys,
    );
}
