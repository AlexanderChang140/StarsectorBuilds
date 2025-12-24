import express from 'express';

import { getTableHullmods } from './controller.ts';

const router = express.Router();

router.get('/table', (req, res) => {
    getTableHullmods(req, res);
});



export default router;