import express from 'express';

import {
    getAllWeaponVersions,
    getLatestWeaponVersion,
    getWeaponVersion,
    getWeaponVersions,
} from './controller.ts';

const router = express.Router();

router.get('/weapons/:weaponId/versions', getWeaponVersions);

router.get('/weapons/:weaponId/versions/latest', getLatestWeaponVersion);

router.get('/weapon-versions', getAllWeaponVersions);

router.get('/weapon-versions/:weaponVersionId', getWeaponVersion);

export default router;
