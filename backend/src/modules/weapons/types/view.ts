import type { WeaponDesc, WeaponText } from './desc.ts';
import type { AmmoWeapon, BeamWeapon, ProjWeapon } from './projectile.ts';
import type { WeaponId, WeaponInstanceId, WeaponStats } from './types.ts';
import type { Prettify } from '../../../types/generic.ts';

export type FullWeaponVersion = Prettify<
    WeaponId &
        WeaponInstanceId &
        WeaponStats &
        ProjWeapon &
        AmmoWeapon &
        BeamWeapon &
        WeaponText &
        WeaponDesc &
        WeaponArrays & {
            weapon_version_id: number;
            turret_image_file_path: string;
            turret_gun_image_file_path: string;
            major: number;
            minor: number;
            patch: string;
            mod_id: number;
            mod_name: string;
            weapon_type: string;
            weapon_size: string;
            damage_type: string;
        }
>;

export type WeaponArrays = {
    hints: string[];
    groups: string[];
    tags: string[];
};
