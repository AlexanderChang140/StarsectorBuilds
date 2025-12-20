import type { Request, Response } from 'express';

import {
    fetchShipVersion,
    fetchShipVersions,
    fetchTableShips,
    fetchShipWeaponSlots,
    fetchShipInstanceId,
} from './service.ts';
import { parseTableShipsFilter } from './utils/filterParser.ts';
import { parseShipTableSort } from './utils/sortParser.ts';
import { parseLimit } from '../../utils/parser/limitParser.ts';
import { parseOffset } from '../../utils/parser/offsetParser.ts';

export async function getTableShips(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;

        const filter = parseTableShipsFilter(query);
        const order = parseShipTableSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);
        const options = { filter, order, limit, offset };

        const result = await fetchTableShips(options);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getShipVersions(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const shipId = parseInt(req.params.shipId ?? '', 10);

        if (isNaN(shipId)) {
            res.status(400).json({ error: 'Invalid ship ID' });
            return;
        }

        const result = await fetchShipVersions(shipId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getShipVersion(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const shipVersionId = parseInt(req.params.shipVersionId ?? '', 10);

        if (isNaN(shipVersionId)) {
            res.status(400).json({ error: 'Invalid ship version ID' });
            return;
        }

        const result = await fetchShipVersion(shipVersionId);

        if (result == null) {
            res.status(404).json({ error: 'Ship version not found' });
            return;
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getShipWeaponSlots(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const shipVersionId = Number(req.params.shipVersionId);

        if (isNaN(shipVersionId)) {
            res.status(400).json({ error: 'Invalid ship version ID' });
            return;
        }

        const shipInstanceId = await fetchShipInstanceId(shipVersionId);

        if (shipInstanceId == null) {
            res.status(404).json({ error: 'Ship instance not found' });
            return;
        }

        const result = await fetchShipWeaponSlots(shipInstanceId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}
