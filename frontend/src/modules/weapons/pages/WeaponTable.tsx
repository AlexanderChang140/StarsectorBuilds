import {
    WEAPON_TABLE_ROW_KEYS,
    type WeaponTableRows,
} from '@/modules/weapons/types';
import { DataTable } from '@/pages/DataTable/DataTable';
import { humanizeKeys } from '@/utils/humanizeKeys';

export default function WeaponTable() {
    return DataTable<
        WeaponTableRows,
        typeof WEAPON_TABLE_ROW_KEYS,
        typeof KEY_ORDER
    >({
        dataConfig: {
            endpoint: '/api/weapon-versions',
            queryKey: 'weaponsTable',
            initialSort: { sortField: 'display_name', sortOrder: 'ASC' },
        },
        tableConfig: {
            tableKeys: WEAPON_TABLE_ROW_KEYS,
            keyOrder: KEY_ORDER,
            displayMap,
        },
        link: {
            linkField: 'display_name',
            linkFn: (row) =>
                `/weapons/${Number(row.weapon_id)}/version/${Number(
                    row.weapon_version_id,
                )}`,
        },
        title: 'Weapons',
    });
}

const KEY_ORDER = [
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
    'weapon_range',
    'turn_rate',
    'speed',
    'launch_speed',
    'flight_time',
    'hitpoints',
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
] as const satisfies readonly (keyof WeaponTableRows)[];

const displayMap = humanizeKeys(KEY_ORDER);
