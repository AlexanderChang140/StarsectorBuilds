import express from 'express';

import {
    getTableShips,
    getShipVersion,
    getShipVersions,
    getShipWeaponSlots,
} from './controller.ts';

const router = express.Router();

router.get('/table', (req, res) => {
    getTableShips(req, res);
});

router.get('/:shipId/versions', (req, res) => {
    getShipVersions(req, res);
});

router.get('/ship-versions/:shipVersionId', (req, res) => {
    getShipVersion(req, res);
});

router.get('/ship-versions/:shipVersionId/slots', (req, res) => {
    getShipWeaponSlots(req, res);
});

export default router;
