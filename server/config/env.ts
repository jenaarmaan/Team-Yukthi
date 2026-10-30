import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export interface ServerConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  appUrl: string;
  corsOrigins: string[];
  apiVersion: string;
  isProduction: boolean;
  databasePath: string;
}

const parsePort = (val?: string): number => {
  const parsed = parseInt(val || '', 10);
  return isNaN(parsed) ? 3000 : parsed;
};

export const config: ServerConfig = {
  port: parsePort(process.env.PORT),
  nodeEnv: (process.env.NODE_ENV as ServerConfig['nodeEnv']) || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  corsOrigins: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  apiVersion: 'v1',
  isProduction: process.env.NODE_ENV === 'production',
  databasePath: process.env.DATABASE_PATH || path.resolve(process.cwd(), 'data', 'niyojan.db')
};

export const validateEnv = (): void => {
  if (config.port <= 0 || config.port > 65535) {
    throw new Error(`Invalid PORT specified in environment: ${config.port}`);
  }
};
