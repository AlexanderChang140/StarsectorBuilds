import util from 'node:util';

export const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

const CURRENT_LOG_LEVEL = LogLevel.INFO;

const colors = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    blue: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    green: '\x1b[32m',
};

function getTimestamp(): string | undefined {
    return new Date().toISOString().split('T')[1]?.slice(0, 8);
}

const LOGGER_DEPTH = 6;

export const logger = {
    debug(message: string, meta?: unknown) {
        if (CURRENT_LOG_LEVEL <= LogLevel.DEBUG) {
            console.debug(
                `${colors.dim}[${getTimestamp()}] [DEBUG]${colors.reset} ${message}`,
                meta ?? '',
            );
        }
    },

    info(message: string, meta?: unknown) {
        if (CURRENT_LOG_LEVEL <= LogLevel.INFO) {
            console.log(
                `${colors.green}[${getTimestamp()}] [INFO]${colors.reset} ${message}`,
                meta ?? '',
            );
        }
    },

    warn(message: string, meta?: unknown) {
        if (CURRENT_LOG_LEVEL <= LogLevel.WARN) {
            console.warn(
                `${colors.yellow}[${getTimestamp()}] [WARN]${colors.reset} ${message}`,
                meta ?? '',
            );
        }
    },

    error(
        message: string,
        options?: {
            error?: Error | unknown;
            context?: Record<string, unknown>;
            depth?: number;
        },
    ) {
        const { error, context } = options ?? {};
        const depth = options?.depth ?? LOGGER_DEPTH;

        if (CURRENT_LOG_LEVEL > LogLevel.ERROR) return;

        const logHeader = `${colors.red}[${getTimestamp()}] [ERROR]${colors.reset} ${message}`;

        if (error) {
            if (error instanceof Error) {
                Object.assign(error, context);
            }

            const inspected = util.inspect(error, {
                depth,
                colors: true,
            });

            const indented = inspected
                .split('\n')
                .map((line) => `    ${line}`)
                .join('\n');

            console.error(`${logHeader}\n${indented}`);
        } else {
            console.error(logHeader);
        }
    },
};
