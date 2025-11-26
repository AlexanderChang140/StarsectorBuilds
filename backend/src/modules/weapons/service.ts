import type { FullWeaponVersion } from './types/combined.ts';
import type {
    InsertedWeaponText,
    WeaponText,
    InsertedWeaponDesc,
    WeaponDesc,
} from './types/desc.ts';
import type { WeaponFilter } from './types/filter.ts';
import type {
    InsertedWeapon,
    Weapon,
    InsertedWeaponInstance,
    WeaponInstance,
    InsertedWeaponVersion,
    WeaponVersion,
} from './types/instance.ts';
import type {
    InsertedWeaponHintJunction,
    WeaponHintJunction,
    InsertedWeaponTagJunction,
    WeaponTagJunction,
    InsertedWeaponGroupJunction,
    WeaponGroupJunction,
} from './types/junction.ts';
import type {
    InsertedProjWeapon,
    ProjWeapon,
    InsertedAmmoWeapon,
    AmmoWeapon,
    InsertedBeamWeapon,
    BeamWeapon,
} from './types/projectile.ts';
import type {
    InsertedWeaponSpecs,
    WeaponSpecs,
    InsertedWeaponStats,
    WeaponStats,
} from './types/stats.ts';
import { pool } from '../../db/client.ts';
import { createFilterWithAliases } from '../../db/helpers/filter.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    createOrderWithAliases,
    type ColumnOrder,
} from '../../db/helpers/order.ts';
import {
    makeSelectCodeIdRecord,
    makeSelectOne,
} from '../../db/helpers/select.ts';
import type { Code, CodeTable } from '../../types/generic.ts';

export async function getFullWeaponVersions(options: {
    filter?: WeaponFilter;
    order?: ColumnOrder<FullWeaponVersion>;
    limit?: number;
    offset?: number;
}): Promise<FullWeaponVersion[]> {
    const { clause: filterPartial, params } = createFilterWithAliases({
        w: options.filter,
    });
    const filterClause = filterPartial ? `WHERE ${filterPartial}` : '';
    const orderPartial = createOrderWithAliases({ w: options.order });
    const orderClause = orderPartial ? `ORDER BY ${orderPartial}` : '';

    const limitClause = options.limit ? `LIMIT ${options.limit}` : '';
    const offsetClause = options.offset ? `OFFSET ${options.offset}` : '';

    const query = `
        SELECT
            w.weapon_version_id,
            w.turret_image_file_path,
            w.turret_gun_image_file_path,

            w.mod_version_id,
            w.major,
            w.minor,
            w.patch,

            w.mod_id,
            w.mod_name,

            w.weapon_instance_id,
            w.weapon_id,
            
            w.weapon_type_id,
            w.weapon_size_id,
            w.damage_type_id,

            w.weapon_type,
            w.weapon_size,
            w.damage_type,

            w.weapon_range,
            w.damage_per_shot,
            w.emp,
            w.impact,
            w.turn_rate,
            w.op_cost,
            w.flux_per_shot,
            w.chargeup,
            w.chargedown,
            w.burst_size,
            w.burst_delay,
            w.min_spread,
            w.max_spread,
            w.spread_per_shot,
            w.spread_decay_per_second,
            w.autofire_accuracy_bonus,
            w.extra_arc_for_ai,
            w.base_value,
            w.speed,
            w.launch_speed,
            w.flight_time,
            w.hitpoints,
            w.max_ammo,
            w.ammo_per_second,
            w.reload_size,
            w.beam_speed,
            w.damage_per_second,
            w.flux_per_second,
            w.display_name,
            w.manufacturer,
            w.primary_role_str,
            w.proj_speed_str,
            w.tracking_str,
            w.turn_rate_str,
            w.accuracy_str,
            w.custom_primary,
            w.custom_primary_hl,
            w.custom_ancillary,
            w.custom_ancillary_hl,
            w.no_dps_tooltip,
            w.text1,
            w.text2,
            w.hints,
            w.tags,
            w.groups
        FROM weapon_versions_full w
        ${filterClause}
        ${orderClause}
        ${limitClause}
        ${offsetClause};
    `;
    const result = await pool.query<FullWeaponVersion>(query, params);
    return result.rows;
}

export const getWeaponId = makeSelectOne<Weapon, 'id', Pick<Weapon, 'code'>>(
    'weapons',
    ['id'],
);

export const getWeaponTypes = makeSelectCodeIdRecord('weapon_types');

export const getWeaponSizes = makeSelectCodeIdRecord('weapon_sizes');

export const getDamageTypes = makeSelectCodeIdRecord('damage_types');

export const insertWeapon = makeInsertReturn<InsertedWeapon, Weapon>(
    'weapons',
    ['mod_id', 'code'],
);

export const insertWeaponInstance = makeInsertReturn<
    InsertedWeaponInstance,
    WeaponInstance
>('weapon_instances', ['data_hash']);

export const insertWeaponVersion = makeInsertReturn<
    InsertedWeaponVersion,
    WeaponVersion
>('weapon_versions', ['mod_version_id', 'weapon_id']);

export const insertWeaponSpecs = makeInsertReturn<
    InsertedWeaponSpecs,
    WeaponSpecs
>('weapon_specs', ['weapon_instance_id']);

export const insertWeaponStats = makeInsertReturn<
    InsertedWeaponStats,
    WeaponStats
>('weapon_stats', ['weapon_instance_id']);

export const insertWeaponText = makeInsertReturn<
    InsertedWeaponText,
    WeaponText
>('weapon_texts', ['weapon_instance_id']);

export const insertWeaponDesc = makeInsertReturn<
    InsertedWeaponDesc,
    WeaponDesc
>('weapon_descs', ['weapon_instance_id']);

export const insertProjWeapon = makeInsertReturn<
    InsertedProjWeapon,
    ProjWeapon
>('proj_weapons', ['weapon_instance_id']);

export const insertAmmoWeapon = makeInsertReturn<
    InsertedAmmoWeapon,
    AmmoWeapon
>('ammo_weapons', ['weapon_instance_id']);

export const insertBeamWeapon = makeInsertReturn<
    InsertedBeamWeapon,
    BeamWeapon
>('beam_weapons', ['weapon_instance_id']);

export const insertWeaponHint = makeInsertReturn<Code, CodeTable>(
    'weapon_hints',
    ['code'],
);

export const insertWeaponHintJunction = makeInsertReturn<
    InsertedWeaponHintJunction,
    WeaponHintJunction
>('weapon_hint_junction', ['weapon_instance_id', 'hint_id']);

export const insertWeaponTag = makeInsertReturn<Code, CodeTable>(
    'weapon_tags',
    ['code'],
);

export const insertWeaponTagJunction = makeInsertReturn<
    InsertedWeaponTagJunction,
    WeaponTagJunction
>('weapon_tag_junction', ['weapon_instance_id', 'tag_id']);

export const insertWeaponGroup = makeInsertReturn<Code, CodeTable>(
    'weapon_groups',
    ['code'],
);

export const insertWeaponGroupJunction = makeInsertReturn<
    InsertedWeaponGroupJunction,
    WeaponGroupJunction
>('weapon_group_junction', ['weapon_instance_id', 'group_id']);
