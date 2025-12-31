import type { DB } from '../../db/db.js';

export const SHIP_VERSIONS_FULL_COLUMNS = [
    'ship_version_id',
    'ship_image_file_path',

    'mod_version_id',
    'major',
    'minor',
    'patch',

    'mod_id',
    'mod_name',

    'ship_instance_id',
    'ship_id',
    'ship_code',
    'data_hash',

    'ship_size_id',
    'shield_type_id',
    'ship_system_id',

    'ship_size',
    'shield_type',
    'ship_system',

    'hitpoints',
    'armor_rating',
    'max_flux',
    'flux_dissipation',
    'op_cost',
    'fighter_bays',
    'max_speed',
    'acceleration',
    'deceleration',
    'max_turn_rate',
    'turn_acceleration',
    'mass',

    'display_name',
    'manufacturer',
    'designation',
    'base_value',

    'text1',
    'text2',

    'x',
    'y',

    'min_crew',
    'max_crew',
    'max_cargo',
    'max_fuel',
    'fuel_per_ly',
    'cr_recovery',
    'cr_deployment_cost',
    'peak_cr_sec',
    'cr_loss_per_sec',

    'shield_arc',
    'shield_upkeep',
    'shield_efficiency',

    'phase_cost',
    'phase_upkeep',

    'hints',
    'tags',
] as const satisfies readonly (keyof DB['ship_versions_full'])[];
