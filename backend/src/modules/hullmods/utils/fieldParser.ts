import type { DB } from '../../../db/db.js';
import { parseFields } from '../../../server/parser/fieldParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { HULLMOD_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseHullmodVersionFields(query: ReqQuery) {
    return parseFields<
        DB['hullmod_versions_full'],
        typeof HULLMOD_VERSIONS_FULL_COLUMNS
    >(query, HULLMOD_VERSIONS_FULL_COLUMNS);
}
