import express from 'express';

import { getAllHullmodVersions } from './controller.ts';

const router = express.Router();

router.get('/hullmod-versions', (req, res) => {
    getAllHullmodVersions(req, res);
});

export default router;
