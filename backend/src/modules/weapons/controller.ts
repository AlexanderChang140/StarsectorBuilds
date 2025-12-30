import type { Request, Response } from 'express';

import {
    fetchWeaponVersionById,
    fetchWeaponVersions,
    fetchWeaponVersionsById,
} from './service.ts';
import { parseWeaponVersionFields } from './utils/fieldParser.ts';
import { parseWeaponsVersionsFilter } from './utils/filterParser.ts';
import { parseWeaponVersionsSort } from './utils/sortParser.ts';
import { parseLimit } from '../../utils/parser/limitParser.ts';
import { parseOffset } from '../../utils/parser/offsetParser.ts';

export async function getWeaponVersions(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;

        const weaponId = Number(req.params.weaponId);

        if (isNaN(weaponId)) {
            res.status(400).json({ error: 'Invalid weapon ID' });
            return;
        }

        const fields = parseWeaponVersionFields(query);
        const filter = parseWeaponsVersionsFilter(query, ['weapon_id']);
        const order = parseWeaponVersionsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const result = await fetchWeaponVersionsById(weaponId, fields, options);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getAllWeaponVersions(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;

        const fields = parseWeaponVersionFields(query);
        const filter = parseWeaponsVersionsFilter(query);
        const order = parseWeaponVersionsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const result = await fetchWeaponVersions(fields, options);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getWeaponVersion(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;

        const weaponVersionId = Number(req.params.weaponVersionId);

        if (isNaN(weaponVersionId)) {
            res.status(400).json({ error: 'Invalid weapon version ID' });
            return;
        }

        const fields = parseWeaponVersionFields(query);
        const result = await fetchWeaponVersionById(weaponVersionId, fields);

        if (result[0] === undefined) {
            res.status(400).json({ error: 'No weapon version found' });
            return;
        }
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}
