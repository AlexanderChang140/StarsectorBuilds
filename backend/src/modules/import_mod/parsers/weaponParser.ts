import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import { parse } from 'csv';
import { parse as jparse } from 'jsonc-parser';

import { prepareImage } from './imageParser.ts';
import { allValuesNull } from '../../../utils/helpers.ts';
import type { PreparedImage } from '../../images/types.ts';
import type {
    PreparedWeaponDesc,
    PreparedWeaponText,
} from '../../weapons/types/desc.ts';
import type { PreparedFullWeapon } from '../../weapons/types/instance.ts';
import type {
    PreparedProjWeapon,
    PreparedAmmoWeapon,
    PreparedBeamWeapon,
} from '../../weapons/types/projectile.ts';
import type {
    PreparedWeaponSpecs,
    PreparedWeaponStats,
} from '../../weapons/types/stats.ts';
import {
    isDamageType,
    isWeaponSize,
    isWeaponType,
} from '../../weapons/utils/validate.ts';
import {
    convertArray,
    convertBoolean,
    convertDecimal,
    convertInteger,
    convertString,
} from '../util/convert.ts';
import { hashRecord, hashJson, combineHash } from '../util/hash.ts';
import { validateOrThrow } from '../util/validate.ts';

type WeaponRecord = {
    name: string;
    id: string;
    'base value': string;
    range: string;
    'damage/second': string;
    'damage/shot': string;
    emp: string;
    impact: string;
    'turn rate': string;
    OPs: string;
    ammo: string;
    'ammo/sec': string;
    'reload size': string;
    type: string;
    'energy/shot': string;
    'energy/second': string;
    chargeup: string;
    chargedown: string;
    'burst size': string;
    'burst delay': string;
    'min spread': string;
    'max spread': string;
    'spread/shot': string;
    'spread decay/sec': string;
    'beam speed': string;
    'proj speed': string;
    'launch speed': string;
    'flight time': string;
    'proj hitpoints': string;
    autofireAccBonus: string;
    extraArcForAI: string;
    hints: string;
    tags: string;
    groupTag: string;
    'tech/manufacturer': string;
    'for weapon tooltip>>': string;
    primaryRoleStr: string;
    speedStr: string;
    trackingStr: string;
    turnRateStr: string;
    accuracyStr: string;
    customPrimary: string;
    customPrimaryHL: string;
    customAncillary: string;
    customAncillaryHL: string;
    noDPSInTooltip: string;
};

type ParseContext = {
    fileDir: string;
    preparedWeaponDescs: Record<string, PreparedWeaponDesc>;
};

export type WeaponWithImages = {
    preparedFullWeapon: PreparedFullWeapon;
    preparedTurretImage: PreparedImage | null;
    preparedTurretGunImage: PreparedImage | null;
    preparedHardpointImage: PreparedImage | null;
    preparedHardpointGunImage: PreparedImage | null;
};

/**
 * @param {*} fileDir
 * @returns
 */
export async function parseWeapons(
    fileDir: string,
    preparedWeaponDescs: Record<string, PreparedWeaponDesc>,
): Promise<Record<string, WeaponWithImages>> {
    const weapons: Record<string, WeaponWithImages> = {};
    const csvFilePath = path.join(
        fileDir,
        'data',
        'weapons',
        'weapon_data.csv',
    );

    const ctx = { fileDir, preparedWeaponDescs } as const;

    try {
        const parser: AsyncIterable<WeaponRecord> = fs
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

            const prepared = await buildWeapon(record, ctx);
            if (prepared === null) continue;

            const code = record.id;
            weapons[code] = prepared;
        }
        return weapons;
    } catch (err) {
        throw new Error(`Failed to parse weapons`, { cause: err });
    }
}

