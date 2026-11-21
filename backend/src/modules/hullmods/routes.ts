import express from 'express';

import { getAllHullmodVersions } from './controller.ts';

const router = express.Router();

router.get('/hullmod-versions', getAllHullmodVersions);

export default router;
