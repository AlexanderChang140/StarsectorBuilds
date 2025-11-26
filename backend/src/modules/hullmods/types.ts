import type { WithId } from '../../types/generic.ts';

export type HullmodId = { hullmod_id: number };
export type WithHullmodId<T> = T & HullmodId;

export type HullmodInstanceId = { hullmod_instance_id: number };
export type WithHullmodInstanceId<T> = T & HullmodInstanceId;

export type ValidHullmodInstance = HullmodId &
    HullmodInstanceId &
    HullmodData &
    HullmodArrays;

export type HullmodArrays = {
    tags: string[];
    uiTags: string[];
};

export type PreparedFullHullmod = {
    preparedHullmodInstance: PreparedHullmodInstance;
    preparedHullmodData: PreparedHullmodData;
    hullmodTags: string[];
    hullmodUiTags: string[];
};

export type Hullmod = WithId<InsertedHullmod>;
export type InsertedHullmod = {
    mod_id: number;
    code: string;
};

export type HullmodInstance = WithId<InsertedHullmodInstance>;
export type InsertedHullmodInstance = WithHullmodId<PreparedHullmodInstance>;
export type PreparedHullmodInstance = {
    data_hash: string;
};

export type HullmodVersion = WithId<InsertedHullmodVersion>;
export type InsertedHullmodVersion = {
    mod_version_id: number;
    hullmod_id: number;
    hullmod_instance_id: number;
    hullmod_image_id: number | null;
};

export type HullmodData = WithId<InsertedHullmodData>;
export type InsertedHullmodData = WithHullmodInstanceId<PreparedHullmodData>;
export type PreparedHullmodData = {
    display_name: string | null;
    manufacturer: string | null;
    hullmod_desc: string | null;
    base_value: number | null;
    cost_frigate: number;
    cost_destroyer: number;
    cost_cruiser: number;
    cost_capital: number;
    hide: boolean;
    hide_everywhere: boolean;
};

export type HullmodTagJunction = InsertedHullmodTagJunction;
export type InsertedHullmodTagJunction = {
    hullmod_instance_id: number;
    tag_id: number;
}

export type HullmodUiTagJunction = InsertedHullmodUiTagJunction;
export type InsertedHullmodUiTagJunction = {
    hullmod_instance_id: number;
    tag_id: number;
}
