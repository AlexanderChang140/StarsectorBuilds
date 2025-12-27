import express from 'express';

import { getAllWeaponVersions, getWeaponVersions } from './controller.ts';

const router = express.Router();

router.get('/weapons/:weaponId/versions', (req, res) => {
    getWeaponVersions(req, res);
});

router.get('/weapon-versions', (req, res) => {
    getAllWeaponVersions(req, res);
});

export default router;
