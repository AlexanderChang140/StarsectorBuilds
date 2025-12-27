import type { Request, Response } from 'express';

import { HULLMOD_VERSIONS_FULL_COLUMNS } from './constants.ts';
import { fetchHullmodVersions } from './service.ts';
import { parseHullmodVersionFields } from './utils/fieldParser.ts';
import { parseHullmodTableSort } from './utils/sortParser.ts';
import { parseFilter, parseIntArray } from '../../utils/parser/filterParser.ts';
import { parseLimit } from '../../utils/parser/limitParser.ts';
import { parseOffset } from '../../utils/parser/offsetParser.ts';

export async function getAllHullmodVersions(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const query = req.query;

        const fields = parseHullmodVersionFields(query);
        const filter = parseFilter(
            query,
            HULLMOD_VERSIONS_FULL_COLUMNS,
            parseIntArray,
        );
        const order = parseHullmodTableSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const result = await fetchHullmodVersions(fields, options);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}
