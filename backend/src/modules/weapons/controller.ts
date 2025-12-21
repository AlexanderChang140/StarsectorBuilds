import type { Request, Response } from 'express';

import { fetchTableWeapons, fetchWeaponVersions } from './service.ts';
import { parseTableWeaponsFilter } from './utils/filterParser.ts';
import { parseWeaponTableSort } from './utils/sortParser.ts';
import { parseLimit } from '../../utils/parser/limitParser.ts';
import { parseOffset } from '../../utils/parser/offsetParser.ts';

export async function getTableWeapons(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;
        const filter = parseTableWeaponsFilter(query);
        const order = parseWeaponTableSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const result = await fetchTableWeapons(options);
        console.log('CONTROLLER', options)
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getWeaponVersions(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const weaponId = parseInt(req.params.weaponId ?? '', 10);

        if (isNaN(weaponId)) {
            res.status(400).json({ error: 'Invalid weapon ID' });
            return;
        }

        const result = await fetchWeaponVersions(weaponId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}
