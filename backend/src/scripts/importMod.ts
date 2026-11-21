import process from 'node:process';
import path from 'path';

import { pool } from '../db/client.ts';
import {
    importVanilla,
    importMod,
} from '../modules/import_mod/importers/importMod.ts';
import { logger } from '../utils/logger.ts';

async function main() {
    const [command, ...rest] = process.argv.slice(2);
    const args = rest.filter((a) => !a.startsWith('--'));
    const flags = rest.filter((a) => a.startsWith('--')).map((f) => f.slice(2));
    const update = flags.includes('update');

    try {
        switch (command) {
            case 'mod': {
                if (args.length !== 1 || !args[0]) {
                    logger.warn('Usage: mod <filePath>');
                    process.exitCode = 1;
                    return;
                }
                const [filePath] = args;
                await importMod(path.resolve(process.cwd(), filePath), update);
                logger.info('Imported mod successfully');
                break;
            }
            case 'vanilla': {
                if (
                    args.length !== 4 ||
                    !args[0] ||
                    !args[1] ||
                    !args[2] ||
                    !args[3]
                ) {
                    logger.warn(
                        'Usage: vanilla <major> <minor> <patch> <filePath>',
                    );
                    process.exitCode = 1;
                    return;
                }
                const [major, minor, patch, filePath] = args;
                await importVanilla(
                    path.resolve(process.cwd(), filePath),
                    parseInt(major, 10),
                    parseInt(minor, 10),
                    patch,
                    update,
                );
                logger.info(`Imported vanilla: ${major}.${minor}.${patch}`);
                break;
            }
            default:
                logger.warn('Unknown command:', command);
                logger.info('Available commands: mod, vanilla');
        }
    } finally {
        await pool.end();
    }
}

main().catch((err: Error) => {
    logger.error('CLI execution failed', { error: err });
    process.exit(1);
});
