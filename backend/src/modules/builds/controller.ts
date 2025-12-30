import { CreateBuildDTO } from '@shared/builds/types.ts';
import type { Request, Response } from 'express';

import type { User } from '../auth/auth.ts';

export function postBuild(req: Request, res: Response) {
    try {
        const user: User = res.locals.user;
        const build = CreateBuildDTO.parse(req.body.build);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error 500' });
    }
}

export function getBuild(req: Request, res: Response) {
    const buildId = Number(req.params.buildId);

    if (Number.isNaN(buildId)) {
        res.status(400).json({ error: 'Invalid build ID' });
        return;
    }
}
