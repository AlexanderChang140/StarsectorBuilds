import process from 'node:process';

import { pool } from '../db/client.ts';
import {
    cleanup,
    deleteMod,
    deleteModVersion,
} from '../services/cleanupService.ts';
import { logger } from '../utils/logger.ts';

async function main() {
    const [command, ...args] = process.argv.slice(2);
    switch (command) {
        case 'deleteMod':
            if (args.length != 1 || !args[0]) {
                process.exitCode = 1;
                logger.warn('Usage: deleteMod <code>');
                return;
            }

            const res = await deleteMod(args[0]);
            if (res) {
                logger.info(`Deleted mod: ${args[0]}`);
            } else {
                logger.error(`Failed to delete mod: ${args[0]}`);
            }

            break;

        case 'deleteModVersion':
            if (
                args.length != 4 ||
                !args[0] ||
                !args[1] ||
                !args[2] ||
                !args[3]
            ) {
                process.exitCode = 1;
                logger.warn(
                    'Usage: deleteModVersion <code> <major> <minor> <patch>',
                );
                return;
            }

            const [code, major, minor, patch] = args;
            await deleteModVersion(code, Number(major), Number(minor), patch);
            logger.info(`Deleted mod version: code ${major}.${minor}.${patch}`);
            break;

        case 'cleanup':
            if (args.length != 0) {
                process.exitCode = 1;
                logger.warn('Usage: cleanup');
                return;
            }
            await cleanup();
            logger.info('Cleaned up sucessfully');
            break;
        default:
            logger.warn('Unknown command:', command);
            logger.info(
                'Available commands: deleteMod, deleteModVersion, cleanup',
            );
    }
    pool.end();
}

main().catch((err: Error) => {
    logger.error(err.message, { error: err.cause });
    process.exit(1);
});
