import type { Projection } from '@shared/types.ts';

export function assertDefined<T>(
    value: T,
    message?: string,
): asserts value is NonNullable<T> {
    if (value == null) {
        throw new Error(message ?? 'Value is null or undefined');
    }
}

type NonNullableKeys<
    TData extends object,
    TKeys extends readonly (keyof TData)[],
> = {
    [K in keyof TData]: K extends TKeys[number]
        ? NonNullable<TData[K]>
        : TData[K];
};

export function assertProjectionNonNullableKeys<
    TData extends object,
    TSelection extends readonly (keyof TData)[],
    TKeys extends readonly (keyof TData)[],
>(
    proj: Projection<TData, TSelection>,
    keys: TKeys,
): asserts proj is Projection<NonNullableKeys<TData, TKeys>, TSelection> {
    for (const key of keys) {
        if (key in proj && proj[key] == null) {
            throw new Error(`Key ${String(key)} is null or undefined`);
        }
    }
}

export function assertProjectionRowsNonNullableKeys<
    TData extends object,
    TSelection extends readonly (keyof TData)[],
    TKeys extends readonly (keyof TData)[],
>(
    proj: Projection<TData, TSelection>[],
    keys: TKeys,
): asserts proj is Projection<NonNullableKeys<TData, TKeys>, TSelection>[] {
    for (const row of proj) {
        assertProjectionNonNullableKeys(row, keys);
    }
}
