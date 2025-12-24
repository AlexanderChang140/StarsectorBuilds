export function humanizeKeys<const TKeys extends readonly string[]>(
    keys: TKeys,
    customMap?: Readonly<Record<string, string>>,
): Record<TKeys[number], string> {
    return Object.fromEntries(
        keys.map((key) => [
            key,
            (customMap ?? {})[key] ??
                key
                    .split('_')  
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(' '),
        ]),
    ) as Record<TKeys[number], string>;
}
