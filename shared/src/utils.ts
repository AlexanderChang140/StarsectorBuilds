export function keysOf<T extends Object>(obj: T) {
    return Object.keys(obj) as readonly (keyof T)[];
}
