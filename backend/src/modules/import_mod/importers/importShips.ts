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
import type { PreparedFullShip } from '../../ships/types/types.ts';
import { getWeaponSizes, getWeaponTypes } from '../../weapons/service.ts';
import { buildImage } from '../parsers/imageParser.ts';

export async function importShips(
    modInfo: ModInfo,
    client: PoolClient,
    ships: {
        preparedFullShips: Record<string, PreparedFullShip>;
        preparedImages: Record<string, PreparedImage | null>;
    },
): Promise<{ dataChanged: boolean; shipInstanceIds: Record<string, number> }> {
    const { preparedFullShips, preparedImages } = ships;

    const out: {
        dataChanged: boolean;
        shipInstanceIds: Record<string, number>;
    } = { dataChanged: false, shipInstanceIds: {} };

    const mountTypes = await getMountTypes(client);
    const shieldTypes = await getShieldTypes(client);
    const shipSizes = await getShipSizes(client);
    const weaponTypes = await getWeaponTypes(client);
    const weaponSizes = await getWeaponSizes(client);

    for (const [code, ship] of Object.entries(preparedFullShips)) {
        const preparedImage = preparedImages[code] ?? null;

        try {
            const image = buildImage(modInfo.modCode, 'ships', preparedImage);

            const imageId = image
                ? (
                      await insertImage({
                          record: image,
                          returnKeys: ['id'],
                          client,
                      })
                  ).id
                : null;

            const shipId = (
                await insertShip({
                    record: {
                        mod_id: modInfo.modId,
                        code,
                    },
                    returnKeys: ['id'],
                    client,
                })
            ).id;

            const { id: shipInstanceId, inserted } = await insertShipInstance({
                record: {
                    ship_id: shipId,
                    ...ship.preparedShipInstance,
                },
                returnKeys: ['id'],
                client,
            });

            out.dataChanged ||= inserted;
            out.shipInstanceIds[code] = shipInstanceId;

            await insertShipVersion({
                record: {
                    mod_version_id: modInfo.modVersionId,
                    ship_id: shipId,
                    ship_instance_id: shipInstanceId,
                    ship_image_id: imageId,
                },
                client,
            });

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
                  )?.id
                : null;

            await insertShipSpecs({
                record: {
                    ship_instance_id: shipInstanceId,
                    ship_size_id: getOrThrow(shipSizes, shipSize),
                    shield_type_id: getOrThrow(shieldTypes, shieldType),
                    ship_system_id: ship_system_id ?? null,
                    defense_code,
                },
                client,
            });

            await insertShipStats({
                record: {
                    ship_instance_id: shipInstanceId,
                    ...ship.preparedShipStats,
                },
                client,
            });

            await insertShipText({
                record: {
                    ship_instance_id: shipInstanceId,
                    ...ship.preparedShipText,
                },
                client,
            });

            if (ship.preparedShipDesc) {
                await insertShipDesc({
                    record: {
                        ship_instance_id: shipInstanceId,
                        ...ship.preparedShipDesc,
                    },
                    client,
                });
            }

            await insertShipPosition({
                record: {
                    ship_instance_id: shipInstanceId,
                    ...ship.preparedShipPosition,
                },
                client,
            });

            await insertShipLogisticStats({
                record: {
                    ship_instance_id: shipInstanceId,
                    ...ship.preparedShipLogisticStats,
                },
                client,
            });

            for (const slot of ship.preparedShipWeaponSlots) {
                await insertShipWeaponSlot({
                    record: {
                        ship_instance_id: shipInstanceId,
                        weapon_size_id: getOrThrow(
                            weaponSizes,
                            slot.weaponSize,
                        ),
                        weapon_type_id: getOrThrow(
                            weaponTypes,
                            slot.weaponType,
                        ),
                        mount_type_id: getOrThrow(mountTypes, slot.mountType),
                        code: slot.code,
                        angle: slot.angle,
                        arc: slot.arc,
                        position: slot.position,
                    },
                    client,
                });
            }

            if (ship.preparedShieldStats) {
                await insertShieldStats({
                    record: {
                        ship_instance_id: shipInstanceId,
                        ...ship.preparedShieldStats,
                    },
                    client,
                });
            }

            if (ship.preparedPhaseStats) {
                await insertPhaseStats({
                    record: {
                        ship_instance_id: shipInstanceId,
                        ...ship.preparedPhaseStats,
                    },
                    client,
                });
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
        } catch (err) {
            const formatted = new Error(`Failed to insert ship: ${code}`, {
                cause: err,
            });
            console.log(formatted);
            console.log(ship);
        }
    }
    console.log(`Successfully imported ships from: ${modInfo.modCode}`);
    return out;
}
