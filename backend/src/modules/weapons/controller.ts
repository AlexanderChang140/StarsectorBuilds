import { WEAPON_VERSION_FULL_KEYS } from '@starsector-builds/shared/weapons/schema';
import type { Request, Response } from 'express';

import {
    fetchWeaponVersionById,
    fetchWeaponVersions,
    fetchWeaponVersionsById,
} from './service.ts';
import { parseWeaponsVersionsFilter } from './utils/filterParser.ts';
import { parseWeaponVersionsSort } from './utils/sortParser.ts';
import { asyncHandler } from '../../server/asyncHandler.ts';
import { BadRequestError, NotFoundError } from '../../server/error.ts';
import { parseFields } from '../../server/parser/fieldParser.ts';
import { parseLimit } from '../../server/parser/limitParser.ts';
import { parseOffset } from '../../server/parser/offsetParser.ts';
import { numberOrNull } from '../../utils/parse.ts';

export const getWeaponVersions = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;
        const weaponId = numberOrNull(req.params.weaponId);

        if (weaponId == null) {
            throw new BadRequestError('Invalid weapon ID');
        }

        const fields = parseFields(query, WEAPON_VERSION_FULL_KEYS);
        const filter = parseWeaponsVersionsFilter(query, ['weapon_id']);
        const order = parseWeaponVersionsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const { rows, total } = await fetchWeaponVersionsById(
            weaponId,
            fields,
            options,
        );

        return res.json({ data: rows, meta: { total } });
    },
);

export const getLatestWeaponVersion = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;
        const weaponId = numberOrNull(req.params.weaponId);

        if (weaponId == null) {
            throw new BadRequestError('Invalid weapon ID');
        }

        const fields = parseFields(query, WEAPON_VERSION_FULL_KEYS);
        const filter = parseWeaponsVersionsFilter(query, ['weapon_id']);

        const options = { filter };
        const result = await fetchWeaponVersionsById(weaponId, fields, options);

        if (result === null) {
            throw new NotFoundError('No weapon version found');
        }

        return res.json({ data: result });
    },
);

export const getAllWeaponVersions = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;

        const fields = parseFields(query, WEAPON_VERSION_FULL_KEYS);
        const filter = parseWeaponsVersionsFilter(query);
        const order = parseWeaponVersionsSort(query);
        const limit = parseLimit(query);
        const offset = parseOffset(query);

        const options = { filter, order, limit, offset };
        const { rows, total } = await fetchWeaponVersions(fields, options);

        return res.json({ data: rows, meta: { total } });
    },
);

export const getWeaponVersion = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;
        const weaponVersionId = numberOrNull(req.params.weaponVersionId);

        if (weaponVersionId == null) {
            throw new BadRequestError('Invalid weapon version ID');
        }

        const fields = parseFields(query, WEAPON_VERSION_FULL_KEYS);
        const result = await fetchWeaponVersionById(weaponVersionId, fields);

        if (result == null) {
            throw new NotFoundError('No weapon version found');
        }

        return res.json({ data: result });
    },
);
