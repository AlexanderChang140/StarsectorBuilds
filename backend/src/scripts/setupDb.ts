import process from 'node:process';

import { setup } from '../db/setup.ts';

async function main() {
    await setup(); 
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});