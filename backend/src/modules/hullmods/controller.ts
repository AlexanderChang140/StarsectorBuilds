import type { Request, Response } from 'express';

import { getHullmodVersions } from "./service.ts";

export async function getTableHullmods(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const filter = {};
        const result = await getHullmodVersions(filter);
        const mapped = result?.map((row) => ({
            ...row,
            manufacturer: row.manufacturer ?? 'Common',
        }));
        
        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}
