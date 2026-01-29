import express from 'express';

import {
    getMods,
    getModSearchDisplayName,
    getModVersions,
} from './controller.ts';

const router = express.Router();

router.get('/mods', (req, res) => {
    getMods(req, res);
});

router.get('/mod-versions', (req, res) => {
    getModVersions(req, res);
});

router.get('/mods/search/display_name', (req, res) => {
    getModSearchDisplayName(req, res);
});

export default router;
