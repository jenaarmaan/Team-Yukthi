import dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

dotenv.config();

export interface FirebaseEnvironmentConfig {
  projectId: string;
  databaseId: string;
  storageBucket: string;
  hasServiceAccount: boolean;
  hasApiKey: boolean;
}

export interface ServerConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  appUrl: string;
  corsOrigins: string[];
  apiVersion: string;
  isProduction: boolean;
  firebase: FirebaseEnvironmentConfig;
}

const parsePort = (val?: string): number => {
  const parsed = parseInt(val || '', 10);
  return isNaN(parsed) ? 3000 : parsed;
};

// Inspect firebase-applet-config.json if present
let appletConfig: { projectId?: string; firestoreDatabaseId?: string; storageBucket?: string; apiKey?: string } = {};
try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (existsSync(configPath)) {
    appletConfig = JSON.parse(readFileSync(configPath, 'utf8'));
  }
} catch {
  // Silent fallback
}

const projectId = process.env.FIREBASE_PROJECT_ID || appletConfig.projectId || 'gen-lang-client-0973974932';
const databaseId = process.env.FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId || '(default)';
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket || `${projectId}.firebasestorage.app`;
const hasServiceAccount = Boolean(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
  (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS
);
const hasApiKey = Boolean(process.env.FIREBASE_API_KEY || appletConfig.apiKey);

export const config: ServerConfig = {
  port: parsePort(process.env.PORT),
  nodeEnv: (process.env.NODE_ENV as ServerConfig['nodeEnv']) || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  corsOrigins: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  apiVersion: 'v1',
  isProduction: process.env.NODE_ENV === 'production',
  firebase: {
    projectId,
    databaseId,
    storageBucket,
    hasServiceAccount,
    hasApiKey
  }
};

export const validateEnv = (): void => {
  if (config.port <= 0 || config.port > 65535) {
    throw new Error(`Invalid PORT specified in environment: ${config.port}`);
  }

  if (!config.firebase.projectId) {
    throw new Error('Missing FIREBASE_PROJECT_ID: Neither environment nor firebase-applet-config.json defines a project ID.');
  }

  // Validate format of service account JSON if supplied
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      if (!parsed.client_email || !parsed.private_key) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing required "client_email" or "private_key" fields');
      }
    } catch (err: any) {
      throw new Error(`FIREBASE_SERVICE_ACCOUNT_KEY parsing error: ${err.message}`);
    }
  }
};
