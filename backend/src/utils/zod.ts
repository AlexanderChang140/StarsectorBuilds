import * as z from 'zod';

import { logger, LogLevel } from './logger.ts';

export function schemaForTable<T>() {
    return <S extends z.ZodType<T>>(schema: S) => schema;
}

export function createProjectionSchema<
    TSchema extends z.ZodRawShape,
    TSelection extends readonly (keyof TSchema)[],
>(selection: TSelection, schema: z.ZodObject<TSchema>) {
    const keys = Object.fromEntries(selection.map((v) => [v, true])) as {
        [K in TSelection[number]]: true;
    } & {
        [K in Exclude<TSelection[number], keyof TSchema>]?: never;
    };

    return schema.pick(keys);
}

export function getFilterSchema(schema: z.ZodType): z.ZodType {
    if (schema instanceof z.ZodNumber) {
        return z.coerce.number();
    } else if (schema instanceof z.ZodBoolean) {
        return z.preprocess((val) => {
            if (val === 'true') return true;
            if (val === 'false') return false;
            return val;
        }, z.boolean());
    } else {
        return schema;
    }
}

export function safeParse<TSchema>(
    data: unknown,
    schema: z.ZodType<TSchema>,
    logLevel: LogLevel = LogLevel.ERROR,
): { data: TSchema; success: true } | { data: undefined; success: false } {
    const result = schema.safeParse(data);
    if (!result.success) {
        const err = new Error('Zod validation failed');

        switch (logLevel) {
            case LogLevel.ERROR: {
                logger.error('Zod failed to parse values', {
                    error: err,
                    context: {
                        receivedData: data,
                        issues: z.treeifyError(result.error),
                    },
                });
                break;
            }
            case LogLevel.WARN: {
                logger.warn('Zod failed to parse values', result.error);
                break;
            }
        }
        return { data: undefined, success: false };
    } else {
        return { data: result.data, success: true };
    }
}

export function parseProjectionArray<TData, TSchema extends z.ZodRawShape>(
    data: TData[],
    selection: readonly (keyof TSchema)[],
    schema: z.ZodObject<TSchema>,
) {
    const parsed = safeParse(
        data,
        z.array(createProjectionSchema(selection, schema)),
    );
    return parsed.data ?? [];
}

export function parseProjection<TData, TSchema extends z.ZodRawShape>(
    data: TData,
    selection: readonly (keyof TSchema)[],
    schema: z.ZodObject<TSchema>,
) {
    const parsed = safeParse(data, createProjectionSchema(selection, schema));
    return parsed.data;
}
