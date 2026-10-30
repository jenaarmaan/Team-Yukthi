import { HealthResponse, DatabaseHealthResponse, SystemInfoResponse } from '../types/index.ts';
import { getFirebaseGatewayStatus, firebaseConfig, adminDb } from '../config/firebase.ts';
import { config } from '../config/env.ts';
import { NIYOJAN_COLLECTION_NAMES } from '../repositories/types.ts';
import { logger } from '../utils/logger.ts';

export class HealthService {
  public static getSystemHealth(): HealthResponse {
    const memory = process.memoryUsage();
    return {
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: config.nodeEnv,
      memory: {
        rssMb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
        heapUsedMb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100
      }
    };
  }

  /**
   * Executes a genuine, live database connectivity check against Google Cloud Firestore.
   * Performs an actual write, read-back verification, and cleanup on a dedicated diagnostic document.
   */
  public static async getDatabaseHealth(): Promise<DatabaseHealthResponse> {
    const gateway = getFirebaseGatewayStatus();
    const startTime = Date.now();
    let writeSuccess = false;
    let readSuccess = false;
    let cleanupSuccess = false;
    const testDocId = `health_${Date.now()}`;
    const testDocPath = `_health_check/${testDocId}`;

    try {
      if (gateway.hasServiceAccountCredentials) {
        // Mode A: Firebase Admin SDK Direct Firestore Client
        const docRef = adminDb.collection('_health_check').doc(testDocId);
        await docRef.set({
          service: 'niyojan_health_check',
          timestamp: new Date().toISOString(),
          pid: process.pid
        });
        writeSuccess = true;

        const snap = await docRef.get();
        readSuccess = snap.exists;

        await docRef.delete();
        cleanupSuccess = true;
      } else {
        // Mode B: Provisioned Database REST Protocol Verification
        const baseUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents`;
        const docUrl = `${baseUrl}/_health_check/${testDocId}?key=${firebaseConfig.apiKey}`;

        // 1. Live write test
        const writeRes = await fetch(docUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              service: { stringValue: 'niyojan_health_check' },
              timestamp: { timestampValue: new Date().toISOString() },
              pid: { integerValue: String(process.pid) }
            }
          })
        });
        writeSuccess = writeRes.ok;

        // 2. Live read test
        if (writeSuccess) {
          const readRes = await fetch(docUrl);
          const readData = (await readRes.json()) as any;
          readSuccess = readRes.ok && Boolean(readData.fields);
        }

        // 3. Live cleanup test
        const delRes = await fetch(docUrl, { method: 'DELETE' });
        cleanupSuccess = delRes.ok;
      }
    } catch (err) {
      logger.error('Database live health check caught error:', err);
    }

    const latencyMs = Date.now() - startTime;
    const isFullyOperational = writeSuccess && readSuccess && cleanupSuccess;

    return {
      status: isFullyOperational ? 'connected' : 'degraded',
      database: 'firebase_firestore',
      mode: 'production_firestore',
      phase: gateway.phase,
      projectId: gateway.projectId,
      databaseId: gateway.firestoreDatabaseId,
      storageBucket: gateway.storageBucket,
      collectionsCount: NIYOJAN_COLLECTION_NAMES.length,
      collections: [...NIYOJAN_COLLECTION_NAMES],
      connectivityTest: {
        writeSuccess,
        readSuccess,
        cleanupSuccess,
        latencyMs,
        testDocumentPath: testDocPath
      },
      authStatus: {
        service: 'firebase_auth',
        tokenVerificationConfigured: true
      },
      storageStatus: {
        service: 'firebase_storage',
        bucket: gateway.storageBucket,
        uploadMode: gateway.hasServiceAccountCredentials ? 'signed_v4_direct' : 'secure_backend_proxy'
      },
      credentials: {
        hasServiceAccount: gateway.hasServiceAccountCredentials,
        source: gateway.credentialSource
      },
      message: isFullyOperational
        ? `Genuine Cloud Firestore connection verified. Latency: ${latencyMs}ms. Read/Write/Cleanup validated.`
        : 'Firestore connection experienced degraded response during write/read verification.',
      timestamp: new Date().toISOString()
    };
  }

  public static getSystemInfo(): SystemInfoResponse {
    const gateway = getFirebaseGatewayStatus();
    return {
      application: 'NIYOJAN',
      tagline: 'Intelligent Hiring. Seamless Opportunities.',
      partnerOrganization: 'Excelsoft Technologies',
      version: '1.2.0',
      environment: config.nodeEnv,
      architecture: {
        runtime: `Node.js ${process.version}`,
        framework: 'Express.js 4.x + TypeScript',
        frontend: 'React 19 + TypeScript + Vite 8',
        databaseTarget: `Cloud Firestore [${gateway.firestoreDatabaseId}]`
      },
      viewports: {
        candidateMobile: '390x844px Mobile Viewport with Tab & Action Flows',
        adminDashboard: '1440px Enterprise SaaS Command Center'
      },
      modules: {
        candidateMobileApp: true,
        hrAdminDashboard: true,
        concurrencyProtection: true,
        hmacQrAttendance: true,
        standbyRecoveryEngine: true,
        absenceGovernance: true,
        automatedQASuites: 9
      }
    };
  }
}
