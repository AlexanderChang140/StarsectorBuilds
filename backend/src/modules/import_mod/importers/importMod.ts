import type { PoolClient } from 'pg';

import { importHullmods } from './importHullmods.ts';
import { importShips } from './importShips.ts';
import { importShipSystem } from './importShipSystem.ts';
import { importWeapons } from './importWeapons.ts';
import { pool } from '../../../db/client.ts';
import {
    insertMod,
    insertModVersion,
    setDataChanged,
} from '../../../services/modService.ts';
import {
    parseDescriptions,
    type Descriptions,
} from '../parsers/descriptionParser.ts';
import { parseHullmods } from '../parsers/hullmodParser.ts';
import { parseModInfo, parseVersionFile } from '../parsers/modParser.ts';
import { parseShips } from '../parsers/shipParser.ts';
import { parseShipSystems } from '../parsers/shipSystemParser.ts';
import { parseWeapons } from '../parsers/weaponParser.ts';

/**
 * Parses the mod data and imports it into the database
 *
 * @param {string} fileDir - Path to the mod directory
 */

export async function importMod(fileDir: string, update: boolean = false) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const modInfo = await parseModInfo(fileDir);
        const version = await parseVersionFile(fileDir);
        const modId = (
            await insertMod(
                { code: modInfo.code, display_name: modInfo.name },
                { returning: ['id'], client },
            )
        ).id;
        const modVersion = await insertModVersion(
            {
                mod_id: modId,
                major: version.major,
                minor: version.minor,
                patch: version.patch,
            },
            { returning: ['id'], client },
        );
        const descs = await parseDescriptions(fileDir);

        if (!update && !modVersion.inserted) {
            throw new Error(
                `Mod version already exists: ${modInfo.code} ${version.major}.${version.minor}.${version.patch}`,
            );
        }

        await importContent(
            fileDir,
            modId,
            modVersion.id,
            modInfo.code,
            client,
            descs,
        );
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Failed to import mod: ${fileDir}`, {
            cause: err,
        });
    } finally {
        client.release();
    }
}

export async function importVanilla(
    fileDir: string,
    major: number,
    minor: number,
    patch: string,
    update: boolean = false,
) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const modCode = 'starsector';
        const modName = 'Starsector';
        const modId = (
            await insertMod(
                { code: modCode, display_name: modName },
                { returning: ['id'], client },
            )
        ).id;
        const modVersion = await insertModVersion(
            {
                mod_id: modId,
                major: major,
                minor: minor,
                patch: patch,
            },
            { returning: ['id'], client },
        );
        const descs = await parseDescriptions(fileDir);

        if (!update && !modVersion.inserted) {
            throw new Error(
                `Vanilla version already exists: ${major}.${minor}.${patch}`,
            );
        }

        await importContent(
            fileDir,
            modId,
            modVersion.id,
            modCode,
            client,
            descs,
        );
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Failed to import vanilla: ${fileDir}`, {
            cause: err,
        });
    } finally {
        client.release();
    }
}

export type ModInfo = {
    modId: number;
    modVersionId: number;
    modCode: string;
};

export async function importContent(
    fileDir: string,
    modId: number,
    modVersionId: number,
    modCode: string,
    client: PoolClient,
    descs: Descriptions,
) {
    const modInfo = { modId, modVersionId, modCode };
    const weapons = await parseWeapons(fileDir, descs.preparedWeaponDescs);
    const hullmods = await parseHullmods(fileDir);
    const shipSystems = await parseShipSystems(
        fileDir,
        descs.preparedShipSystemDescs,
    );
    const ships = await parseShips(fileDir, descs.preparedShipDescs);

    const weaponDataChanged = await importWeapons(modInfo, client, weapons);
    const hullmodDataChanged = await importHullmods(modInfo, client, hullmods);
    const shipSystemDataChanged = await importShipSystem(
        modInfo,
        client,
        shipSystems,
    );
    const shipDataChanged = await importShips(modInfo, client, {
        preparedFullShips: ships.preparedShips,
        preparedImages: ships.preparedImages,
    });

    if (
        weaponDataChanged ||
        hullmodDataChanged ||
        shipSystemDataChanged ||
        shipDataChanged
    ) {
        await setDataChanged(modVersionId, client);
    }
}
