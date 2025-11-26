import express from 'express';

import {
    getTableWeapons,
    getDisplayWeapon,
} from './controller.ts';

const router = express.Router();

router.get('/', (req, res) => {
    getTableWeapons(req, res);
});

router.get('/:id', (req, res) => {
    getDisplayWeapon(req, res);
});

export default router;