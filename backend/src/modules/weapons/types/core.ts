export type WeaponId = { weapon_id: number };
export type WeaponInstanceId = { weapon_instance_id: number };

export type WithWeaponId<T> = T & WeaponId;
export type WithWeaponInstanceId<T> = T & WeaponInstanceId;