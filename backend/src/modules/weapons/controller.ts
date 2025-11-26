import type { Request, Response } from 'express';

import { getFullWeaponVersions } from './service.ts';
import { parseWeaponTableFilter } from './utils/weaponFilterParser.ts';
import { parseWeaponTableSort } from './utils/weaponSortParser.ts';
import { parseLimit } from '../../utils/parser/limitParser.ts';
import { parseOffset } from '../../utils/parser/offsetParser.ts';

export async function getTableWeapons(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;
        const filter = parseWeaponTableFilter(query);
        const order = parseWeaponTableSort(query);
        const limit = parseLimit(query, 20);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const result = await getFullWeaponVersions(options);

        const mapped = result?.map((row) => ({
            ...row,
            manufacturer: row.manufacturer ?? 'Common',
        }));

        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getDisplayWeapon(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid weapon ID' });
            return;
        }

        const filter = { weapon_id: [id] };
        const result = await getFullWeaponVersions({ filter });
        const mapped = result?.map((row) => ({
            ...row,
            manufacturer: row.manufacturer ?? 'Common',
        }));
        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}
