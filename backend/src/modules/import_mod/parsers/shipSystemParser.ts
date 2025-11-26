import fs from 'fs';
import path from 'path';

import { parse } from 'csv';

import { prepareImage } from './imageParser.ts';
import type { PreparedImage } from '../../images/types.ts';
import type {
    PreparedFullShipSystem,
    PreparedShipSystemData,
    PreparedShipSystemDesc,
} from '../../ship_systems/types.ts';
import { convertString } from '../util/convert.ts';
import { combineHash, hashRecord } from '../util/hash.ts';

export type ShipSystemRecord = {
    name: string;
    id: string;
    icon: string;
};

type ParseContext = {
    fileDir: string;
    preparedShipSystemDescs: Record<string, PreparedShipSystemDesc>;
};

export async function parseShipSystems(
    fileDir: string,
    preparedShipSystemDescs: Record<string, PreparedShipSystemDesc>,
): Promise<{
    preparedFullShipSystems: Record<string, PreparedFullShipSystem>;
    preparedImages: Record<string, PreparedImage | null>;
}> {
    const preparedFullShipSystems: Record<string, PreparedFullShipSystem> = {};
    const preparedImages: Record<string, PreparedImage | null> = {};
    const csvFilePath = path.join(
        fileDir,
        'data',
        'shipsystems',
        'ship_systems.csv',
    );

    const ctx: ParseContext = { fileDir, preparedShipSystemDescs };

    try {
        const parser: AsyncIterable<ShipSystemRecord> = fs
            .createReadStream(csvFilePath)
            .pipe(
                parse({
                    columns: true,
                    skip_empty_lines: true,
                    trim: true,
                }),
            );

        for await (const record of parser) {
            if (record['name'].startsWith('#')) continue;
            if (!record['id']) continue;

            const prepared = await buildShipSystem(record, ctx);
            if (prepared == null) continue;

            const code = record['id'];
            preparedFullShipSystems[code] = prepared.preparedFullShipSystem;
            preparedImages[code] = prepared.preparedImage;
        }

        return {
            preparedFullShipSystems,
            preparedImages,
        };
    } catch (err) {
        throw new Error(`Failed to parse hullmods`, { cause: err });
    }
}

async function buildShipSystem(
    record: ShipSystemRecord,
    ctx: ParseContext,
): Promise<{
    preparedFullShipSystem: PreparedFullShipSystem;
    preparedImage: PreparedImage | null;
} | null> {
    const shipSystemCode = record.id;

    try {
        const preparedFullShipSystem = prepareFullShipSystem(record, ctx);

        const preparedImage =
            convertString(record.icon) != null
                ? await prepareImage(ctx.fileDir, record.icon)
                : null;

        return {
            preparedFullShipSystem,
            preparedImage,
        };
    } catch (err) {
        const formatted = new Error(
            `Failed to build ship system: ${shipSystemCode}`,
            {
                cause: err,
            },
        );
        console.log(formatted);
        return null;
    }
}

function prepareFullShipSystem(
    record: ShipSystemRecord,
    ctx: ParseContext,
): PreparedFullShipSystem {
    try {
        const desc = ctx.preparedShipSystemDescs[record.id] ?? null;
        const csvHash = hashRecord(record, Object.keys(record));
        let dataHash = csvHash;
        if (desc) {
            const descHash = hashRecord(desc, Object.keys(desc));
            dataHash = combineHash(csvHash, descHash);
        }

        return {
            preparedShipSystemInstance: { data_hash: dataHash },
            preparedShipSystemData: prepareShipSystemData(record),
            preparedShipSystemDesc: desc,
        };
    } catch (err) {
        throw new Error(`Failed to prepare ship system: ${record.id}`, {
            cause: err,
        });
    }
}

function prepareShipSystemData(
    record: ShipSystemRecord,
): PreparedShipSystemData {
    return {
        display_name: record.name,
    };
}
