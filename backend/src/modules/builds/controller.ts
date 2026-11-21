import {
    BUILD_FULL_KEYS,
    PreparedBuildSchema,
} from '@starsector-builds/shared/builds/types';
import type { Request, Response } from 'express';

import { createBuild, fetchBuildById, fetchBuilds } from './service.ts';
import { asyncHandler } from '../../server/asyncHandler.ts';
import { Status } from '../../server/constants/http.ts';
import { BadRequestError } from '../../server/error.ts';
import { parseFields } from '../../server/parser/fieldParser.ts';
import { parseLimit } from '../../server/parser/limitParser.ts';
import { parseOffset } from '../../server/parser/offsetParser.ts';
import type { ReqQuery } from '../../types/generic.ts';
import { numberOrNull } from '../../utils/parse.ts';
import { safeParse } from '../../utils/zod.ts';
import { getSession } from '../auth/middleware.ts';

export const postBuild = asyncHandler(async (req: Request, res: Response) => {
    const parsed = safeParse(req.body, PreparedBuildSchema);

    if (!parsed.success) {
        throw new BadRequestError('Invalid build data');
    }

    const { userId } = getSession(res);
    const buildId = await createBuild(userId, parsed.data);

    return res.status(Status.CREATED).json({ buildId });
});

export const getBuild = asyncHandler(async (req: Request, res: Response) => {
    const buildId = numberOrNull(req.params.buildId);

    if (buildId == null) {
        throw new BadRequestError('Invalid build ID');
    }

    const selection = parseFields(req.query, BUILD_FULL_KEYS);
    const build = await fetchBuildById(selection, buildId);

    return res.json(build);
});

export const getBuilds = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;

    const { selection, options } = parseBuildQuery(query);

    const { data, total } = await fetchBuilds(selection, options);

    return res.json({ data, meta: { total } });
});

function parseBuildQuery(query: ReqQuery) {
    const selection = parseFields(query, BUILD_FULL_KEYS);
    const limit = parseLimit(query);
    const offset = parseOffset(query);

    return { selection, options: { limit, offset } };
}
