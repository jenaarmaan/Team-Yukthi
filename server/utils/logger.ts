type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const formatTimestamp = (): string => new Date().toISOString();

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(`[${formatTimestamp()}] [INFO] [NIYOJAN-BACKEND] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(`[${formatTimestamp()}] [WARN] [NIYOJAN-BACKEND] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (message: string, error?: unknown) => {
    console.error(
      `[${formatTimestamp()}] [ERROR] [NIYOJAN-BACKEND] ${message}`,
      error instanceof Error ? error.stack : error || ''
    );
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
      console.debug(`[${formatTimestamp()}] [DEBUG] [NIYOJAN-BACKEND] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  }
};
