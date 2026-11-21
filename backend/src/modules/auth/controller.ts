import type { Request, Response } from 'express';

import { signup, login, logout, validateSession } from './service.ts';
import { config } from '../../config/env.ts';
import { asyncHandler } from '../../server/asyncHandler.ts';
import { Status } from '../../server/constants/http.ts';
import { BadRequestError, UnauthorizedError } from '../../server/error.ts';
import { logger } from '../../utils/logger.ts';

export const postSignup = asyncHandler(async (req: Request, res: Response) => {
    const { username, password, email } = parseSignup(req);

    const result = await signup(username, password, email);

    generateSessionCookie(res, result.token);

    return res
        .status(Status.CREATED)
        .json({ username: result.username, message: 'Signup successful' });
});

export const postLogin = asyncHandler(async (req: Request, res: Response) => {
    const { identifier, password } = parseLogin(req);

    const result = await login(identifier, password);

    generateSessionCookie(res, result.token);

    return res.json({ username: result.username, message: 'Login successful' });
});

export const postLogout = asyncHandler(async (req: Request, res: Response) => {
    if (req.cookies?.token) {
        const isLoggedOut = await logout(
            req.cookies[config.session.cookieName],
        );
        if (!isLoggedOut) {
            logger.warn('Failed to log out');
        }
    }

    res.clearCookie(config.session.cookieName);
    return res.json({ message: 'Logged out' });
});

export const getValidate = asyncHandler(async (req: Request, res: Response) => {
    const session = await validateSession(
        req.cookies[config.session.cookieName],
    );

    if (session == null) {
        throw new UnauthorizedError('Invalid session');
    }

    return res.json({
        user: { username: session.username },
        message: 'Valid session',
    });
});

function parseSignup(req: Request): {
    username: string;
    password: string;
    email: string;
} {
    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const username = req.body.username?.toString();
    const password = req.body.password?.toString();
    const email = req.body.email?.toString();

    if (!username || !usernamePattern.test(username)) {
        throw new BadRequestError('Invalid or missing username');
    }
    if (!email || !emailPattern.test(email)) {
        throw new BadRequestError('Invalid or missing email');
    }
    if (!password) {
        throw new BadRequestError('Missing password');
    }

    return { username, password, email };
}

function parseLogin(req: Request): {
    identifier: string;
    password: string;
} {
    const identifier = req.body.identifier?.toString();
    const password = req.body.password?.toString();
    if (!identifier || identifier.trim() === '') {
        throw new BadRequestError('Missing username or email');
    }
    if (!password) {
        throw new BadRequestError('Missing password');
    }

    return { identifier: identifier.trim(), password };
}
function generateSessionCookie(res: Response, token: string) {
    res.cookie(config.session.cookieName, token, {
        httpOnly: true,
        secure: config.isProd,
        sameSite: 'strict',
        maxAge: config.session.ttlMs,
    });
}
