type Apple = {
    color: string;
    value: number;
};

// Check if a type has any optional properties
type HasOptionalKeys<T> = {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T] extends never ? false : true;

// Type that only accepts subsets of T with no optional properties
type StrictSubset<T> = {
    [K in keyof T]: T[K];
} & {
    [K in keyof T as HasOptionalKeys<Pick<T, K>> extends true ? never : K]: T[K];
};

function foo<T, W extends Partial<T>>(
    data: W extends StrictSubset<W> ? W : never
) {
    // W must be a subset of T that has no optional properties
    return data;
}

// This works - Pick<Apple, 'color'> is a subset of Apple with no optional properties
foo<Apple, Pick<Apple, 'color'>>({ color: "red" });

// Test with a type that has optional properties - this should fail
// foo<Apple, Partial<Apple>>({ color: "red" });
