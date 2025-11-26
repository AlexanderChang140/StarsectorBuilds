import fs from 'fs';
import path from 'path';

import { parse } from 'csv';

import { prepareImage } from './imageParser.ts';
import type { PreparedFullHullmod, PreparedHullmodData } from '../../hullmods/types.ts';
import type { PreparedImage } from '../../images/types.ts';
import {
    convertBoolean,
    convertInteger,
    convertString,
} from '../util/convert.ts';
import { hashRecord } from '../util/hash.ts';

type HullmodRecord = {
    name: string;
    id: string;
    'tech/manufacturer': string;
    tags: string;
    uiTags: string;
    'base value': string;
    hidden: string;
    hiddenEverywhere: string;
    cost_frigate: string;
    cost_dest: string;
    cost_cruiser: string;
    cost_capital: string;
    desc: string;
    sModDesc: string;
    sprite: string;
}

/**
 * @param {*} fileDir
 * @returns
 */
export async function parseHullmods(fileDir: string): Promise<{
    preparedFullHullmods: Record<string, PreparedFullHullmod>;
    preparedImages: Record<string, PreparedImage | null>;
}> {
    const preparedHullmods: Record<string, PreparedFullHullmod> = {};
    const preparedImages: Record<string, PreparedImage | null> = {};
    const csvFilePath = path.join(fileDir, 'data', 'hullmods', 'hull_mods.csv');

    try {
        const parser: AsyncIterable<HullmodRecord> = fs
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

            const prepared = await buildHullmod(record, fileDir);
            if (prepared == null) continue;

            const code = record['id'];
            preparedHullmods[code] = prepared.preparedHullmod;
            preparedImages[code] = prepared.preparedImage;
        }

        return {
            preparedFullHullmods: preparedHullmods,
            preparedImages: preparedImages,
        };
    } catch (err) {
        throw new Error(`Failed to parse hullmods`, { cause: err });
    }
}

async function buildHullmod(
    record: HullmodRecord,
    fileDir: string,
): Promise<{
    preparedHullmod: PreparedFullHullmod;
    preparedImage: PreparedImage | null;
} | null> {
    const hullmodCode = record['id'];

    try {
        const preparedHullmod = prepareHullmod(record);
        const preparedImage =
            convertString(record['sprite']) != null
                ? await prepareImage(fileDir, record['sprite'])
                : null;
        return {
            preparedHullmod,
            preparedImage,
        };
    } catch (err) {
        const formatted = new Error(`Failed to build hullmod: ${hullmodCode}`, {
            cause: err,
        });
        console.log(formatted);
        return null;
    }
}

function prepareHullmod(record: HullmodRecord): PreparedFullHullmod {
    const csvHash = hashRecord(record, Object.keys(record));
    const prepared = {
        preparedHullmodInstance: { data_hash: csvHash },
        preparedHullmodData: prepareHullmodData(record),
        hullmodTags: [],
        hullmodUiTags: [],
    };
    return prepared;
}

function prepareHullmodData(record: HullmodRecord): PreparedHullmodData {
    return {
        display_name: convertString(record['name']),
        manufacturer: convertString(record['tech/manufacturer']),
        hullmod_desc: convertString(record['desc']),
        base_value: convertInteger(record['base value']),
        cost_frigate: convertInteger(record['cost_frigate']) ?? 0,
        cost_destroyer: convertInteger(record['cost_dest']) ?? 0,
        cost_cruiser: convertInteger(record['cost_cruiser']) ?? 0,
        cost_capital: convertInteger(record['cost_capital']) ?? 0,
        hide: convertBoolean(record['hidden']) ?? false,
        hide_everywhere: convertBoolean(record['hiddenEverywhere']) ?? false,
    };
}
