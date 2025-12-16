import type { WithId } from '../../types/generic.ts';

export type WithShipSystemId<T> = T & { ship_system_id: number };
export type WithShipSystemInstanceId<T> = T & {
    ship_system_instance_id: number;
};

export type PreparedFullShipSystem = {
    preparedShipSystemInstance: PreparedShipSystemInstance;
    preparedShipSystemData: PreparedShipSystemData;
    preparedShipSystemDesc: PreparedShipSystemDesc | null;
};

export type ShipSystem = WithId<InsertedShipSystem>;
export type InsertedShipSystem = {
    mod_id: number;
    code: string;
};

export type ShipSystemInstance = WithId<InsertedShipSystemInstance>;
export type InsertedShipSystemInstance =
    WithShipSystemId<PreparedShipSystemInstance>;
export type PreparedShipSystemInstance = {
    data_hash: string;
};

export type ShipSystemVersion = WithId<InsertedShipSystemVersion>;
export type InsertedShipSystemVersion = {
    mod_version_id: number;
    ship_system_id: number;
    ship_system_instance_id: number;
    ship_system_image_id: number | null;
};

export type ShipSystemData = InsertedShipSystemData;
export type InsertedShipSystemData =
    WithShipSystemInstanceId<PreparedShipSystemData>;
export type PreparedShipSystemData = {
    display_name: string;
};

export type ShipSystemDesc = InsertedShipSystemDesc;
export type InsertedShipSystemDesc =
    WithShipSystemInstanceId<PreparedShipSystemDesc>;
export type PreparedShipSystemDesc = {
    text1: string | null;
    text2: string | null;
    text3: string | null;
};
