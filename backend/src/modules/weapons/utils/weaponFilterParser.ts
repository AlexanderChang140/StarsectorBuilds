import type { ReqQuery } from '../../../types/generic.ts';
import {
    parseFilter,
    parseIntArray,
} from '../../../utils/parser/filterParser.ts';
import {
    type WeaponTableFilter,
    WEAPON_TABLE_FILTER_KEYS,
    type WeaponDisplayFilter,
    WEAPON_DISPLAY_FILTER_KEYS,
} from '../types/filter.ts';

export function parseWeaponTableFilter(query: ReqQuery): WeaponTableFilter {
    return parseFilter(query, WEAPON_TABLE_FILTER_KEYS, parseIntArray);
}

export function parseWeaponDisplayFilter(query: ReqQuery): WeaponDisplayFilter {
    return parseFilter(query, WEAPON_DISPLAY_FILTER_KEYS, parseIntArray);
}
