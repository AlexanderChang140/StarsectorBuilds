import type { DB } from '../../../db/db.js';
import { parseFields } from '../../../server/parser/fieldParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { SHIP_VERSIONS_FULL_COLUMNS } from '../constants.ts';

export function parseShipVersionFields(query: ReqQuery) {
    return parseFields<
        DB['ship_versions_full'],
        typeof SHIP_VERSIONS_FULL_COLUMNS
    >(query, SHIP_VERSIONS_FULL_COLUMNS);
}
