export function numberOrNull(num: string | null | undefined) {
    if (num == null || num.trim() === '') {
        return null;
    }
    const res = Number(num);
    return Number.isNaN(res) ? null : res;
}