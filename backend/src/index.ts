import dotenv from 'dotenv';

import { createApp } from './server/app.ts';
import { logger } from './utils/logger.ts';

dotenv.config();

const app = createApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