async function buildWeapon(
    record: WeaponRecord,
    ctx: ParseContext,
): Promise<{
    preparedFullWeapon: PreparedFullWeapon;
    preparedTurretImage: PreparedImage | null;
    preparedTurretGunImage: PreparedImage | null;
    preparedHardpointImage: PreparedImage | null;
    preparedHardpointGunImage: PreparedImage | null;
} | null> {
    const weaponCode = record.id;

    try {
        const weaponData = await parseWeaponData(weaponCode, ctx);
        const preparedFullWeapon = prepareFullWeapon(record, weaponData, ctx);

        const preparedTurretImage =
            convertString(weaponData.turretSprite) != null
                ? await prepareImage(ctx.fileDir, weaponData.turretSprite)
                : null;
        const preparedTurretGunImage =
            convertString(weaponData.turretGunSprite) != null
                ? await prepareImage(ctx.fileDir, weaponData.turretGunSprite)
                : null;
        const preparedHardpointImage =
            convertString(weaponData.hardpointSprite) != null
                ? await prepareImage(ctx.fileDir, weaponData.hardpointSprite)
                : null;
        const preparedHardpointGunImage =
            convertString(weaponData.hardpointGunSprite) != null
                ? await prepareImage(ctx.fileDir, weaponData.hardpointGunSprite)
                : null;

        return {
            preparedFullWeapon,
            preparedTurretImage,
            preparedTurretGunImage,
            preparedHardpointImage,
            preparedHardpointGunImage,
        };
    } catch (err) {
        const formatted = new Error(`Failed to build weapon: ${weaponCode}`, {
            cause: err,
        });
        console.log(formatted);
        return null;
    }
}

export type WeaponData = {
    type: string;
    size: string;
    turretSprite: string;
    turretGunSprite: string;
    hardpointSprite: string;
    hardpointGunSprite: string;
};

async function parseWeaponData(
    weaponCode: string,
    ctx: ParseContext,
): Promise<WeaponData> {
    const primaryWeaponFilePath = path.join(
        ctx.fileDir,
        'data',
        'weapons',
        weaponCode + '.wpn',
    );

    const secondaryWeaponFilePath = path.join(
        ctx.fileDir,
        'data',
        'shipsystems',
        'wpn',
        weaponCode + '.wpn',
    );

    try {
        const raw = await fsp.readFile(primaryWeaponFilePath, 'utf8');
        return jparse(raw);
    } catch {
        try {
            const raw = await fsp.readFile(secondaryWeaponFilePath, 'utf8');
            return jparse(raw);
        } catch (err) {
            throw new Error(`Failed to parse weapon file: ${weaponCode}`, {
                cause: err,
            });
        }
    }
}

function prepareFullWeapon(
    record: WeaponRecord,
    weaponData: WeaponData,
    ctx: ParseContext,
): PreparedFullWeapon {
    try {
        const desc = ctx.preparedWeaponDescs[record.id] ?? null;
        const csvHash = hashRecord(record, Object.keys(record));
        const wpnHash = hashJson(weaponData);
        let dataHash = combineHash(csvHash, wpnHash);
        if (desc) {
            const descHash = hashRecord(desc, Object.keys(desc));
            dataHash = combineHash(dataHash, descHash);
        }

        return {
            preparedWeaponInstance: { data_hash: dataHash },
            preparedWeaponSpecs: prepareWeaponSpecs(record, weaponData),
            preparedWeaponStats: prepareWeaponStats(record),
            preparedWeaponText: prepareWeaponText(record),
            preparedWeaponDesc: desc,
            preparedProjWeapon: prepareProjWeapon(record),
            preparedAmmoWeapon: prepareAmmoWeapon(record),
            preparedBeamWeapon: prepareBeamWeapon(record),
            weaponHints: convertArray(record['hints']),
            weaponTags: convertArray(record['tags']),
            weaponGroups: convertArray(record['groupTag']),
        };
    } catch (err) {
        throw new Error(`Failed to prepare weapon: ${record.id}`, {
            cause: err,
        });
    }
}

