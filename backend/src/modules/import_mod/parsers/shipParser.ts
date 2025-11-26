import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import { parse } from 'csv';

import { prepareImage } from './imageParser.ts';
import type { PreparedImage } from '../../images/types.ts';
import type {
    PreparedBuiltIn,
    PreparedFullShip,
    PreparedPhaseStats,
    PreparedShieldStats,
    PreparedShipDesc,
    PreparedShipLogisticStats,
    PreparedShipPosition,
    PreparedShipSpecs,
    PreparedShipStats,
    PreparedShipText,
    PreparedShipWeaponSlot,
} from '../../ships/types.ts';
import { isShieldType, isShipSize } from '../../ships/util/validate.ts';
import {
    convertString,
    convertDecimal,
    convertInteger,
    convertArray,
} from '../util/convert.ts';
import { hashRecord, hashJson, combineHash } from '../util/hash.ts';
import { validateOrThrow } from '../util/validate.ts';

type ShipRecord = {
    name: string;
    id: string;
    designation: string;
    'tech/manufacturer': string;
    'system id': string;
    hitpoints: string;
    'armor rating': string;
    'max flux': string;
    'flux dissipation': string;
    'ordinance points': string;
    'fighter bays': string;
    'max speed': string;
    acceleration: string;
    deceleration: string;
    'max turn rate': string;
    'turn acceleration': string;
    mass: string;
    'shield type': string;
    'defense id': string;
    'shield arc': string;
    'shield upkeep': string;
    'shield efficiency': string;
    'phase cost': string;
    'phase upkeep': string;
    'min crew': string;
    'max crew': string;
    cargo: string;
    fuel: string;
    'fuel/ly': string;
    'max burn': string;
    'base value': string;
    'cr %/day': string;
    'CR to deploy': string;
    'peak CR sec': string;
    'CR loss/sec': string;
    'supplies/rec': string;
    'supplies/mo': string;
    hints: string;
    tags: string;
};

type ParseContext = {
    fileDir: string;
    preparedShipDescs: Record<string, PreparedShipDesc>;
};

/**
 * @param {*} fileDir
 * @returns
 */
export async function parseShips(
    fileDir: string,
    preparedShipDescs: Record<string, PreparedShipDesc>,
): Promise<{
    preparedShips: Record<string, PreparedFullShip>;
    preparedImages: Record<string, PreparedImage | null>;
    preparedBuiltIns: Record<string, PreparedBuiltIn>;
}> {
    const preparedShips: Record<string, PreparedFullShip> = {};
    const preparedImages: Record<string, PreparedImage | null> = {};
    const preparedBuiltIns: Record<string, PreparedBuiltIn> = {};
    const csvFilePath = path.join(fileDir, 'data', 'hulls', 'ship_data.csv');

    const ctx = { fileDir, preparedShipDescs } as const;

    try {
        const parser: AsyncIterable<ShipRecord> = fs
            .createReadStream(csvFilePath)
            .pipe(
                parse({
                    columns: true,
                    skip_empty_lines: true,
                    trim: true,
                }),
            );

        for await (const record of parser) {
            if (record.name.startsWith('#')) continue;
            if (!record.id) continue;

            const prepared = await buildShip(record, ctx);
            if (prepared === null) continue;
            const { preparedFullShip, preparedImage, preparedBuiltIn } =
                prepared;

            const code = record.id;
            preparedShips[code] = preparedFullShip;
            preparedImages[code] = preparedImage;
            preparedBuiltIns[code] = preparedBuiltIn;
        }

        return {
            preparedShips,
            preparedImages,
            preparedBuiltIns,
        };
    } catch (err) {
        throw new Error(`Failed to parse ships`, { cause: err });
    }
}

async function buildShip(
    record: ShipRecord,
    ctx: ParseContext,
): Promise<{
    preparedFullShip: PreparedFullShip;
    preparedImage: PreparedImage | null;
    preparedBuiltIn: PreparedBuiltIn;
} | null> {
    const code = record.id;

    try {
        const shipData = await parseShipData(code, ctx);
        const preparedFullShip = prepareFullShip(record, shipData, ctx);

        const preparedImage =
            convertString(shipData.spriteName) != null
                ? await prepareImage(ctx.fileDir, shipData.spriteName)
                : null;

        const preparedBuiltIn = prepareBuiltIn(shipData);

        return {
            preparedFullShip,
            preparedImage,
            preparedBuiltIn,
        };
    } catch (err) {
        const formatted = new Error(`Failed to build ship: ${code}`, {
            cause: err,
        });
        console.log(formatted);
        return null;
    }
}

type ShipData = {
    builtInMods: string[];
    builtInWings: string[];
    builtInWeapons: Record<string, string>;
    spriteName: string;
    hullSize: string;
    weaponSlots: WeaponSlot[];
    center: [number, number];
};

type WeaponSlot = {
    angle: number;
    arc: number;
    id: string;
    locations: [number, number];
    mount: string;
    size: string;
    type: string;
};

