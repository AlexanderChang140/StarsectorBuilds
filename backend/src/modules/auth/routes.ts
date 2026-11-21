import express from 'express';

import {
    postSignup,
    postLogin,
    postLogout,
    getValidate,
} from './controller.ts';

const router = express.Router();

router.post('/signup', postSignup);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.get('/validate', getValidate);
router.get('/validate', getValidate);

export default router;
