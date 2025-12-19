import { makeInsertReturn } from '../../db/helpers/insert.ts';
import { makeSelectOne } from '../../db/helpers/select.ts';

export const getShipSystemId = makeSelectOne<'ship_systems', 'id', 'code'>(
    'ship_systems',
    ['id'],
);

export const insertShipSystem = makeInsertReturn('ship_systems', [
    'mod_id',
    'code',
]);

export const insertShipSystemInstance = makeInsertReturn(
    'ship_system_instances',
    ['data_hash'],
);

export const insertShipSystemVersion = makeInsertReturn(
    'ship_system_versions',
    ['mod_version_id', 'ship_system_id'],
);

export const insertShipSystemData = makeInsertReturn('ship_system_data', [
    'ship_system_instance_id',
]);

export const insertShipSystemDesc = makeInsertReturn('ship_system_descs', [
    'ship_system_instance_id',
]);
