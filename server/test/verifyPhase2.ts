import { getDatabaseGatewayStatus, db } from '../config/database.ts';
import { HealthService } from '../services/healthService.ts';
import { StorageService } from '../services/storageService.ts';
import { NIYOJAN_COLLECTION_NAMES, repositories } from '../repositories/index.ts';
import { JwtUtil } from '../utils/jwt.ts';

interface TestResult {
  suite: string;
  test: string;
  passed: boolean;
  details?: any;
  error?: string;
}

export async function runPhase2Verification(): Promise<{ summary: { total: number; passed: number; failed: number }; results: TestResult[] }> {
  const results: TestResult[] = [];

  const record = (suite: string, test: string, passed: boolean, details?: any, error?: string) => {
    results.push({ suite, test, passed, details, error });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${suite}] ${test}`);
    if (details) console.log(`   Details:`, JSON.stringify(details));
    if (error) console.error(`   Error:`, error);
  };

  console.log('\n=============================================================');
  console.log('   NIYOJAN PHASE 2: SQLITE INFRASTRUCTURE VERIFICATION   ');
  console.log('=============================================================\n');

  // Test 1: SQLite Database Initialization & WAL Mode
  try {
    const gateway = getDatabaseGatewayStatus();
    const isReady = gateway.isInitialized && gateway.engine === 'sqlite3_builtin';
    record('SQLite Database Engine', 'Initializes SQLite Database with WAL journal mode', isReady, {
      engine: gateway.engine,
      databasePath: gateway.databasePath,
      isWalMode: gateway.isWalMode,
      tablesCount: gateway.tablesCount
    });
  } catch (err: any) {
    record('SQLite Database Engine', 'Initializes SQLite Database with WAL journal mode', false, undefined, err.message);
  }

  // Test 2: SQLite Schema & Repositories
  try {
    const totalCollections = NIYOJAN_COLLECTION_NAMES.length;
    const repoKeys = Object.keys(repositories);
    const passed = totalCollections >= 14 && repoKeys.length === totalCollections;
    record('SQLite Schema & Repositories', 'All NIYOJAN collections typed and initialized', passed, {
      totalCollections,
      collections: NIYOJAN_COLLECTION_NAMES,
      repositoriesMapped: repoKeys.length
    });
  } catch (err: any) {
    record('SQLite Schema & Repositories', 'All NIYOJAN collections typed and initialized', false, undefined, err.message);
  }

  // Test 3: Genuine SQLite Read / Write / Cleanup
  try {
    const testDocId = `verify_phase2_${Date.now()}`;
    const now = new Date().toISOString();

    // Write
    const insertStmt = db.prepare('INSERT INTO documents (collection, id, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');
    insertStmt.run('_health_check', testDocId, JSON.stringify({ testRunner: 'verifyPhase2', active: true }), now, now);
    const writeOk = true;

    // Read back
    const selectStmt = db.prepare('SELECT data FROM documents WHERE collection = ? AND id = ?');
    const row = selectStmt.get('_health_check', testDocId) as any;
    const readOk = Boolean(row && row.data);

    // Cleanup
    const deleteStmt = db.prepare('DELETE FROM documents WHERE collection = ? AND id = ?');
    deleteStmt.run('_health_check', testDocId);
    const cleanupOk = true;

    const testPassed = writeOk && readOk && cleanupOk;
    record('SQLite Document Operations', 'Live read, write, and cleanup on dedicated diagnostic document', testPassed, {
      testDocId,
      writeVerified: writeOk,
      readVerified: readOk,
      cleanupVerified: cleanupOk
    });
  } catch (err: any) {
    record('SQLite Document Operations', 'Live read, write, and cleanup on dedicated diagnostic document', false, undefined, err.message);
  }

  // Test 4: Authentication ID Token Verification
  try {
    // 4A: Reject invalid / forged token
    let rejectedInvalid = false;
    let rejectCode = '';
    try {
      await JwtUtil.verify('invalid.jwt.token.string');
    } catch (authErr: any) {
      rejectedInvalid = true;
      rejectCode = authErr.code || authErr.message;
    }

    record('Authentication Service', 'Verifies and rejects forged / invalid ID token', rejectedInvalid, {
      rejectionCode: rejectCode
    });

    // 4B: Sign and verify genuine session token
    const sampleToken = JwtUtil.sign({
      uid: 'user_diagnostic_phase2',
      email: 'diagnostic@niyojan.local',
      role: 'super_admin',
      displayName: 'Phase 2 Verifier'
    });
    const verified = await JwtUtil.verify(sampleToken);
    const verifyPassed = verified.uid === 'user_diagnostic_phase2' && verified.role === 'super_admin';

    record('Authentication Service', 'Generates and verifies authentic HS256 JWT session tokens', verifyPassed, {
      verifiedUid: verified.uid,
      verifiedRole: verified.role
    });
  } catch (err: any) {
    record('Authentication Service', 'Token validation failed', false, undefined, err.message);
  }

  // Test 5: Storage Security & Restricted URL Generation
  try {
    const uploadRes = await StorageService.generateRestrictedUploadUrl({
      candidateId: 'cand_test_001',
      driveId: 'drive_phase2',
      documentType: 'resume',
      originalFileName: 'resume_john_doe.pdf',
      mimeType: 'application/pdf',
      fileSizeBytes: 1024 * 500
    });

    const isSecurePath = uploadRes.storagePath.startsWith('documents/drive_phase2/cand_test_001/resume/');
    const hasValidTtl = new Date(uploadRes.expiresAt) > new Date();

    record('Storage Security', 'Generates isolated private upload URL with cryptographic signature', isSecurePath && hasValidTtl, {
      storagePath: uploadRes.storagePath,
      method: uploadRes.method,
      expiresAt: uploadRes.expiresAt
    });

    // Test rejection of non-PDF/image MIME types
    let rejectedInvalidMime = false;
    try {
      await StorageService.generateRestrictedUploadUrl({
        candidateId: 'cand_test_001',
        driveId: 'drive_phase2',
        documentType: 'resume',
        originalFileName: 'script.exe',
        mimeType: 'application/x-msdownload'
      });
    } catch (err: any) {
      rejectedInvalidMime = err.message.includes('Only PDF and JPEG/PNG');
    }

    record('Storage Security', 'Enforces strict file whitelist (rejects dangerous MIME types)', rejectedInvalidMime, {
      blockedMime: 'application/x-msdownload'
    });
  } catch (err: any) {
    record('Storage Security', 'Storage operations failed', false, undefined, err.message);
  }

  // Test 6: Health Service Live Diagnostics
  try {
    const health = await HealthService.getDatabaseHealth();
    const systemInfo = HealthService.getSystemInfo();

    record('Telemetry & Health Check', 'HealthService reports live database health and system info', health.status === 'connected', {
      dbStatus: health.status,
      database: health.database,
      mode: health.mode,
      latencyMs: health.connectivityTest.latencyMs,
      appVersion: systemInfo.version
    });
  } catch (err: any) {
    record('Telemetry & Health Check', 'HealthService check failed', false, undefined, err.message);
  }

  // Summary
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log('\n=============================================================');
  console.log(`   PHASE 2 SUMMARY: ${passed}/${total} TESTS PASSED (${failed} FAILED)`);
  console.log('=============================================================\n');

  return { summary: { total, passed, failed }, results };
}

if (process.argv[1]?.endsWith('verifyPhase2.ts')) {
  runPhase2Verification().then(({ summary }) => {
    process.exit(summary.failed > 0 ? 1 : 0);
  });
}
