import process from 'node:process';

import { pool } from '../db/client.ts';
import {
    cleanup,
    deleteMod,
    deleteModVersion,
} from '../services/cleanupService.ts';

async function main() {
    const [command, ...args] = process.argv.slice(2);
    switch (command) {
        case 'deleteMod':
            if (args.length != 1 || !args[0])
                throw new Error('Usage: deleteMod <code>');
            await deleteMod(args[0]);
            console.log(`Deleted mod: ${args[0]}`);
            break;

        case 'deleteModVersion':
            if (
                args.length != 4 ||
                !args[0] ||
                !args[1] ||
                !args[2] ||
                !args[3]
            ) {
                throw new Error(
                    'Usage: deleteModVersion <code> <major> <minor> <patch>',
                );
            }

            const [code, major, minor, patch] = args;
            await deleteModVersion(code, Number(major), Number(minor), patch);
            console.log(`Deleted mod version: code ${major}.${minor}.${patch}`);
            break;

        case 'cleanup':
            if (args.length != 0) throw new Error('Usage: cleanup');
            await cleanup();
            console.log('Cleaned up');
            break;
        default:
            console.log('Unknown command:', command);
            console.log(
                'Available commands: deleteMod, deleteModVersion, cleanup',
            );
    }
    pool.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
