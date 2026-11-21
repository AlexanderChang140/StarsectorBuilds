import path from 'path';
import { z } from 'zod';
import { logger } from '../utils/logger.ts';

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
    PORT: z.coerce.number().int().positive().default(3000),

    DB_HOST: z.string().min(1).default('localhost'),
    DB_PORT: z.coerce.number().int().positive().default(5432),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),
    DATABASE_URL: z.url().optional(),

    IMAGE_DIR: z.string().default(path.resolve('public/images')),

    DELETED_USER: z.string().min(1),
    DELETED_USER_EMAIL: z.email(),
    DELETED_USER_PASSWORD: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    logger.error('Invalid environment variables', {
        error: z.prettifyError(parsed.error),
    });
    process.exit(1);
}

const data = parsed.data;

export const config = {
    nodeEnv: data.NODE_ENV,
    isProd: data.NODE_ENV === 'prod',
    port: data.PORT,
    db: {
        host: data.DB_HOST,
        port: data.DB_PORT,
        user: data.DB_USER,
        password: data.DB_PASSWORD,
        name: data.DB_NAME,
        url:
            data.DATABASE_URL ??
            `postgres://${encodeURIComponent(data.DB_USER)}:${encodeURIComponent(data.DB_PASSWORD)}@${data.DB_HOST}:${data.DB_PORT}/${data.DB_NAME}`,
    },
    imageDir: path.resolve(data.IMAGE_DIR),
    session: {
        ttlMs: 1000 * 60 * 60 * 24 * 7, // 7 days
        cookieName: 'token',
    },
    deletedUser: {
        username: data.DELETED_USER,
        email: data.DELETED_USER_EMAIL,
        password: data.DELETED_USER_PASSWORD,
    },
} as const;
