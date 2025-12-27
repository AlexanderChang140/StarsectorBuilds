import express from 'express';

import {
    getAllShipVersions,
    getShipVersions,
    getShipWeaponSlots,
} from './controller.ts';

const router = express.Router();

router.get('/ships/:shipId/versions', (req, res) => {
    getShipVersions(req, res);
});

router.get('/ship-versions', (req, res) => {
    getAllShipVersions(req, res);
});

router.get('/ship-versions/shipVersionId/slots', (req, res) => {
    getShipWeaponSlots(req, res);
});

export default router;
