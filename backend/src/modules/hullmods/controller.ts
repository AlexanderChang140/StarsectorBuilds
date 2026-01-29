import type { Request, Response } from 'express';

import { fetchHullmodVersions } from './service.ts';
import { parseHullmodVersionFields } from './utils/fieldParser.ts';
import { parseHullmodVersionFilter } from './utils/filterParser.ts';
import { parseHullmodTableSort } from './utils/sortParser.ts';
import { parseLimit } from '../../utils/parser/limitParser.ts';
import { parseOffset } from '../../utils/parser/offsetParser.ts';

export async function getAllHullmodVersions(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;

        const fields = parseHullmodVersionFields(query);
        const filter = parseHullmodVersionFilter(query);
        const order = parseHullmodTableSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const { rows, total } = await fetchHullmodVersions(fields, options);

        res.json({ data: rows, meta: { total } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}
