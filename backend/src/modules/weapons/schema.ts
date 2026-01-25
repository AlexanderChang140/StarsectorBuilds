import { z } from 'zod';

import type { DB } from '../../db/db.js';
import type { SelectableRow } from '../../db/types.ts';
import { schemaForTable } from '../../utils/zod.ts';

export const WeaponVersionsFullSchema = schemaForTable<
    SelectableRow<DB['weapon_versions_full']>
>()(
    z.object({
        accuracy_str: z.coerce.string().nullable(),
        ammo_per_second: z.coerce.string().nullable(),
        autofire_accuracy_bonus: z.coerce.number().nullable(),
        base_value: z.coerce.number().nullable(),
        beam_speed: z.coerce.number().nullable(),

        burst_delay: z.coerce.string().nullable(),
        burst_size: z.coerce.string().nullable(),
        chargedown: z.coerce.string().nullable(),
        chargeup: z.coerce.string().nullable(),

        custom_ancillary: z.coerce.string().nullable(),
        custom_ancillary_hl: z.coerce.string().nullable(),
        custom_primary: z.coerce.string().nullable(),
        custom_primary_hl: z.coerce.string().nullable(),

        damage_per_second: z.coerce.number().nullable(),
        damage_per_shot: z.coerce.number().nullable(),
        damage_type: z.coerce.string().nullable(),
        damage_type_id: z.coerce.number().nullable(),

        data_hash: z.coerce.string().nullable(),
        display_name: z.coerce.string().nullable(),

        emp: z.coerce.number().nullable(),
        extra_arc_for_ai: z.coerce.number().nullable(),

        flight_time: z.coerce.string().nullable(),
        flux_per_second: z.coerce.string().nullable(),
        flux_per_shot: z.coerce.string().nullable(),

        groups: z.array(z.coerce.string()).nullable(),
        hints: z.array(z.coerce.string()).nullable(),

        hitpoints: z.coerce.number().nullable(),
        impact: z.coerce.number().nullable(),
        launch_speed: z.coerce.number().nullable(),

        major: z.coerce.number().nullable(),
        manufacturer: z.coerce.string().nullable(),

        max_ammo: z.coerce.number().nullable(),
        max_spread: z.coerce.string().nullable(),
        min_spread: z.coerce.string().nullable(),

        minor: z.coerce.number().nullable(),

        mod_id: z.coerce.number().nullable(),
        mod_name: z.coerce.string().nullable(),
        mod_version_id: z.coerce.number().nullable(),

        no_dps_tooltip: z.coerce.boolean().nullable(),

        op_cost: z.coerce.number().nullable(),
        patch: z.coerce.string().nullable(),

        primary_role_str: z.coerce.string().nullable(),
        proj_speed_str: z.coerce.string().nullable(),

        reload_size: z.coerce.number().nullable(),
        speed: z.coerce.number().nullable(),

        spread_decay_per_second: z.coerce.string().nullable(),
        spread_per_shot: z.coerce.string().nullable(),

        tags: z.array(z.coerce.string()).nullable(),

        text1: z.coerce.string().nullable(),
        text2: z.coerce.string().nullable(),

        tracking_str: z.coerce.string().nullable(),

        turn_rate: z.coerce.string().nullable(),
        turn_rate_str: z.coerce.string().nullable(),

        turret_gun_image_file_path: z.coerce.string().nullable(),
        turret_image_file_path: z.coerce.string().nullable(),

        weapon_code: z.coerce.string().nullable(),
        weapon_id: z.coerce.number().nullable(),
        weapon_instance_id: z.coerce.number().nullable(),

        weapon_range: z.coerce.number().nullable(),

        weapon_size: z.coerce.string().nullable(),
        weapon_size_id: z.coerce.number().nullable(),

        weapon_type: z.coerce.string().nullable(),
        weapon_type_id: z.coerce.number().nullable(),

        weapon_version_id: z.coerce.number().nullable(),
    }),
);
