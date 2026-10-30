import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { initializeApp, getApps, getApp, App, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';
import { logger } from '../utils/logger.ts';

export interface FirebaseAppletConfigFile {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId?: string;
  oAuthClientId?: string;
  recaptchaSiteKey?: string;
}

export interface FirebaseGatewayState {
  isInitialized: boolean;
  phase: string;
  projectId: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  hasServiceAccountCredentials: boolean;
  credentialSource: 'service_account_env' | 'service_account_file' | 'google_cloud_adc' | 'applet_config';
  databaseUrl?: string;
}

// Load and parse configuration from firebase-applet-config.json
export const loadFirebaseConfig = (): FirebaseAppletConfigFile => {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, 'utf8');
      return JSON.parse(raw) as FirebaseAppletConfigFile;
    } catch (err) {
      logger.error('Failed to parse firebase-applet-config.json:', err);
    }
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0973974932',
    appId: '',
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: `${process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0973974932'}.firebaseapp.com`,
    firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || '(default)',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0973974932'}.firebasestorage.app`,
    messagingSenderId: ''
  };
};

export const firebaseConfig = loadFirebaseConfig();

// Resolve service account credentials if provided in environment
const resolveServiceAccount = (): { credential?: any; source: FirebaseGatewayState['credentialSource'] } => {
  // 1. JSON string in FIREBASE_SERVICE_ACCOUNT_KEY
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      if (parsed.client_email && parsed.private_key) {
        return {
          credential: cert(parsed as ServiceAccount),
          source: 'service_account_env'
        };
      }
    } catch (err) {
      logger.warn('FIREBASE_SERVICE_ACCOUNT_KEY present but failed JSON parsing');
    }
  }

  // 2. Individual environment credentials
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const formattedPrivateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    return {
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedPrivateKey
      }),
      source: 'service_account_env'
    };
  }

  // 3. File path in GOOGLE_APPLICATION_CREDENTIALS
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    try {
      const fileContent = JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
      return {
        credential: cert(fileContent as ServiceAccount),
        source: 'service_account_file'
      };
    } catch (err) {
      logger.warn('Failed to parse GOOGLE_APPLICATION_CREDENTIALS file');
    }
  }

  return {
    source: 'applet_config'
  };
};

// Initialize Admin App instance securely
let appInstance: App;
const { credential, source: credentialSource } = resolveServiceAccount();

if (getApps().length === 0) {
  const initOptions: Record<string, any> = {
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket
  };

  if (credential) {
    initOptions.credential = credential;
  }

  appInstance = initializeApp(initOptions);
  logger.info(`Firebase Admin initialized with project "${firebaseConfig.projectId}" (credential source: ${credentialSource})`);
} else {
  appInstance = getApp();
}

export const adminApp = appInstance;

export const adminDb: Firestore =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(adminApp, firebaseConfig.firestoreDatabaseId)
    : getFirestore(adminApp);

adminDb.settings({ ignoreUndefinedProperties: true });


export const adminAuth: Auth = getAuth(adminApp);
export const adminStorage: Storage = getStorage(adminApp);

export const getFirebaseGatewayStatus = (): FirebaseGatewayState => {
  return {
    isInitialized: Boolean(adminApp),
    phase: 'Phase 2 - Firebase Infrastructure Connected & Provisioned',
    projectId: firebaseConfig.projectId,
    firestoreDatabaseId: firebaseConfig.firestoreDatabaseId,
    storageBucket: firebaseConfig.storageBucket,
    hasServiceAccountCredentials: credentialSource.startsWith('service_account'),
    credentialSource
  };
};
