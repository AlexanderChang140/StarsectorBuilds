import type { WithWeaponInstanceId } from "./core.ts";

export type ProjWeapon = PreparedProjWeapon;
export type InsertedProjWeapon = WithWeaponInstanceId<PreparedProjWeapon>;
export type PreparedProjWeapon = {
    speed: number | null;
    launch_speed: number | null;
    flight_time: number | null;
    hitpoints: number | null;
}

export type AmmoWeapon = InsertedAmmoWeapon;
export type InsertedAmmoWeapon = WithWeaponInstanceId<PreparedAmmoWeapon>;
export type PreparedAmmoWeapon = {
    max_ammo: number;
    ammo_per_second: number | null;
    reload_size: number | null;
}

export type BeamWeapon = InsertedBeamWeapon;
export type InsertedBeamWeapon = WithWeaponInstanceId<PreparedBeamWeapon>;
export type PreparedBeamWeapon = {
    beam_speed: number | null;
    damage_per_second: number | null;
    flux_per_second: number | null;
}