async function parseShipData(
    shipCode: string,
    ctx: ParseContext,
): Promise<ShipData> {
    try {
        const shipFilePath = path.join(
            ctx.fileDir,
            'data',
            'hulls',
            shipCode + '.ship',
        );
        const raw = await fsp.readFile(shipFilePath, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        throw new Error(`Failed to parse ship file: ${shipCode}`, {
            cause: err,
        });
    }
}

function prepareFullShip(
    record: ShipRecord,
    shipData: ShipData,
    ctx: ParseContext,
): PreparedFullShip {
    const desc = ctx.preparedShipDescs[record.id] ?? null;
    const csvHash = hashRecord(record, Object.keys(record));
    const shipHash = hashJson(shipData);
    const dataHash = combineHash(csvHash, shipHash);
    try {
        return {
            preparedShipInstance: {
                data_hash: dataHash,
            },
            preparedShipSpecs: buildShipSpecs(record, shipData),
            preparedShipStats: buildShipStats(record),
            preparedShipDesc: desc,
            preparedShipText: buildShipText(record),
            preparedShipPosition: buildShipPosition(shipData),
            preparedShipLogisticStats: buildShipLogisticStats(record),
            preparedShipWeaponSlots: buildShipWeaponSlots(shipData),
            preparedShieldStats: buildShieldStats(record),
            preparedPhaseStats: buildPhaseStats(record),
            preparedShipHints: convertArray(record['hints']),
            preparedShipTags: convertArray(record['tags']),
        };
    } catch (err) {
        throw new Error(`Failed to prepare ship: ${record.id}`, {
            cause: err,
        });
    }
}

function buildShipSpecs(
    record: ShipRecord,
    shipData: ShipData,
): PreparedShipSpecs {
    const sizeValue = convertString(shipData.hullSize);
    const shieldValue = convertString(record['shield type']);

    return {
        shipSize: validateOrThrow(
            isShipSize,
            sizeValue,
            `Invalid shield type: ${JSON.stringify(sizeValue)}`,
        ),
        shieldType: validateOrThrow(
            isShieldType,
            shieldValue,
            `Invalid shield type: ${JSON.stringify(shieldValue)}`,
        ),
        shipSystemCode: convertString(record['system id']),
        defenseCode: convertString(record['defense id']),
    };
}

function buildShipStats(record: ShipRecord): PreparedShipStats {
    return {
        hitpoints: convertInteger(record['hitpoints']),
        armor_rating: convertInteger(record['armor rating']),
        max_flux: convertInteger(record['max flux']),
        flux_dissipation: convertInteger(record['flux dissipation']),
        ordinance_points: convertInteger(record['ordinance points']),
        fighter_bays: convertInteger(record['fighter bays']),
        acceleration: convertInteger(record['acceleration']),
        deceleration: convertInteger(record['deceleration']),
        max_turn_rate: convertInteger(record['max turn rate']),
        turn_acceleration: convertInteger(record['turn acceleration']),
        mass: convertInteger(record['mass']),
    };
}

function buildShipText(record: ShipRecord): PreparedShipText {
    return {
        display_name: convertString(record['name']),
        manufacturer: convertString(record['tech/manufacturer']),
        designation: convertString(record['designation']),
        base_value: convertDecimal(record['base value']),
    };
}

function buildShipPosition(shipData: ShipData): PreparedShipPosition {
    const [x, y] = shipData.center ?? [];
    const center: [number, number] = !isNaN(+x) && !isNaN(+y) ? [x, y] : [0, 0];
    return {
        center,
    };
}

function buildShipLogisticStats(record: ShipRecord): PreparedShipLogisticStats {
    return {
        min_crew: convertInteger(record['min crew']),
        max_crew: convertInteger(record['max crew']),
        max_cargo: convertInteger(record['cargo']),
        max_fuel: convertInteger(record['fuel']),
        fuel_per_ly: convertDecimal(record['fuel/ly']),
        cr_recovery: convertDecimal(record['cr %/day']),
        cr_deployment_cost: convertInteger(record['CR to deploy']),
        peak_cr_sec: convertInteger(record['peak CR sec']),
        cr_loss_per_sec: convertDecimal(record['CR loss/sec']),
    };
}

function buildShipWeaponSlots(shipData: ShipData): PreparedShipWeaponSlot[] {
    return shipData.weaponSlots
        ? shipData.weaponSlots.map((value) => ({
              weaponSize: value.size,
              weaponType: value.type,
              mountType: value.mount,
              code: value.id,
              angle: value.angle,
              arc: value.arc,
              position: value.locations,
          }))
        : [];
}

function buildShieldStats(record: ShipRecord): PreparedShieldStats | null {
    if (record['shield type'] === 'NONE' || record['shield type'] === 'PHASE')
        return null;
    return {
        arc: convertInteger(record['shield arc']) ?? 0,
        upkeep: convertDecimal(record['shield upkeep']) ?? 0,
        efficiency: convertDecimal(record['shield efficiency']) ?? 0,
    };
}

function buildPhaseStats(record: ShipRecord): PreparedPhaseStats | null {
    if (record['shield type'] !== 'PHASE') return null;
    return {
        cost: convertInteger(record['phase cost']) ?? 0,
        upkeep: convertInteger(record['phase upkeep']) ?? 0,
    };
}

function prepareBuiltIn(shipData: ShipData): PreparedBuiltIn {
    return {
        preparedBuiltInWeapons: shipData.builtInWeapons ?? [],
        preparedBuiltInHullmods: shipData.builtInMods ?? [],
        preparedBuiltInWings: shipData.builtInWings
            ? shipData.builtInWings.reduce((acc, wing) => {
                  acc[wing] = (acc[wing] || 0) + 1;
                  return acc;
              }, {} as Record<string, number>)
            : {},
    };
}
