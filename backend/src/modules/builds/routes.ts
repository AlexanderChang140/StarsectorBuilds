import express from 'express';

import { getBuild, getBuilds, postBuild } from './controller.ts';
import { authMiddleware } from '../auth/middleware.ts';

const router = express.Router();

router.post('/builds', authMiddleware, postBuild);
router.get('/builds/:buildId', getBuild);
router.get('/builds', getBuilds);

export default router;
