import type {
    InsertedShipSystem,
    InsertedShipSystemData,
    InsertedShipSystemDesc,
    InsertedShipSystemInstance,
    InsertedShipSystemVersion,
    ShipSystem,
    ShipSystemData,
    ShipSystemDesc,
    ShipSystemInstance,
    ShipSystemVersion,
} from './types.ts';
import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectOne } from '../../db/helpers/select.ts';

export const getShipSystemId = makeSelectOne<
    ShipSystem,
    'id',
    Pick<ShipSystem, 'code'>
>('ship_systems', ['id']);

export const insertShipSystem = makeInsertReturn<
    InsertedShipSystem,
    ShipSystem
>('ship_systems', ['mod_id', 'code']);

export const insertShipSystemInstance = makeInsertReturn<
    InsertedShipSystemInstance,
    ShipSystemInstance
>('ship_system_instances', ['data_hash']);

export const insertShipSystemVersion = makeInsertReturn<
    InsertedShipSystemVersion,
    ShipSystemVersion
>('ship_system_versions', ['mod_version_id', 'ship_system_id']);

export const insertShipSystemData = makeInsertReturn<
    InsertedShipSystemData,
    ShipSystemData
>('ship_system_data', ['ship_system_instance_id']);

export const insertShipSystemDesc = makeInsertReturn<
    InsertedShipSystemDesc,
    ShipSystemDesc
>('ship_system_descs', ['ship_system_instance_id']);
