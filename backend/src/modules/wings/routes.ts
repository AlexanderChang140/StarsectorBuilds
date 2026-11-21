import express from 'express';

import { getWingVersions } from './controller.ts';

const router = express.Router();

router.get('/wing-versions', getWingVersions);

export default router;
