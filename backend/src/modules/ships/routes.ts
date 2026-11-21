import express from 'express';

import {
    getShipVersions,
    getLatestShipVersionByShipId,
    getShipVersionByVid,
    getShipVersionsByShipId,
    getShipWeaponSlotsByVid,
    getWeaponSlots,
} from './controller.ts';

const router = express.Router();

router.get('/ships/:shipId/versions', getShipVersionsByShipId);

router.get('/ships/:shipId/versions/latest', getLatestShipVersionByShipId);

router.get('/ship-versions', getShipVersions);

router.get('/ship-versions/:shipVersionId', getShipVersionByVid);

router.get('/ship-versions/:shipVersionId/slots', getShipWeaponSlotsByVid);

router.get('/weapon-slots', getWeaponSlots);

export default router;
