export function convertInteger(value: string): number | null {
    if (value === undefined) return null;
    const trimmed = value.trim();
    if (/^[+-]?\d+$/.test(trimmed)) {
        return parseInt(trimmed, 10);
    }
    return null;
}

export function convertDecimal(value: string): number | null {
    if (value === undefined) return null;
    const trimmed = value.trim();
    if (/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
        return parseFloat(trimmed);
    }
    return null;
}

export function convertBoolean(value: string): boolean | null {
    if (value === undefined) return null;
    const lower = value.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
    return null;
}

export function convertString(value: string): string | null {
    if (value === undefined) return null;
    if (value.trim() === '') return null;
    return value.trim();
}

export function convertArray(str: string): string[] {
    return str ? str.split(',').map((s) => s.trim()) : [];
}
