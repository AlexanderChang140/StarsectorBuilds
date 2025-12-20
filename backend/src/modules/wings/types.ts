export type PreparedFullWing = {
    preparedWingInstance: PreparedWingInstance;
    preparedWingHullmods: string[];
    preparedWingData: PreparedWingData;
    preparedWingWeaponGroups: {
        mode: string;
        weapons: Record<string, string>;
    }[];
    preparedWingTags: string[];
};

export type PreparedWingInstance = {
    data_hash: string;
};

export type PreparedWingData = {
    formation: string;
    role: string;
    role_desc: string | null;
    op_cost: number | null;
    deployment_range: number | null;
    num_fighters: number | null;
    refit_time: number | null;
    base_value: number | null;
    vents: number | null | undefined;
    capacitors: number | null | undefined;
};
