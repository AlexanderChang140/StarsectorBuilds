import express from 'express';

import { getAllWeaponVersions, getWeaponVersion, getWeaponVersions } from './controller.ts';

const router = express.Router();

router.get('/weapons/:weaponId/versions', (req, res) => {
    getWeaponVersions(req, res);
});

router.get('/weapon-versions', (req, res) => {
    getAllWeaponVersions(req, res);
});

router.get('/weapon-versions/:weaponVersionId', (req, res) => {
    getWeaponVersion(req, res);
});

export default router;
