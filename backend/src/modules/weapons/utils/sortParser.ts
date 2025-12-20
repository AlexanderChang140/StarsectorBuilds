import type { WeaponVersionsFull } from '../../../db/db.js';
import type { ColumnOrder } from '../../../db/fragments/order.ts';
import type { ReqQuery } from '../../../types/generic.ts';
import { parseSort } from '../../../utils/parser/sortParser.ts';

export const WEAPON_TABLE_KEYS = [
    'display_name',
    'manufacturer',
    'weapon_type',
    'weapon_size',
    'damage_type',
    'op_cost',
    'damage_per_shot',
    'flux_per_shot',
    'damage_per_second',
    'flux_per_second',
    'emp',
    'impact',
    'max_ammo',
    'ammo_per_second',
    'reload_size',
    'turn_rate',
    'speed',
    'launch_speed',
    'flight_time',
    'beam_speed',
    'chargeup',
    'chargedown',
    'burst_size',
    'burst_delay',
    'min_spread',
    'max_spread',
    'spread_per_shot',
    'spread_decay_per_second',
    'base_value',
] as const satisfies (keyof WeaponVersionsFull)[];

export function parseWeaponTableSort(
    query: ReqQuery,
): ColumnOrder<WeaponVersionsFull> {
    return parseSort<WeaponVersionsFull>(query, WEAPON_TABLE_KEYS);
}
