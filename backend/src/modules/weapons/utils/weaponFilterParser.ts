import type { ReqQuery } from '../../../types/generic.ts';
import { parseFilter } from '../../../utils/parser/filterParser.ts';
import {
    type WeaponTableFilter,
    WEAPON_TABLE_FILTER_KEYS,
    type WeaponDisplayFilter,
    WEAPON_DISPLAY_FILTER_KEYS,
} from '../types/filter.ts';

export function parseWeaponTableFilter(query: ReqQuery): WeaponTableFilter {
    const mapping = (_: keyof WeaponTableFilter, values: unknown[]) =>
        values
            .filter((v): v is string => typeof v === 'string')
            .map((v) => parseInt(v, 10))
            .filter((v) => !isNaN(v));

    return parseFilter(query, WEAPON_TABLE_FILTER_KEYS, mapping);
}

export function parseWeaponDisplayFilter(query: ReqQuery): WeaponDisplayFilter {
    const mapping = (_: keyof WeaponDisplayFilter, values: unknown[]) =>
        values
            .filter((v): v is string => typeof v === 'string')
            .map((v) => parseInt(v, 10))
            .filter((v) => !isNaN(v));

    return parseFilter(query, WEAPON_DISPLAY_FILTER_KEYS, mapping);
}
