import cookieParser from 'cookie-parser';
import express from 'express';

import { signup, login, logout, validate } from './controller.ts';

const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.post('/signup', (req, res) => {
    signup(req, res);
});

router.post('/login', (req, res) => {
    login(req, res);
});

router.post('/logout', (req, res) => {
    logout(req, res);
});

router.get('/validate', (req, res) => {
    validate(req, res);
});

export default router;
