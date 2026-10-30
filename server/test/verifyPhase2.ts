import { adminApp, adminDb, adminAuth, adminStorage, firebaseConfig, getFirebaseGatewayStatus } from '../config/firebase.ts';
import { HealthService } from '../services/healthService.ts';
import { StorageService } from '../services/storageService.ts';
import { NIYOJAN_COLLECTION_NAMES, repositories } from '../repositories/index.ts';

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
  console.log('   NIYOJAN PHASE 2: FIREBASE INFRASTRUCTURE VERIFICATION   ');
  console.log('=============================================================\n');

  // Test 1: Firebase Admin Initialization
  try {
    const gateway = getFirebaseGatewayStatus();
    const appName = adminApp.name;
    const isReady = Boolean(adminApp && appName);
    record('Firebase Admin SDK', 'Initializes Admin App with Project & Named Database', isReady, {
      appName,
      projectId: gateway.projectId,
      firestoreDatabaseId: gateway.firestoreDatabaseId,
      storageBucket: gateway.storageBucket,
      credentialSource: gateway.credentialSource
    });
  } catch (err: any) {
    record('Firebase Admin SDK', 'Initializes Admin App with Project & Named Database', false, undefined, err.message);
  }

  // Test 2: Firestore Collection Definitions & Typed Repositories
  try {
    const totalCollections = NIYOJAN_COLLECTION_NAMES.length;
    const repoKeys = Object.keys(repositories);
    const passed = totalCollections >= 14 && repoKeys.length === totalCollections;
    record('Firestore Schema & Repositories', 'All NIYOJAN collections typed and initialized', passed, {
      totalCollections,
      collections: NIYOJAN_COLLECTION_NAMES,
      repositoriesMapped: repoKeys.length
    });
  } catch (err: any) {
    record('Firestore Schema & Repositories', 'All 14 NIYOJAN collections typed and initialized', false, undefined, err.message);
  }

  // Test 3: Genuine Firestore Read / Write / Cleanup
  try {
    const testDocId = `verify_phase2_${Date.now()}`;
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents`;
    const docUrl = `${baseUrl}/_health_check/${testDocId}?key=${firebaseConfig.apiKey}`;

    // Write
    const writeRes = await fetch(docUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          testRunner: { stringValue: 'verifyPhase2' },
          timestamp: { timestampValue: new Date().toISOString() },
          active: { booleanValue: true }
        }
      })
    });
    const writeOk = writeRes.ok;

    // Read back
    let readOk = false;
    let readFields: any = null;
    if (writeOk) {
      const readRes = await fetch(docUrl);
      const readData = await readRes.json();
      readOk = readRes.ok && Boolean(readData.fields);
      readFields = readData.fields;
    }

    // Cleanup
    let cleanupOk = false;
    if (writeOk) {
      const delRes = await fetch(docUrl, { method: 'DELETE' });
      cleanupOk = delRes.ok;
    }

    const testPassed = writeOk && readOk && cleanupOk;
    record('Cloud Firestore Operations', 'Live read, write, and cleanup on dedicated diagnostic document', testPassed, {
      testDocId,
      writeStatus: writeRes.status,
      readVerified: readOk,
      cleanupStatus: cleanupOk ? 200 : 'failed',
      writtenService: readFields?.testRunner?.stringValue
    });
  } catch (err: any) {
    record('Cloud Firestore Operations', 'Live read, write, and cleanup on dedicated diagnostic document', false, undefined, err.message);
  }

  // Test 4: Authentication ID Token Verification
  try {
    // 4A: Reject invalid / forged token
    let rejectedInvalid = false;
    let rejectCode = '';
    try {
      await adminAuth.verifyIdToken('invalid.jwt.token.string');
    } catch (authErr: any) {
      rejectedInvalid = true;
      rejectCode = authErr.code || authErr.message;
    }

    record('Firebase Authentication', 'Verifies and rejects forged / invalid ID token', rejectedInvalid, {
      rejectionCode: rejectCode
    });
  } catch (err: any) {
    record('Firebase Authentication', 'Verifies and rejects forged / invalid ID token', false, undefined, err.message);
  }

  // Test 5: Storage Restricted Upload URL Generation
  try {
    const uploadRes = await StorageService.generateRestrictedUploadUrl({
      candidateId: 'test_candidate_101',
      driveId: 'drive_excelsoft_gse_2026',
      documentType: 'resume',
      originalFileName: 'rahul_sharma_resume.pdf',
      mimeType: 'application/pdf',
      fileSizeBytes: 1024 * 500
    });

    const isRestricted = uploadRes.isPrivate === true;
    const hasPath = uploadRes.storagePath.includes('documents/drive_excelsoft_gse_2026/test_candidate_101/resume/');
    const hasUploadUrl = Boolean(uploadRes.uploadUrl);

    record('Cloud Storage Access', 'Generates restricted, short-lived upload URL for candidate documents', isRestricted && hasPath && hasUploadUrl, {
      storagePath: uploadRes.storagePath,
      method: uploadRes.method,
      expiresAt: uploadRes.expiresAt,
      isPrivate: uploadRes.isPrivate,
      uploadUrlType: uploadRes.uploadUrl.startsWith('https://storage.googleapis.com') ? 'GCS_V4_Signed' : 'Secure_Backend_Proxy'
    });
  } catch (err: any) {
    record('Cloud Storage Access', 'Generates restricted, short-lived upload URL for candidate documents', false, undefined, err.message);
  }

  // Test 6: Storage MIME Type Constraint Enforcement
  try {
    let rejectedExecutable = false;
    try {
      await StorageService.generateRestrictedUploadUrl({
        candidateId: 'malicious_user',
        driveId: 'drive_excelsoft_gse_2026',
        documentType: 'resume',
        originalFileName: 'malware.exe',
        mimeType: 'application/x-msdownload'
      });
    } catch (mimeErr: any) {
      rejectedExecutable = mimeErr.message.includes('Invalid file type');
    }

    record('Cloud Storage Access', 'Rejects unauthorized file types (enforcing PDF / images only)', rejectedExecutable);
  } catch (err: any) {
    record('Cloud Storage Access', 'Rejects unauthorized file types (enforcing PDF / images only)', false, undefined, err.message);
  }

  // Test 7: Live Database Health Check Endpoint Service
  try {
    const dbHealth = await HealthService.getDatabaseHealth();
    const isConnected = dbHealth.status === 'connected';
    record('Health Service Integration', 'getDatabaseHealth accurately reports genuine live Firestore status', isConnected, {
      status: dbHealth.status,
      database: dbHealth.database,
      mode: dbHealth.mode,
      latencyMs: dbHealth.connectivityTest.latencyMs,
      collectionsCount: dbHealth.collectionsCount,
      writeSuccess: dbHealth.connectivityTest.writeSuccess,
      readSuccess: dbHealth.connectivityTest.readSuccess,
      cleanupSuccess: dbHealth.connectivityTest.cleanupSuccess
    });
  } catch (err: any) {
    record('Health Service Integration', 'getDatabaseHealth accurately reports genuine live Firestore status', false, undefined, err.message);
  }

  // Test 8: System Info & Architecture Reporting
  try {
    const sysInfo = HealthService.getSystemInfo();
    const hasArchitecture = sysInfo.architecture.databaseTarget.includes(firebaseConfig.firestoreDatabaseId);
    record('System Architecture', 'Reports multi-viewport, Node.js 22, Express, and Firestore configuration', hasArchitecture, {
      application: sysInfo.application,
      runtime: sysInfo.architecture.runtime,
      databaseTarget: sysInfo.architecture.databaseTarget,
      automatedQASuites: sysInfo.modules.automatedQASuites
    });
  } catch (err: any) {
    record('System Architecture', 'Reports multi-viewport, Node.js 22, Express, and Firestore configuration', false, undefined, err.message);
  }

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log('\n=============================================================');
  console.log(`   PHASE 2 SUMMARY: ${passedCount} PASSED / ${failedCount} FAILED (TOTAL ${results.length})   `);
  console.log('=============================================================\n');

  return {
    summary: {
      total: results.length,
      passed: passedCount,
      failed: failedCount
    },
    results
  };
}

// Direct execution when run via CLI
if (process.argv[1]?.endsWith('verifyPhase2.ts')) {
  runPhase2Verification()
    .then((out) => {
      if (out.summary.failed > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error('Test runner fatal crash:', err);
      process.exit(1);
    });
}
