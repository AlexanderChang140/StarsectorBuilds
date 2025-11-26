import type { PoolClient } from 'pg';

import type { ModInfo } from './importMod.ts';
import { insertJunctionItems } from '../../../db/helpers/insert.ts';
import { getOrThrow } from '../../../utils/helpers.ts';
import { insertImage } from '../../images/service.ts';
import {
    insertWeapon,
    insertWeaponInstance,
    insertWeaponVersion,
    insertWeaponSpecs,
    insertWeaponStats,
    insertWeaponText,
    insertWeaponDesc,
    insertProjWeapon,
    insertAmmoWeapon,
    insertBeamWeapon,
    insertWeaponHint,
    insertWeaponHintJunction,
    insertWeaponTag,
    insertWeaponTagJunction,
    insertWeaponGroup,
    insertWeaponGroupJunction,
    getWeaponSizes,
    getWeaponTypes,
    getDamageTypes,
} from '../../weapons/service.ts';
import { buildImage } from '../parsers/imageParser.ts';
import type { WeaponWithImages } from '../parsers/weaponParser.ts';

export async function importWeapons(
    modInfo: ModInfo,
    client: PoolClient,
    weapons: Record<string, WeaponWithImages>,
): Promise<boolean> {
    let dataChanged = false;

    const weaponSizes = await getWeaponSizes(client);
    const weaponTypes = await getWeaponTypes(client);
    const damageTypes = await getDamageTypes(client);

    for (const [code, weapon] of Object.entries(weapons)) {
        const {
            preparedFullWeapon,
            preparedTurretImage = null,
            preparedTurretGunImage = null,
            preparedHardpointImage = null,
            preparedHardpointGunImage = null,
        } = weapon;

        const turretImage = buildImage(
            modInfo.modCode,
            'weapons',
            preparedTurretImage,
        );
        const turretGunImage = buildImage(
            modInfo.modCode,
            'weapons',
            preparedTurretGunImage,
        );
        const hardpointGunImage = buildImage(
            modInfo.modCode,
            'weapons',
            preparedHardpointGunImage,
        );
        const hardpointImage = buildImage(
            modInfo.modCode,
            'weapons',
            preparedHardpointImage,
        );

        const turretImageId = turretImage
            ? (await insertImage(turretImage, { returning: ['id'], client })).id
            : null;
        const turretImageGunId = turretGunImage
            ? (await insertImage(turretGunImage, { returning: ['id'], client }))
                  .id
            : null;
        const hardpointImageId = hardpointImage
            ? (await insertImage(hardpointImage, { returning: ['id'], client }))
                  .id
            : null;
        const hardpointGunImageId = hardpointGunImage
            ? (
                  await insertImage(hardpointGunImage, {
                      returning: ['id'],
                      client,
                  })
              ).id
            : null;

        const { id: weaponId } = await insertWeapon(
            {
                mod_id: modInfo.modId,
                code,
            },
            { returning: ['id'], client },
        );

        const { id: weaponInstanceId, inserted } = await insertWeaponInstance(
            {
                weapon_id: weaponId,
                ...preparedFullWeapon.preparedWeaponInstance,
            },
            { returning: ['id'], client },
        );
        dataChanged ||= inserted;

        await insertWeaponVersion(
            {
                mod_version_id: modInfo.modVersionId,
                weapon_id: weaponId,
                weapon_instance_id: weaponInstanceId,
                turret_image_id: turretImageId,
                turret_gun_image_id: turretImageGunId,
                hardpoint_image_id: hardpointImageId,
                hardpoint_gun_image_id: hardpointGunImageId,
            },
            { client },
        );

        if (!inserted) continue;

        const { weapon_type, weapon_size, damage_type } =
            preparedFullWeapon.preparedWeaponSpecs;
        await insertWeaponSpecs(
            {
                weapon_instance_id: weaponInstanceId,
                weapon_type_id: getOrThrow(weaponTypes, weapon_type),
                weapon_size_id: getOrThrow(weaponSizes, weapon_size),
                damage_type_id: getOrThrow(damageTypes, damage_type),
            },
            { client },
        );

        await insertWeaponStats(
            {
                weapon_instance_id: weaponInstanceId,
                ...preparedFullWeapon.preparedWeaponStats,
            },
            { client },
        );

        await insertWeaponText(
            {
                weapon_instance_id: weaponInstanceId,
                ...preparedFullWeapon.preparedWeaponText,
            },
            { client },
        );

        if (preparedFullWeapon.preparedWeaponDesc) {
            await insertWeaponDesc(
                {
                    weapon_instance_id: weaponInstanceId,
                    ...preparedFullWeapon.preparedWeaponDesc,
                },
                { client },
            );
        }

        if (preparedFullWeapon.preparedProjWeapon) {
            await insertProjWeapon(
                {
                    weapon_instance_id: weaponInstanceId,
                    ...preparedFullWeapon.preparedProjWeapon,
                },
                { client },
            );
        }

        if (preparedFullWeapon.preparedAmmoWeapon) {
            await insertAmmoWeapon(
                {
                    weapon_instance_id: weaponInstanceId,
                    ...preparedFullWeapon.preparedAmmoWeapon,
                },
                { client },
            );
        }

        if (preparedFullWeapon.preparedBeamWeapon) {
            await insertBeamWeapon(
                {
                    weapon_instance_id: weaponInstanceId,
                    ...preparedFullWeapon.preparedBeamWeapon,
                },
                { client },
            );
        }

        await insertJunctionItems(
            preparedFullWeapon.weaponHints,
            weaponInstanceId,
            insertWeaponHint,
            insertWeaponHintJunction,
            { instanceKey: 'weapon_instance_id', itemKey: 'hint_id' },
            client,
        );

        await insertJunctionItems(
            preparedFullWeapon.weaponTags,
            weaponInstanceId,
            insertWeaponTag,
            insertWeaponTagJunction,
            { instanceKey: 'weapon_instance_id', itemKey: 'tag_id' },
            client,
        );

        await insertJunctionItems(
            preparedFullWeapon.weaponGroups,
            weaponInstanceId,
            insertWeaponGroup,
            insertWeaponGroupJunction,
            { instanceKey: 'weapon_instance_id', itemKey: 'group_id' },
            client,
        );
    }
    console.log(`Successfully imported weapons from: ${modInfo.modCode}`);
    return dataChanged;
}
