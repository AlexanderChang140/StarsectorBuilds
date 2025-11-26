import type { WithId } from './generic.ts';

export type Mod = WithId<InsertedMod>;
export type InsertedMod = {
    code: string;
    display_name: string;
}

export type ModVersion = WithId<InsertedModVersion>;
export type InsertedModVersion = {
    mod_id: number;
} & Version;

export type Version = {
    major: number;
    minor: number;
    patch: string;
}