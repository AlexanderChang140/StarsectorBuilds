import type { PoolClient } from 'pg';

import type { ModInfo } from './importMod.ts';
import { createKeyedFilter } from '../../../db/helpers/filter.ts';
import { assertDefined } from '../../../utils/assert.ts';
import { logger } from '../../../utils/logger.ts';
import { getHullmodId } from '../../hullmods/service.ts';
import {
    selectShipId,
    insertBuiltInHullmod,
    insertBuiltInWeapon,
    insertBuiltInWing,
} from '../../ships/service.ts';
import { getWeaponId } from '../../weapons/service.ts';
import type { PreparedBuiltIn } from '../types/ships.ts';

export async function importBuiltIn(
    modInfo: ModInfo,
    client: PoolClient,
    preparedBuiltIn: Record<string, PreparedBuiltIn>,
    shipInstanceIds: Record<string, number>,
    csvIdToShipCode: Record<string, string>,
): Promise<boolean> {
    let dataChanged = false;

    for (const [shipCode, builtIn] of Object.entries(preparedBuiltIn)) {
        try {
            const shipInstanceId = shipInstanceIds[shipCode];

            assertDefined(
                shipInstanceId,
                `Failed to find ship instance id for: ${shipCode}`,
            );

            for (const [slotCode, weaponCode] of Object.entries(
                builtIn.preparedBuiltInWeapons,
            )) {
                const weapon = await getWeaponId({
                    where: createKeyedFilter('code', weaponCode),
                    client,
                });

                assertDefined(
                    weapon,
                    `Failed to find weapon id for: ${weaponCode}`,
                );

                await insertBuiltInWeapon({
                    record: {
                        ship_instance_id: shipInstanceId,
                        weapon_id: weapon.id,
                        slot_code: slotCode,
                    },
                    client,
                });
            }

            for (const hullmodCode of builtIn.preparedBuiltInHullmods) {
                const hullmod = await getHullmodId({
                    where: createKeyedFilter('code', hullmodCode),
                    client,
                });

                assertDefined(
                    hullmod,
                    `Failed to find hullmod id for: ${hullmodCode}`,
                );

                await insertBuiltInHullmod({
                    record: {
                        ship_instance_id: shipInstanceId,
                        hullmod_id: hullmod.id,
                    },
                    client,
                });
            }

            for (const [wingCode, numWings] of Object.entries(
                builtIn.preparedBuiltInWings,
            )) {
                const wingShipCode = csvIdToShipCode[wingCode];

                assertDefined(
                    wingShipCode,
                    `Failed to find ship code for ${wingCode}`,
                );

                const wing = await selectShipId({
                    where: {
                        ...createKeyedFilter('code', wingShipCode),
                        ...createKeyedFilter('mod_id', modInfo.modId),
                    },
                    client,
                });

                assertDefined(
                    wing,
                    `Failed to find ship id for: ${wingShipCode}`,
                );

                await insertBuiltInWing({
                    record: {
                        ship_instance_id: shipInstanceId,
                        ship_id: wing.id,
                        num_wings: numWings,
                    },
                    client,
                });
            }
        } catch (err) {
            throw new Error(
                `Failed to insert to built-in items for: ${shipCode}`,
                {
                    cause: err,
                },
            );
        }
    }
    logger.info(`Successfully imported built-in from: ${modInfo.modCode}`);
    return dataChanged;
}
