import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectCodeIdRecord } from '../../db/helpers/select.ts';

export const getWingFormations = makeSelectCodeIdRecord('wing_formations');

export const getWingRoles = makeSelectCodeIdRecord('wing_roles');

export const insertWingInstance = makeInsertReturn('wing_instances', [
    'data_hash',
]);

export const insertWingVersion = makeInsertReturn('wing_versions', [
    'mod_version_id',
    'ship_id',
]);

export const insertWingData = makeInsertReturn('wing_data', [
    'wing_instance_id',
]);

export const insertWingHullmod = makeInsertReturn('wing_hullmods', [
    'wing_instance_id',
    'hullmod_id',
]);

export const insertWingWeaponGroup = makeInsertReturn('wing_weapon_groups');

export const insertWingWeapon = makeInsertReturn('wing_weapons', [
    'wing_weapon_group_id',
    'weapon_slot_code',
]);

export const insertWingTag = makeInsertReturn('wing_tags', ['code']);

export const insertWingTagJunction = makeInsertReturn('wing_tag_junction', [
    'wing_instance_id',
    'tag_id',
]);
