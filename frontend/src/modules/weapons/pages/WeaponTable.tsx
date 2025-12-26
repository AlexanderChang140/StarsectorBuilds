import type { WeaponVersionDTO } from '@shared/weapons/types';

import { DataTable } from '../../../components/table/DataTable';
import { humanizeKeys } from '../../../utils/humanizeKeys';

export default function WeaponTable() {
    return DataTable<WeaponVersionDTO, typeof keyOrder>({
        endpoint: '/api/weapons/table',
        displayMap,
        keyOrder,
        initialSort: { sortField: 'display_name', sortOrder: 'ASC' },
        link: {
            linkField: 'display_name',
            linkFn: (row) => `/weapons/${Number(row.weapon_id)}`,
        },
        title: 'Weapons',
    });
}

const keyOrder: (keyof WeaponVersionDTO)[] = [
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
];

const displayMap = humanizeKeys(keyOrder);
