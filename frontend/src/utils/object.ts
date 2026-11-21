export function typedEntries<TKey extends string | number | symbol, TValue>(
    obj: Record<TKey, TValue>,
): [string, TValue][] {
    return Object.entries(obj) as [string, TValue][];
}

export function typedKeys<TKey extends string | number | symbol>(
    obj: Record<TKey, unknown>,
): TKey[] {
    return Object.keys(obj) as TKey[];
}

export function typedValues<TValue>(
    obj: Record<string | number | symbol, TValue>,
): TValue[] {
    return Object.values(obj);
}

export function addKey<T extends object, K extends PropertyKey, V>(
    obj: T,
    key: K,
    value: V,
): T & Record<K, V> {
    return {
        ...obj,
        [key]: value,
    } as T & Record<K, V>;
}

export function removeKey<T extends object, K extends keyof T>(
    obj: T,
    key: K,
): Omit<T, K> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...rest } = obj;
    return rest;
}

export function updateKey<T extends object, K extends keyof T>(
    obj: T,
    key: K,
    value: T[K],
): T {
    return {
        ...obj,
        [key]: value,
    };
}
