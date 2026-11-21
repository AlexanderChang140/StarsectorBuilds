import type { Request, Response } from 'express';

import {
    fetchMods,
    fetchModVersions,
    searchModsByDisplayName,
} from './service.ts';
import {
    parseModsFields,
    parseModVersionsFields,
} from './utils/fieldParser.ts';
import {
    parseModsFilter,
    parseModVersionsFilter,
} from './utils/filterParser.ts';
import { parseModsSort, parseModVersionsSort } from './utils/sortParser.ts';
import { asyncHandler } from '../../server/asyncHandler.ts';
import { parseLimit } from '../../server/parser/limitParser.ts';
import { parseOffset } from '../../server/parser/offsetParser.ts';
import { parseSearch } from '../../server/parser/searchParser.ts';

export const getMods = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;

    const fields = parseModsFields(query);
    const filter = parseModsFilter(query);
    const order = parseModsSort(query);
    const limit = parseLimit(query);
    const offset = parseOffset(query);
    const options = { filter, order, limit, offset };

    const { rows, total } = await fetchMods(fields, options);

    return res.json({ data: rows, meta: { total } });
});

export const getModVersions = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;

        const fields = parseModVersionsFields(query);
        const filter = parseModVersionsFilter(query);
        const order = parseModVersionsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);
        const options = { filter, order, limit, offset };

        const { rows, total } = await fetchModVersions(fields, options);

        return res.json({ data: rows, meta: { total } });
    },
);

export const getModSearchDisplayName = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;

        const search = parseSearch(query);

        const fields = parseModsFields(query);
        const filter = parseModsFilter(query, ['display_name']);
        const order = parseModsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);
        const options = { filter, order, limit, offset };

        const { rows, total } = await searchModsByDisplayName(
            search,
            fields,
            options,
        );

        return res.json({ data: rows, meta: { total } });
    },
);
