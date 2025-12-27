import type { DB } from '../../../db/db.js';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseFields } from '../../../utils/parser/fieldParser.ts';
import { HULLMOD_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseHullmodVersionFields(query: ReqQuery) {
    return parseFields<
        DB['hullmod_versions_full'],
        typeof HULLMOD_VERSIONS_FULL_COLUMNS
    >(query, HULLMOD_VERSIONS_FULL_COLUMNS);
}
