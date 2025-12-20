export type PreparedFullHullmod = {
    preparedHullmodInstance: PreparedHullmodInstance;
    preparedHullmodData: PreparedHullmodData;
    hullmodTags: string[];
    hullmodUiTags: string[];
};

export type PreparedHullmodInstance = {
    data_hash: string;
};
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
