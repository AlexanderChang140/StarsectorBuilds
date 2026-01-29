export function multiSort<T>(
    keys: (keyof T)[],
    directions: ('ASC' | 'DESC')[] = [],
) {
    return (x: T, y: T) => {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const dir = directions[i] || 'ASC';
            const a = x[key];
            const b = y[key];

            let cmp = 0;
            if (typeof a === 'number' && typeof b === 'number') cmp = a - b;
            else if (typeof a === 'string' && typeof b === 'string')
                cmp = a.localeCompare(b);

            if (cmp !== 0) return dir === 'ASC' ? cmp : -cmp;
        }
        return 0;
    };
}

export function sortSubset<T>(arr: readonly T[], subset: readonly T[]) {
    const order = new Map(arr.map((value, index) => [value, index]));
    return [...subset].sort((a, b) => order.get(a)! - order.get(b)!);
}
