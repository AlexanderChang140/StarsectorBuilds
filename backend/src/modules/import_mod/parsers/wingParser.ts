import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import { parse } from 'csv';
import fg from 'fast-glob';
import { parse as jparse } from 'jsonc-parser';

import { assertDefined } from '../../../utils/helpers.ts';
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
}> {
    const preparedWings: Record<string, PreparedFullWing> = {};
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

        for await (const record of parser) {
            if (!record.id) continue;
            if (record.id.startsWith('#')) continue;

            const prepared = await buildWing(record, ctx);
            if (prepared === null) continue;
            const { preparedFullWing } = prepared;

            const code = record.id.split('_');
            if (!code[0]) continue;

            preparedWings[code[0]] = preparedFullWing;
        }

        return {
            preparedWings,
        };
    } catch (err) {
        throw new Error(`Failed to parse wings`, { cause: err });
    }
}

async function buildWing(
    record: WingRecord,
    ctx: ParseContext,
): Promise<{
    preparedFullWing: PreparedFullWing;
} | null> {
    const parts = record.id.split('_');
    const last = parts[parts.length - 1];
    const code = parts.slice(0, -1).join('_');

    try {
        if (!code || last !== 'wing') {
            throw new Error(`Invalid wing id: ${code}`);
        }

        const variantData = await parseWingVariant(record.variant, ctx);
        const preparedFullWing = prepareFullWing(record, variantData);

        return {
            preparedFullWing,
        };
    } catch (err) {
        const formatted = new Error(`Failed to build wing: ${code}`, {
            cause: err,
        });
        console.log(formatted);
        return null;
    }
}

type VariantData = {
    fluxVents: number;
    fluxCapacitors: number;
    hullmods: string[];
    weaponGroups: WeaponGroup[];
};

type WeaponGroup = {
    mode: string;
    weapons: Record<string, string>;
};

async function parseWingVariant(
    variant: string,
    ctx: ParseContext,
): Promise<VariantData> {
    try {
        const variantFilePath = path.join(ctx.fileDir, 'data', 'variants');
        const files = await fg(`**/${variant}.variant`, {
            cwd: variantFilePath,
            absolute: true,
        });

        assertDefined(
            files[0],
            `Failed to find wing variant file at: ${variantFilePath}`,
        );

        const raw = await fsp.readFile(files[0], 'utf8');

        return jparse(raw);
    } catch (err) {
        throw new Error(`Failed to parse wing variant: ${variant}`, {
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
