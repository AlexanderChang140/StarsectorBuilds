import fsp from 'fs/promises';
import path from 'path';

import dotenv from 'dotenv';

import type { InsertedImage, PreparedImage } from '../../images/types.ts';
import { hashImage } from '../util/hash.ts';

dotenv.config();

export async function prepareImage(
    fileDir: string,
    filePath: string,
): Promise<PreparedImage> {
    const imagePath = path.join(fileDir, filePath);
    const imageHash = await hashImage(imagePath);
    return {
        copy_path: imagePath,
        file_hash: imageHash,
    };
}

type ImageCategories = 'weapons' | 'hullmods' | 'ship_systems' | 'ships';

export function buildImage(
    modCode: string,
    category: ImageCategories,
    preparedImage: PreparedImage | null,
): InsertedImage | null {
    if (!preparedImage) return null;
    const filePath = [modCode, category, preparedImage.file_hash].join('/') + '.png';
    copyImage(preparedImage.copy_path, filePath);
    return {
        file_hash: preparedImage.file_hash,
        file_path: filePath,
    };
}

export async function copyImage(fromPath: string, toPath: string) {
    const imageDir = process.env.IMAGE_DIR;
    if (!imageDir) throw new Error('Failed to find image directory');

    const fromFile = path.resolve(fromPath);
    const toFile = path.resolve(imageDir, toPath);
    const toDir = path.dirname(toFile);

    if (!(await fileExists(toFile))) {
        await fsp.mkdir(toDir, { recursive: true });
        await fsp.copyFile(fromFile, toFile);
    }
}

export async function fileExists(filePath: string) {
    try {
        await fsp.access(filePath);
        return true;
    } catch {
        return false;
    }
}
