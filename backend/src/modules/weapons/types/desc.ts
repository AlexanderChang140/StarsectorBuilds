import type { WithWeaponInstanceId } from "./types.ts";

export type WeaponText = InsertedWeaponText;
export type InsertedWeaponText = WithWeaponInstanceId<PreparedWeaponText>;
export type PreparedWeaponText = {
    display_name: string | null;
    manufacturer: string | null;
    primary_role_str: string | null;
    proj_speed_str: string | null;
    tracking_str: string | null;
    turn_rate_str: string | null;
    accuracy_str: string | null;
    custom_primary: string | null;
    custom_primary_hl: string | null;
    custom_ancillary: string | null;
    custom_ancillary_hl: string | null;
    no_dps_tooltip: boolean;
}

export type WeaponDesc = InsertedWeaponDesc;
export type InsertedWeaponDesc = WithWeaponInstanceId<PreparedWeaponDesc>;
export type PreparedWeaponDesc = {
    text1: string | null;
    text2: string | null;
}