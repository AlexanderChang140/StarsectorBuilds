import type { PoolClient } from 'pg';

import type { ModInfo } from './importMod.ts';
import { insertImage } from '../../images/service.ts';
import type { PreparedImage } from '../../images/types.ts';
import {
    insertShipSystem,
    insertShipSystemData,
    insertShipSystemDesc,
    insertShipSystemInstance,
    insertShipSystemVersion,
} from '../../ship_systems/service.ts';
import type { PreparedFullShipSystem } from '../../ship_systems/types.ts';
import { buildImage } from '../parsers/imageParser.ts';

export async function importShipSystem(
    modInfo: ModInfo,
    client: PoolClient,
    ship_systems: {
        preparedFullShipSystems: Record<string, PreparedFullShipSystem>;
        preparedImages: Record<string, PreparedImage | null>;
    },
): Promise<boolean> {
    const { preparedFullShipSystems, preparedImages } = ship_systems;

    let dataChanged = false;
    for (const [code, shipSystem] of Object.entries(preparedFullShipSystems)) {
        const preparedImage = preparedImages[code] ?? null;
        const image = buildImage(
            modInfo.modCode,
            'ship_systems',
            preparedImage,
        );

        const imageId = image
            ? (await insertImage({ record: image, returnKeys: ['id'], client }))
                  .id
            : null;

        const shipSystemId = (
            await insertShipSystem({
                record: {
                    mod_id: modInfo.modId,
                    code,
                },
                returnKeys: ['id'],
                client,
            })
        ).id;

        const { id: shipSystemInstanceId, inserted } =
            await insertShipSystemInstance({
                record: {
                    ship_system_id: shipSystemId,
                    ...shipSystem.preparedShipSystemInstance,
                },
                returnKeys: ['id'],
                client,
            });
        dataChanged ||= inserted;

        await insertShipSystemVersion({
            record: {
                mod_version_id: modInfo.modVersionId,
                ship_system_id: shipSystemId,
                ship_system_instance_id: shipSystemInstanceId,
                ship_system_image_id: imageId,
            },
            client,
        });

        await insertShipSystemData({
            record: {
                ship_system_instance_id: shipSystemInstanceId,
                ...shipSystem.preparedShipSystemData,
            },
            client,
        });

        if (shipSystem.preparedShipSystemDesc) {
            await insertShipSystemDesc({
                record: {
                    ship_system_instance_id: shipSystemInstanceId,
                    ...shipSystem.preparedShipSystemDesc,
                },
                client,
            });
        }
    }
    console.log(`Successfully imported ship systems from: ${modInfo.modCode}`);
    return dataChanged;
}
