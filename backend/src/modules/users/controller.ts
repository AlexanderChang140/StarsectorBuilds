import dotenv from 'dotenv';
import type { Request, Response } from 'express';

import {
    signup as Ssignup,
    login as Slogin,
    logout as Slogout,
    validateSession,
} from './auth.ts';

dotenv.config();

export async function signup(req: Request, res: Response) {
    const { username, password } = parseBody(req);

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    const token = await Ssignup(username, password);

    if (token) {
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
        });
        return res.status(201).json({ username, message: 'Signup successful' });
    } else {
        return res.status(409).json({ error: 'User already exists' });
    }
}

export async function login(req: Request, res: Response) {
    const { username, password } = parseBody(req);

    if (!username || !password) {
        return res
            .status(400)
            .json({ username, error: 'Missing username or password' });
    }

    const token = await Slogin(username, password);

    if (token) {
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
        });
        return res.status(200).json({ username, message: 'Login successful' });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
}

export async function logout(req: Request, res: Response) {
    Slogout(req.cookies.token);
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out' });
}

export async function validate(req: Request, res: Response) {
    const username = await validateSession(req.cookies.token);
    if (username !== undefined) {
        return res.status(200).json({ username, message: 'Valid session' });
    } else {
        return res.status(401).json({ error: 'Invalid session' });
    }
}

function parseBody(req: Request) {
    const username = req.body.username?.toString();
    const password = req.body.password?.toString();
    return { username, password };
}
