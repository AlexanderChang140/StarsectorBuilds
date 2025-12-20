export type PreparedFullShipSystem = {
    preparedShipSystemInstance: PreparedShipSystemInstance;
    preparedShipSystemData: PreparedShipSystemData;
    preparedShipSystemDesc: PreparedShipSystemDesc | null;
};

export type PreparedShipSystemInstance = {
    data_hash: string;
};

export type PreparedShipSystemData = {
    display_name: string;
};

export type PreparedShipSystemDesc = {
    text1: string | null;
    text2: string | null;
    text3: string | null;
};
