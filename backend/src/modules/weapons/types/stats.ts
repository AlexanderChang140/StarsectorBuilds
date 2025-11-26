import type { WithWeaponInstanceId } from './core.ts';

export type WeaponSpecs = InsertedWeaponSpecs;
export type InsertedWeaponSpecs = WithWeaponInstanceId<{
    weapon_type_id: number;
    weapon_size_id: number;
    damage_type_id: number;
}>;
export type PreparedWeaponSpecs = {
    weapon_type: string;
    weapon_size: string;
    damage_type: string;
};

export type WeaponStats = InsertedWeaponStats;
export type InsertedWeaponStats = WithWeaponInstanceId<PreparedWeaponStats>;
export type PreparedWeaponStats = {
    weapon_range: number | null;
    damage_per_shot: number | null;
    emp: number | null;
    impact: number | null;
    turn_rate: number | null;
    op_cost: number | null;
    flux_per_shot: number | null;
    chargeup: number | null;
    chargedown: number | null;
    burst_size: number | null;
    burst_delay: number | null;
    min_spread: number | null;
    max_spread: number | null;
    spread_per_shot: number | null;
    spread_decay_per_second: number | null;
    autofire_accuracy_bonus: number | null;
    extra_arc_for_ai: number | null;
    base_value: number | null;
};
