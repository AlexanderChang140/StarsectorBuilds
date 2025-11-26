import type {
    InsertedWingVersion,
    InsertedWingInstance,
    WingInstance,
    WingVersion,
    InsertedWingData,
    WingData,
    WingInstanceId,
    WingWeaponGroup,
    InsertedWingWeaponGroup,
    InsertedWingWeapon,
    WingWeapon,
    InsertedWingTagJunction,
    WingTagJunction,
} from './types.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectCodeIdRecord } from '../../db/helpers/select.ts';
import type { Code, CodeTable } from '../../types/generic.ts';
import type { HullmodId } from '../hullmods/types.ts';

export const getWingFormations = makeSelectCodeIdRecord('wing_formations');

export const getWingRoles = makeSelectCodeIdRecord('wing_roles');

export const insertWingInstance = makeInsertReturn<
    InsertedWingInstance,
    WingInstance
>('wing_instances', ['data_hash']);

export const insertWingVersion = makeInsertReturn<
    InsertedWingVersion,
    WingVersion
>('wing_versions', ['mod_version_id', 'ship_id']);

export const insertWingData = makeInsertReturn<InsertedWingData, WingData>(
    'wing_data',
    ['wing_instance_id'],
);

export const insertWingHullmod = makeInsertReturn<WingInstanceId & HullmodId>(
    'wing_hullmods',
    ['wing_instance_id', 'hullmod_id'],
);

export const insertWingWeaponGroup = makeInsertReturn<
    InsertedWingWeaponGroup,
    WingWeaponGroup
>('wing_weapon_groups', ['wing_instance_id']);

export const insertWingWeapon = makeInsertReturn<
    InsertedWingWeapon,
    WingWeapon
>('wing_weapons', ['wing_weapon_group_id', 'weapon_slot_code']);

export const insertWingTag = makeInsertReturn<Code, CodeTable>('wing_tags', [
    'code',
]);

export const insertWingTagJunction = makeInsertReturn<
    InsertedWingTagJunction,
    WingTagJunction
>('wing_tag_junction', ['wing_instance_id', 'tag_id']);
