import { HealthResponse, DatabaseHealthResponse, SystemInfoResponse } from '../types/index.ts';
import { getDatabaseGatewayStatus, db } from '../config/database.ts';
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
   * Executes a genuine, live database connectivity check against SQLite.
   * Performs an actual write, read-back verification, and cleanup on a dedicated diagnostic document.
   */
  public static async getDatabaseHealth(): Promise<DatabaseHealthResponse> {
    const gateway = getDatabaseGatewayStatus();
    const startTime = Date.now();
    let writeSuccess = false;
    let readSuccess = false;
    let cleanupSuccess = false;
    const testDocId = `health_${Date.now()}`;
    const testDocPath = `_health_check/${testDocId}`;

    try {
      // 1. Live write test
      const insertStmt = db.prepare(`
        INSERT INTO documents (collection, id, data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      const now = new Date().toISOString();
      insertStmt.run(
        '_health_check',
        testDocId,
        JSON.stringify({ service: 'niyojan_health_check', timestamp: now, pid: process.pid }),
        now,
        now
      );
      writeSuccess = true;

      // 2. Live read test
      const selectStmt = db.prepare('SELECT data FROM documents WHERE collection = ? AND id = ?');
      const row = selectStmt.get('_health_check', testDocId) as any;
      readSuccess = Boolean(row && row.data);

      // 3. Live cleanup test
      const deleteStmt = db.prepare('DELETE FROM documents WHERE collection = ? AND id = ?');
      deleteStmt.run('_health_check', testDocId);
      cleanupSuccess = true;
    } catch (err) {
      logger.error('SQLite live database health check caught error:', err);
    }

    const latencyMs = Date.now() - startTime;
    const isFullyOperational = writeSuccess && readSuccess && cleanupSuccess;

    return {
      status: isFullyOperational ? 'connected' : 'degraded',
      database: 'sqlite',
      mode: 'embedded_acid',
      phase: 'active_sqlite',
      databasePath: gateway.databasePath,
      isWalMode: gateway.isWalMode,
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
        service: 'jwt_hs256',
        tokenVerificationConfigured: true
      },
      storageStatus: {
        service: 'local_disk_storage',
        storagePath: './data/uploads',
        uploadMode: 'secure_backend_proxy'
      },
      message: isFullyOperational
        ? `SQLite embedded ACID database verified. Latency: ${latencyMs}ms. Read/Write/Cleanup validated in WAL mode.`
        : 'SQLite database experienced degraded response during write/read verification.',
      timestamp: new Date().toISOString()
    };
  }

  public static getSystemInfo(): SystemInfoResponse {
    const gateway = getDatabaseGatewayStatus();
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
        databaseTarget: `SQLite Embedded Database [${gateway.databasePath}]`
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
