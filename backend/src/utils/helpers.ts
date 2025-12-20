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

export function remapKeys<T>(
    record: Record<string, unknown>,
    mapping: Record<string, keyof T>,
) {
    return Object.fromEntries(
        Object.entries(mapping)
            .filter(([k]) => record[k] !== undefined)
            .map(([k, v]) => [v, record[k]]),
    ) as Partial<Record<keyof T, unknown>>;
}

export function filterKeys<T>(record: Partial<T>, keys: readonly (keyof T)[]) {
    return Object.fromEntries(
        keys.filter((k) => k in record).map((k) => [k, record[k]]),
    ) as Partial<T>;
}

export function filterValues<T>(
    record: Partial<T>,
    predicate: (value: T[keyof T]) => boolean,
): Partial<T> {
    return Object.fromEntries(
        Object.entries(record).filter(([, value]) =>
            predicate(value as T[keyof T]),
        ),
    ) as Partial<T>;
}

export function removeUndefined<T extends object>(record: Partial<T>) {
    return filterValues(record, (val) => val !== undefined);
}

export function removeNull<T extends object>(record: Partial<T>) {
    return filterValues(record, (val) => val !== null);
}
