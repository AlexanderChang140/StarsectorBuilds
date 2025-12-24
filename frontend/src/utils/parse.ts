export function parseIntOrNaN(num: string | null | undefined) {
    if (num === null || num === undefined) {
        return NaN;
    }
    return parseInt(num, 10);
}
