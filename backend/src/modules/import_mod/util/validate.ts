export function validateOrThrow<T>(
    validator: (v: unknown) => v is T,
    value: unknown,
    err: string = `Failed to validate value ${JSON.stringify(value)}`,
): T {
    if (!validator(value)) {
        throw new Error(err);
    }
    return value as T;
}
