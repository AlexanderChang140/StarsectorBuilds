import type { PoolClient } from 'pg';

import type { ModInfo } from './importMod.ts';
import { insertJunctionItems } from '../../../db/helpers/insert.ts';
import { getOrThrow } from '../../../utils/helpers.ts';
import { getShipId } from '../../ships/service.ts';
import { getWeaponId } from '../../weapons/service.ts';
import {
    getWingFormations,
    getWingRoles,
    insertWingData,
    insertWingInstance,
    insertWingTag,
    insertWingTagJunction,
    insertWingVersion,
    insertWingWeapon,
    insertWingWeaponGroup,
} from '../../wings/service.ts';
import type { PreparedFullWing } from '../../wings/types.ts';

export async function importWings(
    modInfo: ModInfo,
    client: PoolClient,
    wings: {
        preparedFullWings: Record<string, PreparedFullWing>;
    },
): Promise<boolean> {
    const { preparedFullWings } = wings;

    let dataChanged = false;

    const wingFormations = await getWingFormations(client);
    const wingRoles = await getWingRoles(client);

    for (const [code, wing] of Object.entries(preparedFullWings)) {
        try {
            const shipId = (
                await getShipId({
                    where: { mod_id: modInfo.modId, code },
                    client,
                })
            )?.id;

            if (shipId === undefined) {
                throw new Error(`Failed to find ship id for: ${code}`);
            }

            const { id: wingInstanceId, inserted } = await insertWingInstance({
                record: {
                    ship_id: shipId,
                    ...wing.preparedWingInstance,
                },
                returnKeys: ['id'],
                client,
            });
            dataChanged ||= inserted;

            await insertWingVersion({
                record: {
                    mod_version_id: modInfo.modVersionId,
                    ship_id: shipId,
                    wing_instance_id: wingInstanceId,
                },
                client,
            });

            if (!inserted) continue;

            const { formation, role, ...preparedWingData } =
                wing.preparedWingData;

            await insertWingData({
                record: {
                    wing_instance_id: wingInstanceId,
                    formation_id: getOrThrow(wingFormations, formation),
                    role_id: getOrThrow(wingRoles, role),
                    ...preparedWingData,
                },
                client,
            });

            for (const weaponGroup of wing.preparedWingWeaponGroups) {
                const { id: weaponGroupId } = await insertWingWeaponGroup({
                    record: {
                        wing_instance_id: wingInstanceId,
                        mode: weaponGroup.mode,
                    },
                    returnKeys: ['id'],
                    client,
                });

                for (const [slot, weapon] of Object.entries(
                    weaponGroup.weapons,
                )) {
                    const weaponId = (
                        await getWeaponId({
                            where: { code: weapon },
                            client,
                        })
                    )?.id;

                    if (weaponId === undefined) {
                        throw new Error(
                            `Failed to find weapon id for: ${weapon}`,
                        );
                    }

                    await insertWingWeapon({
                        record: {
                            wing_weapon_group_id: weaponGroupId,
                            weapon_slot_code: slot,
                            weapon_id: weaponId,
                        },
                        client,
                    });
                }
            }

            await insertJunctionItems(
                wing.preparedWingTags,
                wingInstanceId,
                insertWingTag,
                insertWingTagJunction,
                { instanceKey: 'wing_instance_id', itemKey: 'tag_id' },
                client,
            );
        } catch (err) {
            const formatted = new Error(`Failed to insert to wing: ${code}`, {
                cause: err,
            });
            console.log(formatted);
        }
    }
    console.log(`Successfully imported wings from: ${modInfo.modCode}`);
    return dataChanged;
}
