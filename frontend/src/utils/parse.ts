export function numberOrNull(num: string | null | undefined) {
    if (num == null || num.trim() === '') {
        return null;
    }
    const res = Number(num);
    return Number.isNaN(res) ? null : res;
}

export function parseIntOrNaN(num: string | null | undefined) {
    if (num === null || num === undefined) {
        return NaN;
    }
    return parseInt(num, 10);
}

export function parseIntOrNull(num: string | null | undefined) {
    if (num == null) {
        return null;
    }
    const res = parseInt(num, 10);
    return Number.isNaN(res) ? null : res;
}

export function parseFloatOrNull(num: string | null | undefined) {
    if (num == null) {
        return null;
    }
    const res = parseFloat(num);
    return Number.isNaN(res) ? null : res;
}
