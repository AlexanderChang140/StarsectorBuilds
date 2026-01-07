export function typedEntries<TKey extends string | number | symbol, TValue>(
    obj: Record<TKey, TValue>,
): [TKey, TValue][] {
    return Object.entries(obj) as [TKey, TValue][];
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
