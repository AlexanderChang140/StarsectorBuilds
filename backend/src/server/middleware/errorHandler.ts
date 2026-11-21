import type { Request, Response, NextFunction } from 'express';

import { logger } from '../../utils/logger.ts';
import { Status } from '../constants/http.ts';
import { AppError } from '../error.ts';

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) {
    if (err instanceof AppError) {
        logger.warn(err.message);

        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                status: err.statusCode,
            },
        });
    }

    logger.error('Unhandled exception', { error: err });

    return res.status(Status.INTERNAL_SERVER_ERROR).json({
        error: {
            message: 'Internal server error',
            status: Status.INTERNAL_SERVER_ERROR,
        },
    });
}
