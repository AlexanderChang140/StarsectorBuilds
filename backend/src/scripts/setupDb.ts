import process from 'node:process';

import { setup } from '../db/setup.ts';
import { logger } from '../utils/logger.ts';

async function main() {
    await setup();
}

main().catch((err: Error) => {
    logger.error(err.message, { error: err.cause });
    process.exit(1);
});
