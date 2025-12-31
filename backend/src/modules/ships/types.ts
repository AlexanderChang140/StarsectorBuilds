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

export type PreparedShipInstance = {
    data_hash: string;
};

export type PreparedShipSpecs = {
    shipSize: string;
    shieldType: string;
    shipSystemCode: string | null;
    defenseCode: string | null;
};

export type PreparedShipStats = {
    hitpoints: number | null;
    armor_rating: number | null;
    max_flux: number | null;
    flux_dissipation: number | null;
    op_cost: number | null;
    fighter_bays: number | null;
    acceleration: number | null;
    deceleration: number | null;
    max_turn_rate: number | null;
    max_speed: number | null;
    turn_acceleration: number | null;
    mass: number | null;
};

export type PreparedShipText = {
    display_name: string | null;
    manufacturer: string | null;
    designation: string | null;
    base_value: number | null;
};

export type PreparedShipDesc = {
    text1: string | null;
    text2: string | null;
};

export type PreparedShipPosition = {
    x: number;
    y: number;
};

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

export type PreparedShipWeaponSlot = {
    weaponSize: string;
    weaponType: string;
    mountType: string;
    code: string;
    angle: number;
    arc: number;
    x: number;
    y: number;
};

export type PreparedShieldStats = {
    arc: number;
    upkeep: number;
    efficiency: number;
};

export type PreparedPhaseStats = {
    cost: number;
    upkeep: number;
};

export type PreparedBuiltIn = {
    preparedBuiltInWeapons: Record<string, string>;
    preparedBuiltInHullmods: string[];
    preparedBuiltInWings: Record<string, number>;
};
