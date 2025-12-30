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

export function filterKeys<T>(
    record: Record<string, unknown>,
    keys: readonly (keyof T)[],
) {
    return Object.fromEntries(
        Object.entries(record).filter(([k]) => keys.includes(k as keyof T)),
    ) as Partial<T>;
}

export function removeArrayKeys<
    T extends readonly PropertyKey[],
    R extends readonly T[number][],
>(keys: T, remove: R): Exclude<T[number], R[number]>[] {
    return keys.filter(
        (key): key is Exclude<T[number], R[number]> => !remove.includes(key),
    ) as Exclude<T[number], R[number]>[];
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
