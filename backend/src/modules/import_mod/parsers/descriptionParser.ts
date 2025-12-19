import fs from 'fs';
import path from 'path';

import { parse } from 'csv';

import type { PreparedShipSystemDesc } from '../../ship_systems/types.ts';
import type { PreparedShipDesc } from '../../ships/types/types.ts';
import type { PreparedWeaponDesc } from '../../weapons/types/desc.ts';
import { convertString } from '../util/convert.ts';

type DescriptionRecord = {
    id: string;
    type: string;
    text1: string;
    text2: string;
    text3: string;
};

export type Descriptions = {
    preparedWeaponDescs: Record<string, PreparedWeaponDesc>;
    preparedShipSystemDescs: Record<string, PreparedShipSystemDesc>;
    preparedShipDescs: Record<string, PreparedShipDesc>;
};

export async function parseDescriptions(
    fileDir: string,
): Promise<Descriptions> {
    const preparedWeaponDescs: Record<string, PreparedWeaponDesc> = {};
    const preparedShipSystemDescs: Record<string, PreparedShipSystemDesc> = {};
    const preparedShipDescs: Record<string, PreparedShipDesc> = {};
    const csvFilePath = path.join(
        fileDir,
        'data',
        'strings',
        'descriptions.csv',
    );

    try {
        const parser: AsyncIterable<DescriptionRecord> = fs
            .createReadStream(csvFilePath)
            .pipe(
                parse({
                    columns: true,
                    skip_empty_lines: true,
                    trim: true,
                }),
            );

        for await (const record of parser) {
            switch (record.type) {
                case 'WEAPON':
                    preparedWeaponDescs[record.id] = {
                        text1: convertString(record.text1),
                        text2: convertString(record.text2),
                    };
                    break;
                case 'SYSTEM':
                    preparedShipSystemDescs[record.id] = {
                        text1: convertString(record.text1),
                        text2: convertString(record.text2),
                        text3: convertString(record.text3),
                    };
                    break;
                case 'SHIP':
                    preparedShipDescs[record.id] = {
                        text1: convertString(record.text1),
                        text2: convertString(record.text2),
                    };
                    break;
            }
        }
        return {
            preparedWeaponDescs,
            preparedShipSystemDescs,
            preparedShipDescs,
        };
    } catch (err) {
        throw new Error(`Failed to parse descriptions.csv`, { cause: err });
    }
}
