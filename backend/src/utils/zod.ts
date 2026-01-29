import type z from 'zod';

export function schemaForTable<T>() {
    return <S extends z.ZodType<T>>(schema: S) => schema;
}
