import crypto from 'crypto';

import stringify from 'json-stable-stringify';
import sharp from 'sharp';

/**
 * Create a stable SHA-256 hash identifier for a CSV record.
 *
 * @param {Object} record - A CSV row object.
 * @param {string[]} headers - The CSV headers in order.
 * @returns {string} - A hex string hash that uniquely identifies the record.
 */
export function hashRecord(
    record: Record<string, unknown>,
    headers: string[],
): string {
    const input = headers.map((h) => record[h] ?? '').join('|');
    return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Create a stable SHA-256 hash from a JSON object.
 * Keys are sorted to ensure consistent ordering.
 *
 * @param {Object} obj - The JSON object.
 * @returns {string} - Hexadecimal hash string.
 */
export function hashJson(obj: Record<string, unknown>): string {
    const input = stringify(obj) ?? '';
    return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Creates a new SHA-256 hash from two hashes
 *
 * @param {string} hash1
 * @param {string } hash2
 * @returns {string} - Combined SHA-256 hash
 */
export function combineHash(hash1: string, hash2: string): string {
    const combinedString = `${hash1}|${hash2}`;
    const hash = crypto
        .createHash('sha256')
        .update(combinedString)
        .digest('hex');
    return hash;
}

export async function hashImage(filePath: string): Promise<string> {
    const { data } = await sharp(filePath)
        .raw()
        .toBuffer({ resolveWithObject: true });
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
}
