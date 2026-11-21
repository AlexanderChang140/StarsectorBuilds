import {
    WING_KEYS,
    WingVersionFullSchema,
} from '@starsector-builds/shared/wings/schema';
import type { Request, Response } from 'express';

import { fetchWingVersionsFull } from './service.ts';
import { asyncHandler } from '../../server/asyncHandler.ts';
import { parseFields } from '../../server/parser/fieldParser.ts';
import { parseFilter } from '../../server/parser/filterParser.ts';
import { parseLimit } from '../../server/parser/limitParser.ts';
import { parseOffset } from '../../server/parser/offsetParser.ts';
import { parseSort } from '../../server/parser/sortParser.ts';
import { removeArrayKeys } from '../../utils/helpers.ts';

export const getWingVersions = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;

        const selection = parseFields(query, WING_KEYS);
        const filter = parseFilter(
            query,
            removeArrayKeys(WING_KEYS, ['tags']),
            WingVersionFullSchema,
        );
        const order = parseSort(query, WING_KEYS);
        const limit = parseLimit(query);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const { rows, total } = await fetchWingVersionsFull(selection, options);
        res.json({ data: rows, meta: { total } });
    },
);
