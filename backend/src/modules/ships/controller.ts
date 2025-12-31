import type { Request, Response } from 'express';

import {
    fetchShipVersions,
    fetchShipWeaponSlots,
    fetchShipInstanceId,
    fetchShipVersionsById,
} from './service.ts';
import { parseShipVersionFields } from './utils/fieldParser.ts';
import { parseShipVersionsFilter } from './utils/filterParser.ts';
import { parseShipVersionsSort } from './utils/sortParser.ts';
import { parseLimit } from '../../utils/parser/limitParser.ts';
import { parseOffset } from '../../utils/parser/offsetParser.ts';

export async function getShipVersions(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;

        const shipId = Number(req.params.shipId);

        if (isNaN(shipId)) {
            res.status(400).json({ error: 'Invalid ship ID' });
            return;
        }

        const fields = parseShipVersionFields(query);
        const filter = parseShipVersionsFilter(query, ['ship_id']);
        const order = parseShipVersionsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);
        const options = { filter, order, limit, offset };

        const result = await fetchShipVersionsById(shipId, fields, options);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getLatestShipVersion(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;

        const shipId = Number(req.params.shipId);

        if (isNaN(shipId)) {
            res.status(400).json({ error: 'Invalid ship ID' });
            return;
        }

        const fields = parseShipVersionFields(query);

        const result = await fetchShipVersionsById(shipId, fields);

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


export async function getAllShipVersions(req: Request, res: Response) {
    try {
        const query = req.query;

        const fields = parseShipVersionFields(query);
        const filter = parseShipVersionsFilter(query);
        const order = parseShipVersionsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);
        const options = { filter, order, limit, offset };

        const result = await fetchShipVersions(fields, options);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getShipWeaponSlots(req: Request, res: Response) {
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
