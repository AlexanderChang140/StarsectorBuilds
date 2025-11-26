import type { PoolClient } from 'pg';

import type { ModInfo } from './importMod.ts';
import { insertJunctionItems } from '../../../db/helpers/insert.ts';
import { getOrThrow } from '../../../utils/helpers.ts';
import { insertImage } from '../../images/service.ts';
import type { PreparedImage } from '../../images/types.ts';
import { getShipSystemId } from '../../ship_systems/service.ts';
import {
    getMountTypes,
    getShieldTypes,
    getShipSizes,
    insertPhaseStats,
    insertShieldStats,
    insertShip,
    insertShipDesc,
    insertShipHint,
    insertShipHintJunction,
    insertShipInstance,
    insertShipLogisticStats,
    insertShipPosition,
    insertShipSpecs,
    insertShipStats,
    insertShipTag,
    insertShipTagJunction,
    insertShipText,
    insertShipVersion,
    insertShipWeaponSlot,
} from '../../ships/service.ts';
import type { PreparedFullShip } from '../../ships/types.ts';
import { getWeaponSizes, getWeaponTypes } from '../../weapons/service.ts';
import { buildImage } from '../parsers/imageParser.ts';

export async function importShips(
    modInfo: ModInfo,
    client: PoolClient,
    ships: {
        preparedFullShips: Record<string, PreparedFullShip>;
        preparedImages: Record<string, PreparedImage | null>;
    },
): Promise<boolean> {
    const { preparedFullShips, preparedImages } = ships;

    let dataChanged = false;

    const mountTypes = await getMountTypes(client);
    const shieldTypes = await getShieldTypes(client);
    const shipSizes = await getShipSizes(client);
    const weaponTypes = await getWeaponTypes(client);
    const weaponSizes = await getWeaponSizes(client);

    for (const [code, ship] of Object.entries(preparedFullShips)) {
        const preparedImage = preparedImages[code] ?? null;
        const image = buildImage(modInfo.modCode, 'ships', preparedImage);

        const imageId = image
            ? (await insertImage(image, { returning: ['id'], client })).id
            : null;

        const shipId = (
            await insertShip(
                {
                    mod_id: modInfo.modId,
                    code,
                },
                { returning: ['id'], client },
            )
        ).id;

        const { id: shipInstanceId, inserted } = await insertShipInstance(
            {
                ship_id: shipId,
                ...ship.preparedShipInstance,
            },
            { returning: ['id'], client },
        );
        dataChanged ||= inserted;

        await insertShipVersion(
            {
                mod_version_id: modInfo.modVersionId,
                ship_id: shipId,
                ship_instance_id: shipInstanceId,
                ship_image_id: imageId,
            },
            { client },
        );

        if (!inserted) continue;

        const {
            shipSize,
            shieldType,
            shipSystemCode,
            defenseCode: defense_code,
        } = ship.preparedShipSpecs;

        const ship_system_id = shipSystemCode
            ? (
                  await getShipSystemId({
                      where: { code: shipSystemCode },
                  })
              )[0]?.id
            : null;

        await insertShipSpecs(
            {
                ship_instance_id: shipInstanceId,
                ship_size_id: getOrThrow(shipSizes, shipSize),
                shield_type_id: getOrThrow(shieldTypes, shieldType),
                ship_system_id: ship_system_id ?? null,
                defense_code,
            },
            { client },
        );

        await insertShipStats(
            {
                ship_instance_id: shipInstanceId,
                ...ship.preparedShipStats,
            },
            { client },
        );

        await insertShipText(
            {
                ship_instance_id: shipInstanceId,
                ...ship.preparedShipText,
            },
            { client },
        );

        if (ship.preparedShipDesc) {
            await insertShipDesc(
                {
                    ship_instance_id: shipInstanceId,
                    ...ship.preparedShipDesc,
                },
                { client },
            );
        }

        await insertShipPosition(
            {
                ship_instance_id: shipInstanceId,
                ...ship.preparedShipPosition,
            },
            { client },
        );

        await insertShipLogisticStats(
            {
                ship_instance_id: shipInstanceId,
                ...ship.preparedShipLogisticStats,
            },
            { client },
        );

        for (const slot of ship.preparedShipWeaponSlots) {
            await insertShipWeaponSlot(
                {
                    ship_instance_id: shipInstanceId,
                    weapon_size_id: getOrThrow(weaponSizes, slot.weaponSize),
                    weapon_type_id: getOrThrow(weaponTypes, slot.weaponType),
                    mount_type_id: getOrThrow(mountTypes, slot.mountType),
                    code: slot.code,
                    angle: slot.angle,
                    arc: slot.arc,
                    position: slot.position,
                },
                { client },
            );
        }

        if (ship.preparedShieldStats) {
            await insertShieldStats(
                {
                    ship_instance_id: shipInstanceId,
                    ...ship.preparedShieldStats,
                },
                { client },
            );
        }

        if (ship.preparedPhaseStats) {
            await insertPhaseStats(
                {
                    ship_instance_id: shipInstanceId,
                    ...ship.preparedPhaseStats,
                },
                { client },
            );
        }

        await insertJunctionItems(
            ship.preparedShipHints,
            shipInstanceId,
            insertShipHint,
            insertShipHintJunction,
            { instanceKey: 'ship_instance_id', itemKey: 'hint_id' },
            client,
        );

        await insertJunctionItems(
            ship.preparedShipTags,
            shipInstanceId,
            insertShipTag,
            insertShipTagJunction,
            { instanceKey: 'ship_instance_id', itemKey: 'tag_id' },
            client,
        );
    }
    console.log(`Successfully imported ships from: ${modInfo.modCode}`);
    return dataChanged;
}
