import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import { parse } from 'csv';
import fg from 'fast-glob';
import { parse as jparse } from 'jsonc-parser';

import { assertDefined } from "../../../utils/assert.ts";
import type { PreparedFullWing, PreparedWingData } from '../../wings/types.ts';
import { isWingFormation, isWingRole } from '../../wings/utils/validate.ts';
import {
    convertArray,
    convertInteger,
    convertString,
} from '../util/convert.ts';
import { hashRecord, hashJson, combineHash } from '../util/hash.ts';
import { validateOrThrow } from '../util/validate.ts';

type WingRecord = {
    id: string;
    variant: string;
    tags: string;
    'op cost': string;
    formation: string;
    range: string;
    num: string;
    role: string;
    'role desc': string;
    refit: string;
    'base value': string;
};

type ParseContext = {
    fileDir: string;
};

/**
 * @param {*} fileDir
 * @returns
 */
export async function parseWings(fileDir: string): Promise<{
    preparedWings: Record<string, PreparedFullWing>;
    csvIdToShipCode: Record<string, string>;
}> {
    const preparedWings: Record<string, PreparedFullWing> = {};
    const csvIdToShipCode: Record<string, string> = {};
    const csvFilePath = path.join(fileDir, 'data', 'hulls', 'wing_data.csv');

    const ctx = { fileDir } as const;

    try {
        const parser: AsyncIterable<WingRecord> = fs
            .createReadStream(csvFilePath)
            .pipe(
                parse({
                    columns: true,
                    skip_empty_lines: true,
                    trim: true,
                }),
            );

        const variantDataById = await parseVariants(ctx);

        for await (const record of parser) {
            if (!record.id) continue;
            if (record.id.startsWith('#')) continue;

            const prepared = await buildWing(
                record,
                variantDataById[record.variant],
            );
            if (prepared === null) continue;
            const { preparedFullWing, code } = prepared;

            preparedWings[code] = preparedFullWing;
            csvIdToShipCode[record.id] = code;
        }

        return {
            preparedWings,
            csvIdToShipCode,
        };
    } catch (err) {
        throw new Error(`Failed to parse wings`, { cause: err });
    }
}

async function buildWing(
    record: WingRecord,
    variantData: VariantData | undefined,
): Promise<{
    preparedFullWing: PreparedFullWing;
    code: string;
} | null> {
    const name = record.id;

    try {

        assertDefined(variantData, 'No variant found');
        assertDefined(variantData.hullId, 'No hull ID found')
        
        const preparedFullWing = prepareFullWing(record, variantData);

        return {
            preparedFullWing,
            code: variantData.hullId,
        };
    } catch (err) {
        const formatted = new Error(`Failed to build wing: ${name}`, {
            cause: err,
        });
        console.log(formatted);
        return null;
    }
}

type VariantData = {
    hullId: string;
    variantId: string;
    fluxVents: number;
    fluxCapacitors: number;
    hullmods: string[];
    weaponGroups: WeaponGroup[];
};

type WeaponGroup = {
    mode: string;
    weapons: Record<string, string>;
};

async function parseVariants(
    ctx: ParseContext,
): Promise<Record<string, VariantData>> {
    try {
        const variantFilePath = path.join(ctx.fileDir, 'data', 'variants');
        const files = await fg(`**/*.variant`, {
            cwd: variantFilePath,
            absolute: true,
        });

        const records: VariantData[] = await Promise.all(
            files.map(async (file) => jparse(await fsp.readFile(file, 'utf8'))),
        );

        const variantDataByVariantId: Record<string, VariantData> = {};
        for (const record of records) {
            variantDataByVariantId[record.variantId] = record;
        }

        return variantDataByVariantId;
    } catch (err) {
        throw new Error(`Failed to parse variants`, {
            cause: err,
        });
    }
}

function prepareFullWing(
    record: WingRecord,
    variantData: VariantData,
): PreparedFullWing {
    const csvHash = hashRecord(record, Object.keys(record));
    const wingHash = hashJson(variantData);
    const dataHash = combineHash(csvHash, wingHash);
    try {
        return {
            preparedWingInstance: {
                data_hash: dataHash,
            },
            preparedWingData: buildWingData(record, variantData),
            preparedWingHullmods: variantData.hullmods ?? [],
            preparedWingWeaponGroups: buildWingWeaponGroups(variantData) ?? [],
            preparedWingTags: convertArray(record.tags),
        };
    } catch (err) {
        throw new Error(`Failed to prepare wing: ${record.id}`, {
            cause: err,
        });
    }
}

function buildWingData(
    record: WingRecord,
    variantData: VariantData,
): PreparedWingData {
    const roleValue = convertString(record.role);
    const formationValue = convertString(record.formation);

    return {
        role: validateOrThrow(
            isWingRole,
            roleValue,
            `Invalid wing role: ${roleValue}`,
        ),
        formation: validateOrThrow(
            isWingFormation,
            formationValue,
            `Invalid wing formation: ${formationValue}`,
        ),
        role_desc: convertString(record['role desc']),
        op_cost: convertInteger(record['op cost']),
        deployment_range: convertInteger(record.range),
        num_fighters: convertInteger(record.num),
        refit_time: convertInteger(record.refit),
        base_value: convertInteger(record['base value']),
        vents: variantData.fluxVents,
        capacitors: variantData.fluxCapacitors,
    };
}

function buildWingWeaponGroups(variantData: VariantData) {
    return variantData.weaponGroups
        ? variantData.weaponGroups.map((value) => ({
              mode: value.mode,
              weapons: value.weapons,
          }))
        : [];
}
