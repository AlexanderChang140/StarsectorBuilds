import type z from 'zod';

export type Schema<T> = z.ZodObject<{ [K in keyof T]: z.ZodType<T[K]> }>;
