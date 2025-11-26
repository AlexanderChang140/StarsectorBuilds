import fsp from 'fs/promises';
import path from 'path';

import { parse as jparse } from 'jsonc-parser';

/**
 * Parses the name and code of the mod from the mod info file
 *
 * @param fileDir - Path to the mod directory
 * @returns [code, name] of the mod
 */
export async function parseModInfo(
    fileDir: string,
): Promise<{ code: string; name: string }> {
    try {
        const modInfoPath = path.join(fileDir, 'mod_info.json');
        const raw = await fsp.readFile(modInfoPath, 'utf-8');
        const modInfoData = jparse(raw);
        return { code: modInfoData.id, name: modInfoData.name };
    } catch (err) {
        throw new Error(`Failed to parse mod info`, { cause: err });
    }
}

/**
 * Parses the version of the mod from the version file
 *
 * @param fileDir - Path to the mod directory
 * @returns [major, minor, patch] version numbers
 */
export async function parseVersionFile(
    fileDir: string,
): Promise<{ major: number; minor: number; patch: string }> {
    const files = await fsp.readdir(fileDir);
    const versionFiles = files.filter((f) => f.endsWith('.version'));
    if (versionFiles.length == 0 || !versionFiles[0]) {
        throw new Error(`No version file found in ${fileDir}`);
    } else if (versionFiles.length > 1) {
        throw new Error(`Multiple version files found in ${fileDir}`);
    } else {
        try {
            const versionFilePath = path.join(fileDir, versionFiles[0]);
            const raw = await fsp.readFile(versionFilePath, 'utf-8');
            const versionData = jparse(raw);
            return {
                major: versionData.modVersion.major,
                minor: versionData.modVersion.minor,
                patch: versionData.modVersion.patch,
            };
        } catch (err) {
            throw new Error(`Failed to parse version file`, { cause: err });
        }
    }
}
