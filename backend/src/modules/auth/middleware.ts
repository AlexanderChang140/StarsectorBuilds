import type { Request, Response, NextFunction } from 'express';

import { validateSession } from './service.ts';
import { asyncHandler } from '../../server/asyncHandler.ts';
import { UnauthorizedError } from '../../server/error.ts';

type Session = { userId: number; token: string };
type User = { username: string };

export const authMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies?.token;
        if (!token) {
            throw new UnauthorizedError('Authentication token missing');
        }

        const session = await validateSession(token);
        if (!session) {
            throw new UnauthorizedError('Invalid or expired session');
        }

        res.locals.session = { userId: session.user_id, token };
        res.locals.user = { username: session.username };

        next();
    },
);

export function getSession(res: Response): Session {
    return res.locals.session;
}

export function getUser(res: Response): User {
    return res.locals.user;
}
