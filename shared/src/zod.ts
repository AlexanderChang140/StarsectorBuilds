import * as z from 'zod';

export const numberOrNull = z.number().nullable();

export const numeric = z.coerce.number();
export const numericOrNull = numeric.nullable();

export const stringOrNull = z.string().nullable();

export const nonNegativeNumber = z.number().nonnegative();

export const id = z.number().int().positive();

export const coercedId = z.coerce.number().int().positive();

export const requiredString = z.string().trim().min(1);

export const idPairs = z.array(z.array(id).length(2));
