import process from 'node:process';
import path from 'path';

import { pool } from '../db/client.ts';
import {
    importVanilla,
    importMod,
} from '../modules/import_mod/importers/importMod.ts';

async function main() {
    const [command, ...rest] = process.argv.slice(2);
    const args = rest.filter((a) => !a.startsWith('--'));
    const flags = rest.filter((a) => a.startsWith('--')).map((f) => f.slice(2));
    const update = flags.includes('update');
    switch (command) {
        case 'mod':
            if (args.length != 1 || !args[0]) {
                throw new Error('Usage: mod <filePath>');
            }
            const filePath1 = args[0];
            await importMod(path.resolve(process.cwd(), filePath1), update);
            console.log('Imported mod');
            pool.end();
            break;

        case 'vanilla':
            if (
                args.length != 4 ||
                !args[0] ||
                !args[1] ||
                !args[2] ||
                !args[3]
            ) {
                throw new Error(
                    'Usage: vanilla <major> <minor> <patch> <filePath>',
                );
            }
            const [major, minor, patch, filePath2] = args;
            await importVanilla(
                path.resolve(process.cwd(), filePath2),
                parseInt(major, 10),
                parseInt(minor, 10),
                patch,
                update,
            );
            console.log(`Imported vanilla: ${major}.${minor}.${patch}`);
            pool.end();
            break;
        default:
            console.log('Unknown command:', command);
            console.log('Available commands: mod, vanilla');
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
