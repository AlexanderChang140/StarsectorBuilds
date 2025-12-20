import express from 'express';

import { getTableWeapons, getWeaponVersions } from './controller.ts';

const router = express.Router();

router.get('/table', (req, res) => {
    getTableWeapons(req, res);
});

router.get('/:weaponId', (req, res) => {
    getWeaponVersions(req, res);
});

export default router;
