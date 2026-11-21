import { parseFields } from '../../../server/parser/fieldParser.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { MOD_COLUMNS, MOD_VERSION_FULL_COLUMNS } from '../constants.ts';

export function parseModsFields(query: ReqQuery) {
    return parseFields(query, MOD_COLUMNS);
}

export function parseModVersionsFields(query: ReqQuery) {
    return parseFields(query, MOD_VERSION_FULL_COLUMNS);
}
