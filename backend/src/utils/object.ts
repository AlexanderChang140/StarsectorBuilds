export function typedEntries<T extends object>(
    obj: T,
): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function typedKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

export function typedValues<T extends Record<string, unknown>>(
    obj: T,
): T[keyof T][] {
    return Object.values(obj) as T[keyof T][];
}
