export function getOrThrow<T extends Record<PropertyKey, unknown>>(
    obj: T,
    key: keyof T,
) {
    const value = obj[key];
    if (value === undefined) {
        throw new Error(`Missing key ${String(key)}`);
    }
    return value;
}

export function allValuesNull(record: Record<PropertyKey, unknown>): boolean {
    return Object.values(record).every((value) => value === null);
}

export function assertDefined<T>(
    value: T,
    message?: string,
): asserts value is NonNullable<T> {
    if (value == null) {
        throw new Error(message ?? 'Value is null or undefined');
    }
}
