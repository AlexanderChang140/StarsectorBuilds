import express from 'express';

import {
    getMods,
    getModSearchDisplayName,
    getModVersions,
} from './controller.ts';

const router = express.Router();

router.get('/mods', getMods);

router.get('/mod-versions', getModVersions);

router.get('/mods/search/display_name', getModSearchDisplayName);

export default router;
