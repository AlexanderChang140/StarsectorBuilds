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
import { parseLimit } from '../../utils/parser/limitParser.ts';
import { parseOffset } from '../../utils/parser/offsetParser.ts';
import { parseSearch } from '../../utils/parser/searchParser.ts';

export async function getMods(req: Request, res: Response) {
    try {
        const query = req.query;

        const fields = parseModsFields(query);
        const filter = parseModsFilter(query);
        const order = parseModsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);
        const options = { filter, order, limit, offset };

        const { rows, total } = await fetchMods(fields, options);

        res.json({ data: rows, meta: { total } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getModVersions(req: Request, res: Response) {
    try {
        const query = req.query;

        const fields = parseModVersionsFields(query);
        const filter = parseModVersionsFilter(query);
        const order = parseModVersionsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);
        const options = { filter, order, limit, offset };

        const { rows, total } = await fetchModVersions(fields, options);

        res.json({ data: rows, meta: { total } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export async function getModSearchDisplayName(req: Request, res: Response) {
    try {
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

        res.json({ data: rows, meta: { total } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}
