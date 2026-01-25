import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import { removeArrayKeys } from '../../../utils/helpers.ts';
import {
    parseFilterWithExcludedKeys,
    type FilterableColumnKeys,
} from '../../../utils/parser/filterParser.ts';
import { WEAPON_VERSIONS_FULL_COLUMNS } from '../constants.ts';
import { WeaponVersionsFullSchema } from '../schema.ts';

const WEAPON_VERSIONS_FILTER_COLUMNS = removeArrayKeys(
    WEAPON_VERSIONS_FULL_COLUMNS,
    ['groups', 'hints', 'no_dps_tooltip', 'tags'],
) satisfies FilterableColumnKeys<DB['weapon_versions_full']>;

export function parseWeaponsVersionsFilter<
    TExcludeKeys extends
        readonly (typeof WEAPON_VERSIONS_FILTER_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys(
        query,
        WeaponVersionsFullSchema,
        WEAPON_VERSIONS_FILTER_COLUMNS,
        excludeKeys,
    );
}
