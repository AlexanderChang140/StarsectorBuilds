export type WeaponHintJunction = InsertedWeaponHintJunction;
export type InsertedWeaponHintJunction = {
    weapon_instance_id: number;
    hint_id: number;
}

export type WeaponTagJunction = InsertedWeaponTagJunction;
export type InsertedWeaponTagJunction = {
    weapon_instance_id: number;
    tag_id: number;
}

export type WeaponGroupJunction = InsertedWeaponGroupJunction;
export type InsertedWeaponGroupJunction = {
    weapon_instance_id: number;
    group_id: number;
}
