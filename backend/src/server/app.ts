import path from 'path';

import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';

import { errorHandler } from './middleware/errorHandler.ts';
import authRouter from '../modules/auth/routes.ts';
import buildsRouter from '../modules/builds/routes.ts';
import hullmodsRouter from '../modules/hullmods/routes.ts';
import modsRouter from '../modules/mods/routes.ts';
import shipsRouter from '../modules/ships/routes.ts';
import weaponsRouter from '../modules/weapons/routes.ts';
import wingsRouter from '../modules/wings/routes.ts';
import router from '../routes/routes.ts';

dotenv.config();

export function createApp() {
    const app = express();

    app.set('query parser', 'extended');
    router.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    router.use(cookieParser());

    const imageDir = process.env.IMAGE_DIR || path.resolve('public/images');
    app.use('/images', express.static(imageDir));

    app.use('/', router);
    app.use('/api', authRouter);
    app.use('/api', modsRouter);
    app.use('/api', weaponsRouter);
    app.use('/api', wingsRouter);
    app.use('/api', hullmodsRouter);
    app.use('/api', shipsRouter);
    app.use('/api', buildsRouter);

    app.use(errorHandler);

    return app;
}
