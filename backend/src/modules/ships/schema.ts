import z from 'zod';

import type { DB } from '../../db/db.js';
import type { SelectableRow } from '../../db/types.ts';
import { schemaForTable } from '../../utils/zod.ts';

export const ShipVersionsFullSchema = schemaForTable<
    SelectableRow<DB['ship_versions_full']>
>()(
    z.object({
        acceleration: z.coerce.number().nullable(),
        armor_rating: z.coerce.number().nullable(),
        base_value: z.coerce.number().nullable(),
        cr_deployment_cost: z.coerce.number().nullable(),

        cr_loss_per_sec: z.coerce.string().nullable(),
        cr_recovery: z.coerce.string().nullable(),

        data_hash: z.coerce.string().nullable(),
        deceleration: z.coerce.number().nullable(),
        designation: z.coerce.string().nullable(),
        display_name: z.coerce.string().nullable(),
        fighter_bays: z.coerce.number().nullable(),
        flux_dissipation: z.coerce.number().nullable(),

        fuel_per_ly: z.coerce.string().nullable(),
        hints: z.array(z.coerce.string()).nullable(),

        hitpoints: z.coerce.number().nullable(),
        major: z.coerce.number().nullable(),
        manufacturer: z.coerce.string().nullable(),
        mass: z.coerce.number().nullable(),
        max_cargo: z.coerce.number().nullable(),
        max_crew: z.coerce.number().nullable(),
        max_flux: z.coerce.number().nullable(),
        max_fuel: z.coerce.number().nullable(),
        max_speed: z.coerce.number().nullable(),
        max_turn_rate: z.coerce.number().nullable(),
        min_crew: z.coerce.number().nullable(),
        minor: z.coerce.number().nullable(),

        mod_id: z.coerce.number().nullable(),
        mod_name: z.coerce.string().nullable(),
        mod_version_id: z.coerce.number().nullable(),
        op_cost: z.coerce.number().nullable(),
        patch: z.coerce.string().nullable(),
        peak_cr_sec: z.coerce.number().nullable(),
        phase_cost: z.coerce.number().nullable(),
        phase_upkeep: z.coerce.number().nullable(),
        shield_arc: z.coerce.number().nullable(),

        shield_efficiency: z.coerce.string().nullable(),
        shield_type: z.coerce.string().nullable(),
        shield_type_id: z.coerce.number().nullable(),
        shield_upkeep: z.coerce.string().nullable(),

        ship_code: z.coerce.string().nullable(),
        ship_id: z.coerce.number().nullable(),
        ship_image_file_path: z.coerce.string().nullable(),
        ship_instance_id: z.coerce.number().nullable(),
        ship_size: z.coerce.string().nullable(),
        ship_size_id: z.coerce.number().nullable(),
        ship_system: z.coerce.string().nullable(),
        ship_system_id: z.coerce.number().nullable(),
        ship_version_id: z.coerce.number().nullable(),

        tags: z.array(z.coerce.string()).nullable(),
        text1: z.coerce.string().nullable(),
        text2: z.coerce.string().nullable(),

        turn_acceleration: z.coerce.number().nullable(),
        x: z.coerce.string().nullable(),
        y: z.coerce.string().nullable(),
    }),
);
