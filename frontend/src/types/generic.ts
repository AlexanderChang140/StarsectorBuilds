export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export type Entries<T> = [keyof T, T[keyof T]][];

export type StringKeys<T> = Extract<keyof T, string>;

export type StringTransform<T> = (x: T) => string;

export type ValueKeys<T, TKeys extends readonly (keyof T)[]> = {
    [K in TKeys[number]]: T[K] extends string | number ? K : never;
}[TKeys[number]];

export type ProjectionKeys<T> = readonly (keyof T)[];
