import { WeaponVersionFullSchema } from '@starsector-builds/shared/weapons/schema';

import { parseFilterWithExcludedKeys } from '../../../server/parser/filterParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { WEAPON_VERSIONS_FILTER_COLUMNS } from '../constants.ts';

export function parseWeaponsVersionsFilter<
    TExcludeKeys extends
        readonly (typeof WEAPON_VERSIONS_FILTER_COLUMNS)[number][],
>(query: ReqQuery, excludeKeys?: TExcludeKeys) {
    return parseFilterWithExcludedKeys(
        query,
        WeaponVersionFullSchema,
        WEAPON_VERSIONS_FILTER_COLUMNS,
        excludeKeys,
    );
}
