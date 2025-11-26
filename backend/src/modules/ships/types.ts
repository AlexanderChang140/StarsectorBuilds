import type { WithId } from '../../types/generic.ts';

type ShipId = { ship_id: number };
export type WithShipId<T> = T & ShipId;

type ShipInstanceId = { ship_instance_id: number };
type WithShipInstanceId<T> = T & ShipInstanceId;

export type PreparedFullShip = {
    preparedShipInstance: PreparedShipInstance;
    preparedShipSpecs: PreparedShipSpecs;
    preparedShipStats: PreparedShipStats;
    preparedShipText: PreparedShipText;
    preparedShipDesc: PreparedShipDesc | null;
    preparedShipPosition: PreparedShipPosition;
    preparedShipLogisticStats: PreparedShipLogisticStats;
    preparedShipWeaponSlots: PreparedShipWeaponSlot[];
    preparedShieldStats: PreparedShieldStats | null;
    preparedPhaseStats: PreparedPhaseStats | null;
    preparedShipHints: string[];
    preparedShipTags: string[];
};

export type Ship = WithId<InsertedShip>;
export type InsertedShip = {
    mod_id: number;
    code: string;
};

export type ShipInstance = WithId<InsertedShipInstance>;
export type InsertedShipInstance = WithShipId<PreparedShipInstance>;
export type PreparedShipInstance = {
    data_hash: string;
};

export type ShipVersion = WithId<InsertedShipInstance>;
export type InsertedShipVersion = {
    mod_version_id: number;
    ship_id: number;
    ship_instance_id: number;
    ship_image_id: number | null;
};

export type ShipSpecs = InsertedShipSpecs;
export type InsertedShipSpecs = ShipInstanceId & {
    ship_size_id: number;
    shield_type_id: number;
    ship_system_id: number | null;
    defense_code: string | null;
};
export type PreparedShipSpecs = {
    shipSize: string;
    shieldType: string;
    shipSystemCode: string | null;
    defenseCode: string | null;
};

export type ShipStats = InsertedShipStats;
export type InsertedShipStats = WithShipInstanceId<PreparedShipStats>;
export type PreparedShipStats = {
    hitpoints: number | null;
    armor_rating: number | null;
    max_flux: number | null;
    flux_dissipation: number | null;
    ordinance_points: number | null;
    fighter_bays: number | null;
    acceleration: number | null;
    deceleration: number | null;
    max_turn_rate: number | null;
    turn_acceleration: number | null;
    mass: number | null;
};

export type ShipText = InsertedShipText;
export type InsertedShipText = WithShipInstanceId<PreparedShipText>;
export type PreparedShipText = {
    display_name: string | null;
    manufacturer: string | null;
    designation: string | null;
    base_value: number | null;
};

export type ShipDesc = InsertedShipDesc;
export type InsertedShipDesc = WithShipInstanceId<PreparedShipDesc>;
export type PreparedShipDesc = {
    text1: string | null;
    text2: string | null;
};

export type ShipPosition = InsertedShipPosition;
export type InsertedShipPosition = WithShipInstanceId<PreparedShipPosition>;
export type PreparedShipPosition = {
    center: [number, number] | null;
};

export type ShipLogisticStats = InsertedShipLogisticStats;
export type InsertedShipLogisticStats =
    WithShipInstanceId<PreparedShipLogisticStats>;
export type PreparedShipLogisticStats = {
    min_crew: number | null;
    max_crew: number | null;
    max_cargo: number | null;
    max_fuel: number | null;
    fuel_per_ly: number | null;
    cr_recovery: number | null;
    cr_deployment_cost: number | null;
    peak_cr_sec: number | null;
    cr_loss_per_sec: number | null;
};

export type ShipWeaponSlot = WithId<InsertedShipWeaponSlot>;
export type InsertedShipWeaponSlot = WithShipInstanceId<{
    weapon_size_id: number;
    weapon_type_id: number;
    mount_type_id: number;
    code: string;
    angle: number;
    arc: number;
    position: [number, number];
}>;
export type PreparedShipWeaponSlot = {
    weaponSize: string;
    weaponType: string;
    mountType: string;
    code: string;
    angle: number;
    arc: number;
    position: [number, number];
};

export type ShieldStats = InsertedShieldStats;
export type InsertedShieldStats = WithShipInstanceId<PreparedShieldStats>;
export type PreparedShieldStats = {
    arc: number;
    upkeep: number;
    efficiency: number;
};

export type PhaseStats = InsertedPhaseStats;
export type InsertedPhaseStats = WithShipInstanceId<PreparedPhaseStats>;
export type PreparedPhaseStats = {
    cost: number;
    upkeep: number;
};

export type ShipHintJunction = InsertedShipHintJunction;
export type InsertedShipHintJunction = WithShipInstanceId<{
    hint_id: number;
}>;

export type ShipTagJunction = InsertedShipTagJunction;
export type InsertedShipTagJunction = WithShipInstanceId<{
    tag_id: number;
}>;

export type PreparedBuiltIn = {
    preparedBuiltInWeapons: Record<string, string>;
    preparedBuiltInHullmods: string[];
    preparedBuiltInWings: Record<string, number>;
};

export type BuiltInWeapon = InsertedBuiltInWeapon;
export type InsertedBuiltInWeapon = WithShipInstanceId<{
    weapon_id: number;
    slot_code: string;
}>;

export type BuiltInHullmod = InsertedBuiltInHullmod;
export type InsertedBuiltInHullmod = WithShipInstanceId<{
    hullmod_id: number;
}>;

export type BuiltInWing = InsertedBuiltInWing;
export type InsertedBuiltInWing = WithShipInstanceId<{
    wing_id: number;
    num_wings: number;
}>;
