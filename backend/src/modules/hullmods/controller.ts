import type { Request, Response } from 'express';

import { fetchHullmodVersions } from './service.ts';
import { parseHullmodVersionFields } from './utils/fieldParser.ts';
import { parseHullmodVersionFilter } from './utils/filterParser.ts';
import { parseHullmodTableSort } from './utils/sortParser.ts';
import { asyncHandler } from '../../server/asyncHandler.ts';
import { parseLimit } from '../../server/parser/limitParser.ts';
import { parseOffset } from '../../server/parser/offsetParser.ts';

export const getAllHullmodVersions = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;

        const fields = parseHullmodVersionFields(query);
        const filter = parseHullmodVersionFilter(query);
        const order = parseHullmodTableSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);
        const options = { filter, order, limit, offset };

        const { rows, total } = await fetchHullmodVersions(fields, options);

        return res.json({
            data: rows,
            meta: { total },
        });
    },
);
