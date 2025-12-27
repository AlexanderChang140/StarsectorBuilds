import path from 'path';

import dotenv from 'dotenv';
import express from 'express';

import authRouter from './modules/auth/routes.ts';
import hullmodsRouter from './modules/hullmods/routes.ts';
import shipsRouter from './modules/ships/routes.ts';
import weaponsRouter from './modules/weapons/routes.ts';
import router from './routes/routes.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', router);
app.use('/api', authRouter);
app.use('/api', weaponsRouter);
app.use('/api', hullmodsRouter);
app.use('/api', shipsRouter);
app.use('/images', express.static(path.resolve(process.env.IMAGE_DIR ?? '')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
