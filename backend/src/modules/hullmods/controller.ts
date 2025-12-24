import type { Request, Response } from 'express';

import { fetchTableHullmods } from './service.ts';
import { parseHullmodTableSort } from './utils/sortParser.ts';
import { parseFilter, parseIntArray } from '../../utils/parser/filterParser.ts';
import { parseLimit } from '../../utils/parser/limitParser.ts';
import { parseOffset } from '../../utils/parser/offsetParser.ts';

export async function getTableHullmods(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;
        const filter = parseFilter(query, parseIntArray);
        const order = parseHullmodTableSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const result = await fetchTableHullmods(options);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}
