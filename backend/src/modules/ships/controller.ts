import {
    SHIP_VERSION_FULL_KEYS,
    SHIP_WEAPON_SLOT_FULL_KEYS,
    ShipVersionFullSchema,
    ShipWeaponSlotFullSchema,
    type ShipVersionFull,
} from '@starsector-builds/shared/ships/schema';
import type { Request, Response } from 'express';

import {
    SHIP_VERSION_FULL_FILTER_KEYS,
    SHIP_VERSION_FULL_SORT_KEYS,
} from './constants.ts';
import {
    fetchShipVersionsFull,
    fetchShipVersionFull,
    fetchShipWeaponSlotsFull,
} from './service.ts';
import {
    createFilterCondition,
    createFilterOption,
} from '../../db/helpers/filter.ts';
import type { Options } from '../../db/types.ts';
import { asyncHandler } from '../../server/asyncHandler.ts';
import { BadRequestError } from '../../server/error.ts';
import { parseQuery } from '../../server/parser/queryParser.ts';
import type { ReqQuery } from '../../types/generic.ts';
import { numberOrNull } from '../../utils/parse.ts';

export const getShipVersionsByShipId = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;
        const shipId = numberOrNull(req.params.shipId);

        if (shipId == null) {
            throw new BadRequestError('Invalid ship ID');
        }

        const { selection } = parseShipVersionQuery(query);
        const { rows, total } = await fetchShipVersionsFull(
            selection,
            createFilterOption('ship_id', shipId),
        );

        return res.json({ data: rows, meta: { total } });
    },
);

export const getLatestShipVersionByShipId = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;
        const shipId = numberOrNull(req.params.shipId);

        if (shipId == null) {
            throw new BadRequestError('Invalid ship ID');
        }

        const { selection } = parseShipVersionQuery(query);
        const options: Options<ShipVersionFull> = {
            filter: {
                ship_id: createFilterCondition(shipId),
            },
            order: [
                { field: 'major', order: 'ASC' },
                { field: 'minor', order: 'ASC' },
                { field: 'patch', order: 'ASC' },
            ],
        };
        const result = await fetchShipVersionFull(selection, options);

        return res.json({ data: result });
    },
);

export const getShipVersions = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;

        const { selection, options } = parseShipVersionQuery(query);
        const { rows, total } = await fetchShipVersionsFull(selection, options);

        return res.json({ data: rows, meta: { total } });
    },
);

export const getShipVersionByVid = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;
        const shipVersionId = numberOrNull(req.params.shipVersionId);

        if (shipVersionId == null) {
            throw new BadRequestError('Invalid ship version ID');
        }

        const { selection } = parseShipVersionQuery(query);
        const result = await fetchShipVersionFull(
            selection,
            createFilterOption('ship_version_id', shipVersionId),
        );

        return res.json(result);
    },
);

export const getShipWeaponSlotsByVid = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;
        const shipVersionId = numberOrNull(req.params.shipVersionId);

        if (shipVersionId == null) {
            throw new BadRequestError('Invalid ship version ID');
        }

        const shipInstanceId = (
            await fetchShipVersionFull(
                ['ship_instance_id'],
                createFilterOption('ship_instance_id', shipVersionId),
            )
        ).ship_instance_id;

        const { selection } = parseShipWeaponSlotQuery(query);
        const { rows, total } = await fetchShipWeaponSlotsFull(
            selection,
            createFilterOption('ship_instance_id', shipInstanceId),
        );

        return res.json({ data: rows, meta: { total } });
    },
);

export const getWeaponSlots = asyncHandler(
    async (req: Request, res: Response) => {
        const query = req.query;

        const { selection, options } = parseShipWeaponSlotQuery(query);
        const { rows, total } = await fetchShipWeaponSlotsFull(
            selection,
            options,
        );

        return res.json({ data: rows, meta: { total } });
    },
);

function parseShipVersionQuery(query: ReqQuery) {
    return parseQuery(
        query,
        SHIP_VERSION_FULL_KEYS,
        SHIP_VERSION_FULL_FILTER_KEYS,
        ShipVersionFullSchema,
        SHIP_VERSION_FULL_SORT_KEYS,
    );
}

function parseShipWeaponSlotQuery(query: ReqQuery) {
    return parseQuery(
        query,
        SHIP_WEAPON_SLOT_FULL_KEYS,
        SHIP_WEAPON_SLOT_FULL_KEYS,
        ShipWeaponSlotFullSchema,
        SHIP_WEAPON_SLOT_FULL_KEYS,
    );
}
