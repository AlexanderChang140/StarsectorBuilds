export type Projection<
    TObj extends object,
    F extends readonly (keyof TObj)[],
> = Pick<TObj, F[number]>;
