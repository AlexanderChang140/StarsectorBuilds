import type { WithId } from '../../types/generic.ts';
import type { WithShipId } from '../ships/types/types.ts';

export type WingId = { wing_id: number };
export type WithWingId<T> = T & WingId;

export type WingInstanceId = { wing_instance_id: number };
export type WithWingInstanceId<T> = T & WingInstanceId;

export type PreparedFullWing = {
    preparedWingInstance: PreparedWingInstance;
    preparedWingHullmods: string[];
    preparedWingData: PreparedWingData;
    preparedWingWeaponGroups: {
        mode: string;
        weapons: Record<string, string>;
    }[];
    preparedWingTags: string[];
};

export type WingInstance = WithId<InsertedWingInstance>;
export type InsertedWingInstance = WithShipId<PreparedWingInstance>;
export type PreparedWingInstance = {
    data_hash: string;
};

export type WingVersion = WithId<InsertedWingVersion>;
export type InsertedWingVersion = {
    mod_version_id: number;
    ship_id: number;
    wing_instance_id: number;
};

export type WingData = InsertedWingData;
export type InsertedWingData = WithWingInstanceId<
    Omit<PreparedWingData, 'formation' | 'role'>
> & {
    formation_id: number | null;
    role_id: number | null;
};
export type PreparedWingData = {
    formation: string;
    role: string;
    role_desc: string | null;
    op_cost: number | null;
    deployment_range: number | null;
    num_fighters: number | null;
    refit_time: number | null;
    base_value: number | null;
    vents: number | null | undefined;
    capacitors: number | null | undefined;
};

export type WingWeaponGroup = WithId<InsertedWingWeaponGroup>;
export type InsertedWingWeaponGroup = WithWingInstanceId<{
    mode: string | null;
}>;

export type WingWeapon = InsertedWingWeapon;
export type InsertedWingWeapon = {
    wing_weapon_group_id: number;
    weapon_id: number;
    weapon_slot_code: string;
};

export type WingTagJunction = InsertedWingTagJunction;
export type InsertedWingTagJunction = {
    wing_instance_id: number;
    tag_id: number;
}