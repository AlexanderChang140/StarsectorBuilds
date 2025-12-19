import type { WeaponFilter } from './types/filter.ts';
import type { WeaponVersionsFull } from '../../db/db.js';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import {
    makeSelectCodeIdRecord,
    makeSelectFullWithFilter,
    makeSelectOne,
} from '../../db/helpers/select.ts';

const WEAPON_VERSIONS_FULL_COLUMNS = [
    'weapon_version_id',
    'turret_image_file_path',
    'turret_gun_image_file_path',
    'mod_version_id',
    'major',
    'minor',
    'patch',
    'mod_id',
    'mod_name',
    'weapon_instance_id',
    'weapon_id',
    'weapon_type_id',
    'weapon_size_id',
    'damage_type_id',
    'weapon_type',
    'weapon_size',
    'damage_type',
    'weapon_range',
    'damage_per_shot',
    'emp',
    'impact',
    'turn_rate',
    'op_cost',
    'flux_per_shot',
    'chargeup',
    'chargedown',
    'burst_size',
    'burst_delay',
    'min_spread',
    'max_spread',
    'spread_per_shot',
    'spread_decay_per_second',
    'autofire_accuracy_bonus',
    'extra_arc_for_ai',
    'base_value',
    'speed',
    'launch_speed',
    'flight_time',
    'hitpoints',
    'max_ammo',
    'ammo_per_second',
    'reload_size',
    'beam_speed',
    'damage_per_second',
    'flux_per_second',
    'display_name',
    'manufacturer',
    'primary_role_str',
    'proj_speed_str',
    'tracking_str',
    'turn_rate_str',
    'accuracy_str',
    'custom_primary',
    'custom_primary_hl',
    'custom_ancillary',
    'custom_ancillary_hl',
    'no_dps_tooltip',
    'text1',
    'text2',
    'hints',
    'tags',
    'groups',
] as const satisfies (keyof WeaponVersionsFull)[];

export const getFullWeaponVersions = makeSelectFullWithFilter<WeaponFilter>()(
    'weapon_versions_full',
    WEAPON_VERSIONS_FULL_COLUMNS,
);

export const getWeaponId = makeSelectOne<'weapons', 'id', 'code'>('weapons', [
    'id',
]);

export const getWeaponTypes = makeSelectCodeIdRecord('weapon_types');

export const getWeaponSizes = makeSelectCodeIdRecord('weapon_sizes');

export const getDamageTypes = makeSelectCodeIdRecord('damage_types');

export const insertWeapon = makeInsertReturn('weapons', ['mod_id', 'code']);

export const insertWeaponInstance = makeInsertReturn('weapon_instances', [
    'data_hash',
]);

export const insertWeaponVersion = makeInsertReturn('weapon_versions', [
    'mod_version_id',
    'weapon_id',
]);

export const insertWeaponSpecs = makeInsertReturn('weapon_specs', [
    'weapon_instance_id',
]);

export const insertWeaponStats = makeInsertReturn('weapon_stats', [
    'weapon_instance_id',
]);

export const insertWeaponText = makeInsertReturn('weapon_texts', [
    'weapon_instance_id',
]);

export const insertWeaponDesc = makeInsertReturn('weapon_descs', [
    'weapon_instance_id',
]);

export const insertProjWeapon = makeInsertReturn('proj_weapons', [
    'weapon_instance_id',
]);

export const insertAmmoWeapon = makeInsertReturn('ammo_weapons', [
    'weapon_instance_id',
]);

export const insertBeamWeapon = makeInsertReturn('beam_weapons', [
    'weapon_instance_id',
]);

export const insertWeaponHint = makeInsertReturn('weapon_hints', ['code']);

export const insertWeaponHintJunction = makeInsertReturn(
    'weapon_hint_junction',
    ['weapon_instance_id', 'hint_id'],
);

export const insertWeaponTag = makeInsertReturn('weapon_tags', ['code']);

export const insertWeaponTagJunction = makeInsertReturn('weapon_tag_junction', [
    'weapon_instance_id',
    'tag_id',
]);

export const insertWeaponGroup = makeInsertReturn('weapon_groups', ['code']);

export const insertWeaponGroupJunction = makeInsertReturn(
    'weapon_group_junction',
    ['weapon_instance_id', 'group_id'],
);