function prepareWeaponSpecs(
    record: WeaponRecord,
    weaponData: WeaponData,
): PreparedWeaponSpecs {
    const typeValue = convertString(weaponData.type);
    const sizeValue = convertString(weaponData.size);
    const damageValue = convertString(record['type']);

    return {
        weapon_type: validateOrThrow(
            isWeaponType,
            typeValue,
            `Invalid weapon type: ${typeValue}`,
        ),
        weapon_size: validateOrThrow(
            isWeaponSize,
            sizeValue,
            `Invalid weapon size: ${sizeValue}`,
        ),
        damage_type: damageValue
            ? validateOrThrow(
                  isDamageType,
                  damageValue,
                  `Invalid damage type: ${damageValue}`,
              )
            : 'NONE',
    };
}

function prepareWeaponStats(record: WeaponRecord): PreparedWeaponStats {
    return {
        weapon_range: convertDecimal(record['range']),
        damage_per_shot: convertDecimal(record['damage/shot']),
        emp: convertDecimal(record['emp']),
        impact: convertDecimal(record['impact']),
        turn_rate: convertDecimal(record['turn rate']),
        op_cost: convertDecimal(record['OPs']),
        flux_per_shot: convertDecimal(record['energy/shot']),
        chargeup: convertDecimal(record['chargeup']),
        chargedown: convertDecimal(record['chargedown']),
        burst_size: convertDecimal(record['burst size']),
        burst_delay: convertDecimal(record['burst delay']),
        min_spread: convertDecimal(record['min spread']),
        max_spread: convertDecimal(record['max spread']),
        spread_per_shot: convertDecimal(record['spread/shot']),
        spread_decay_per_second: convertDecimal(record['spread decay/sec']),
        autofire_accuracy_bonus: convertDecimal(record['autofireAccBonus']),
        extra_arc_for_ai: convertDecimal(record['extraArcForAI']),
        base_value: convertDecimal(record['base value']),
    };
}

function prepareWeaponText(record: WeaponRecord): PreparedWeaponText {
    return {
        display_name: convertString(record['name']),
        manufacturer: convertString(record['tech/manufacturer']),
        primary_role_str: convertString(record['primaryRoleStr']),
        proj_speed_str: convertString(record['speedStr']),
        tracking_str: convertString(record['trackingStr']),
        turn_rate_str: convertString(record['turnRateStr']),
        accuracy_str: convertString(record['accuracyStr']),
        custom_primary: convertString(record['customPrimary']),
        custom_primary_hl: convertString(record['customPrimaryHL']),
        custom_ancillary: convertString(record['customAncillary']),
        custom_ancillary_hl: convertString(record['customAncillaryHL']),
        no_dps_tooltip: convertBoolean(record['noDPSInTooltip']) ?? false,
    };
}

function prepareProjWeapon(record: WeaponRecord): PreparedProjWeapon | null {
    const result = {
        speed: convertDecimal(record['proj speed']),
        launch_speed: convertDecimal(record['launch speed']),
        flight_time: convertDecimal(record['flight time']),
        hitpoints: convertDecimal(record['proj hitpoints']),
    };
    return allValuesNull(result) ? null : result;
}

function prepareAmmoWeapon(record: WeaponRecord): PreparedAmmoWeapon | null {
    const maxAmmo = convertInteger(record['ammo']);
    if (maxAmmo === null) return null;
    return {
        max_ammo: maxAmmo,
        ammo_per_second: convertDecimal(record['ammo/sec']),
        reload_size: convertInteger(record['reload size']) ?? 1,
    };
}

function prepareBeamWeapon(record: WeaponRecord): PreparedBeamWeapon | null {
    const result = {
        beam_speed: convertInteger(record['beam speed']),
        damage_per_second: convertInteger(record['damage/second']),
        flux_per_second: convertDecimal(record['energy/second']),
    };
    return allValuesNull(result) ? null : result;
}
