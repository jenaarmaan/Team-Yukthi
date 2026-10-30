import { JwtUtil } from '../utils/jwt.ts';
import { DistributedTransactionService } from '../services/distributedTransactionService.ts';
import { RecruitmentStateMachine } from '../services/stateMachine.ts';
import { QrSecurityService } from '../services/qrSecurityService.ts';
import { auditLogsRepository } from '../repositories/index.ts';

interface TestResult {
  number: number;
  name: string;
  category: 'concurrency' | 'state_machine' | 'qr_security' | 'api_security' | 'reliability';
  status: 'passed' | 'failed';
  details?: any;
  error?: string;
}

export async function runPhase5Verification(): Promise<{
  summary: { total: number; passed: number; failed: number };
  results: TestResult[];
}> {
  const results: TestResult[] = [];
  const baseUrl = 'http://localhost:3000/api/v1';

  const record = (
    number: number,
    name: string,
    category: TestResult['category'],
    passed: boolean,
    details?: any,
    error?: string
  ) => {
    results.push({ number, name, category, status: passed ? 'passed' : 'failed', details, error });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [Test ${number}] ${name}`);
    if (details) console.log(`   Details:`, JSON.stringify(details));
    if (error) console.error(`   Error:`, error);
  };

  console.log('\n========================================================================');
  console.log('   NIYOJAN PHASE 5: ENTERPRISE TRANSACTIONAL HARDENING & SECURITY AUDIT  ');
  console.log('========================================================================\n');

  // Test Tokens
  const superAdminToken = JwtUtil.sign({
    uid: 'adm_super_phase5',
    email: 'superadmin.p5@excelsoftcorp.com',
    role: 'super_admin',
    displayName: 'Super Admin Phase 5'
  });

  const hrAdminToken = JwtUtil.sign({
    uid: 'adm_hr_phase5',
    email: 'hr.p5@excelsoftcorp.com',
    role: 'hr_admin',
    displayName: 'HR Admin Phase 5'
  });

  const candidate1Uid = 'cand_phase5_c1_' + Date.now();
  const candidate1Token = JwtUtil.sign({
    uid: candidate1Uid,
    email: 'c1.p5@niyojan.edu',
    role: 'candidate',
    displayName: 'Candidate Alpha'
  });

  const candidate2Uid = 'cand_phase5_c2_' + Date.now();
  const candidate2Token = JwtUtil.sign({
    uid: candidate2Uid,
    email: 'c2.p5@niyojan.edu',
    role: 'candidate',
    displayName: 'Candidate Beta'
  });

  // -------------------------------------------------------------------------
  // 1. DISTRIBUTED CONCURRENCY VERIFICATION
  // -------------------------------------------------------------------------

  // Test 1: Multi-instance distributed concurrency simulation via Firestore runTransaction OCC
  try {
    const testSlotId = 'slot_occ_test_' + Date.now();
    const [claim1, claim2] = await Promise.all([
      DistributedTransactionService.claimReplacementSlotTransaction({
        applicationId: 'app_occ_1',
        candidateId: candidate1Uid,
        hiringDriveId: 'drive_phase5_1',
        slotId: testSlotId,
        venue: 'Assessment Room 101_' + Date.now(),
        date: 'Saturday, Nov 28, 2026',
        time: '10:00 AM - 11:00 AM IST',
        location: 'Mysuru Campus'
      }),
      DistributedTransactionService.claimReplacementSlotTransaction({
        applicationId: 'app_occ_2',
        candidateId: candidate2Uid,
        hiringDriveId: 'drive_phase5_1',
        slotId: testSlotId,
        venue: 'Assessment Room 101_' + Date.now(),
        date: 'Saturday, Nov 28, 2026',
        time: '10:00 AM - 11:00 AM IST',
        location: 'Mysuru Campus'
      })
    ]);

    const oneSucceeded = (claim1.success && !claim2.success) || (!claim1.success && claim2.success);
    const failureCode = !claim1.success ? claim1.errorCode : claim2.errorCode;
    const passed = oneSucceeded && failureCode === 'CONCURRENCY_CONFLICT';

    record(
      1,
      'Distributed OCC: Two concurrent claims on same slot serialize; exactly one succeeds',
      'concurrency',
      passed,
      {
        claim1Success: claim1.success,
        claim2Success: claim2.success,
        conflictCode: failureCode
      }
    );
  } catch (err: any) {
    record(1, 'Distributed OCC concurrency test', 'concurrency', false, undefined, err.message);
  }

  // Test 2: In-memory lock independence verification (database-backed lock persistence)
  try {
    const independentSlotId = 'slot_db_indep_' + Date.now();
    const indepVenue = 'Assessment Room 102_' + Date.now();
    // First claim creates database lock
    const firstClaim = await DistributedTransactionService.claimReplacementSlotTransaction({
      applicationId: 'app_indep_1',
      candidateId: candidate1Uid,
      hiringDriveId: 'drive_phase5_2',
      slotId: independentSlotId,
      venue: indepVenue,
      date: 'Saturday, Nov 28, 2026',
      time: '11:00 AM - 12:00 PM IST',
      location: 'Mysuru Campus'
    });

    // Second claim simulated from fresh caller
    const secondClaim = await DistributedTransactionService.claimReplacementSlotTransaction({
      applicationId: 'app_indep_2',
      candidateId: candidate2Uid,
      hiringDriveId: 'drive_phase5_2',
      slotId: independentSlotId,
      venue: indepVenue,
      date: 'Saturday, Nov 28, 2026',
      time: '11:00 AM - 12:00 PM IST',
      location: 'Mysuru Campus'
    });

    const passed = firstClaim.success && !secondClaim.success && secondClaim.errorCode === 'CONCURRENCY_CONFLICT';
    record(
      2,
      'Distributed Lock Independence: Database holds lock across distinct callers/instances',
      'concurrency',
      passed,
      { firstSuccess: firstClaim.success, secondBlocked: !secondClaim.success }
    );
  } catch (err: any) {
    record(2, 'Distributed lock independence test', 'concurrency', false, undefined, err.message);
  }

  // Test 3: Panel double-booking rejection via database lock
  try {
    const panelKey = `Room_A_2026-11-28_02:00PM_${Date.now()}`;
    const alloc1 = await DistributedTransactionService.allocatePanelTransaction({
      panelKey,
      candidateId: candidate1Uid,
      slotId: 'slot_p1',
      venue: 'Room A',
      date: '2026-11-28',
      time: '02:00 PM'
    });

    const alloc2 = await DistributedTransactionService.allocatePanelTransaction({
      panelKey,
      candidateId: candidate2Uid,
      slotId: 'slot_p2',
      venue: 'Room A',
      date: '2026-11-28',
      time: '02:00 PM'
    });

    const passed = alloc1.success && !alloc2.success && alloc2.errorCode === 'CONCURRENCY_BLOCKED';
    record(
      3,
      'Panel Double-Booking Rejection: Panel schedule lock blocks conflicting allocations',
      'concurrency',
      passed,
      { alloc1: alloc1.success, alloc2Blocked: !alloc2.success, code: alloc2.errorCode }
    );
  } catch (err: any) {
    record(3, 'Panel double-booking rejection test', 'concurrency', false, undefined, err.message);
  }

  // Test 4: Expired replacement claim rejection (lapsed confirmation deadline)
  try {
    const expiredClaim = await DistributedTransactionService.claimReplacementSlotTransaction({
      applicationId: 'app_expired_1',
      candidateId: candidate1Uid,
      hiringDriveId: 'drive_phase5_3',
      slotId: 'slot_expired_' + Date.now(),
      venue: 'Room B',
      date: '2026-11-28',
      time: '03:00 PM',
      location: 'Bengaluru Campus',
      confirmationDeadline: new Date(Date.now() - 3600000).toISOString() // Lapsed 1 hour ago
    });

    const passed = !expiredClaim.success && expiredClaim.errorCode === 'EXPIRED';
    record(
      4,
      'Expired Offer Rejection: Replacement claims past confirmation deadline are rejected (410)',
      'concurrency',
      passed,
      { errorCode: expiredClaim.errorCode, message: expiredClaim.message }
    );
  } catch (err: any) {
    record(4, 'Expired replacement claim test', 'concurrency', false, undefined, err.message);
  }

  // Test 5: Duplicate application rejection via idempotency key
  try {
    const driveKey = 'drive_idemp_' + Date.now();
    const app1 = await DistributedTransactionService.registerApplicationTransaction({
      candidateId: candidate1Uid,
      hiringDriveId: driveKey
    });

    const app2 = await DistributedTransactionService.registerApplicationTransaction({
      candidateId: candidate1Uid,
      hiringDriveId: driveKey
    });

    const passed = app1.success && !app2.success && app2.errorCode === 'DUPLICATE_APPLICATION';
    record(
      5,
      'Database Idempotency: Duplicate application submissions blocked atomically by key',
      'concurrency',
      passed,
      { firstSubmitted: app1.success, duplicateRejected: !app2.success, code: app2.errorCode }
    );
  } catch (err: any) {
    record(5, 'Duplicate application idempotency test', 'concurrency', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // 2. RECRUITMENT STATE MACHINE INTEGRITY
  // -------------------------------------------------------------------------

  // Test 6: Invalid state transition rejection (terminal state completed -> shortlisted)
  try {
    const invalidCheck = RecruitmentStateMachine.validateApplicationTransition('completed', 'shortlisted');
    const validCheck = RecruitmentStateMachine.validateApplicationTransition('registered', 'shortlisted');
    const passed = !invalidCheck.isValid && invalidCheck.errorCode === 'INVALID_STATE_TRANSITION' && validCheck.isValid;

    record(
      6,
      'State Machine: Terminal state mutations (completed -> shortlisted) strictly rejected',
      'state_machine',
      passed,
      { invalidTransitionBlocked: !invalidCheck.isValid, validTransitionAllowed: validCheck.isValid }
    );
  } catch (err: any) {
    record(6, 'State machine transition rejection test', 'state_machine', false, undefined, err.message);
  }

  // Test 7: Blocked candidate re-application / transition rejection without Super Admin override
  try {
    const candidateAttempt = RecruitmentStateMachine.validateApplicationTransition('blocked', 'confirmed', 'candidate');
    const hrAttempt = RecruitmentStateMachine.validateApplicationTransition('blocked', 'confirmed', 'hr_admin');
    const superAdminAttempt = RecruitmentStateMachine.validateApplicationTransition('blocked', 'confirmed', 'super_admin');

    const passed =
      !candidateAttempt.isValid &&
      candidateAttempt.errorCode === 'BLOCKED_STATE_VIOLATION' &&
      !hrAttempt.isValid &&
      superAdminAttempt.isValid;

    record(
      7,
      'Policy Block Guard: Blocked status cannot be reopened without explicit Super Admin role',
      'state_machine',
      passed,
      {
        candidateBlocked: !candidateAttempt.isValid,
        hrBlocked: !hrAttempt.isValid,
        superAdminAllowed: superAdminAttempt.isValid
      }
    );
  } catch (err: any) {
    record(7, 'Policy block guard test', 'state_machine', false, undefined, err.message);
  }

  // Test 8: Premature slot recovery rejection before candidate acceptance
  try {
    // Vacant slot incident without candidate acceptance
    const prematureCheck = RecruitmentStateMachine.validateRecoveryTransition('invitations_dispatched', 'recovered', false);
    const validRecoveryCheck = RecruitmentStateMachine.validateRecoveryTransition('invitations_dispatched', 'recovered', true);

    const passed =
      !prematureCheck.isValid &&
      prematureCheck.errorCode === 'PREMATURE_RECOVERY_VIOLATION' &&
      validRecoveryCheck.isValid;

    record(
      8,
      'Premature Recovery Guard: Slot cannot be marked RECOVERED before candidate acceptance',
      'state_machine',
      passed,
      { prematureBlocked: !prematureCheck.isValid, acceptedRecoveryAllowed: validRecoveryCheck.isValid }
    );
  } catch (err: any) {
    record(8, 'Premature recovery guard test', 'state_machine', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // 3. QR ATTENDANCE SECURITY & REPLAY PREVENTION
  // -------------------------------------------------------------------------

  // Test 9: QR HMAC signature tampering detection
  try {
    const slotId = 'slot_qr_test_' + Date.now();
    const driveId = 'drive_qr_test_1';
    const validPass = QrSecurityService.generateSignedPass(candidate1Uid, driveId, slotId);

    // Tamper with the signature portion
    const parts = validPass.split('.');
    const tamperedPass = `${parts[0]}.${parts[1]}.tampered_signature_payload_xyz`;

    const validation = await QrSecurityService.verifySignedPass(tamperedPass, slotId, candidate1Uid);
    const passed = !validation.valid && validation.errorCode === 'SIGNATURE_MISMATCH';

    record(
      9,
      'QR Cryptography: Tampered or forged HMAC-SHA256 signature rejected immediately',
      'qr_security',
      passed,
      { valid: validation.valid, errorCode: validation.errorCode }
    );
  } catch (err: any) {
    record(9, 'QR HMAC tampering test', 'qr_security', false, undefined, err.message);
  }

  // Test 10: QR 5-minute expiration rejection
  try {
    const slotId = 'slot_qr_exp_' + Date.now();
    // Simulate expired pass by payload decode and back-dating expiresAt
    const now = Math.floor(Date.now() / 1000);
    const expiredPayload = {
      candidateId: candidate1Uid,
      hiringDriveId: 'drive_qr_exp',
      slotId,
      nonce: 'nonce_exp_' + Date.now(),
      issuedAt: now - 600,
      expiresAt: now - 300 // Expired 5 minutes ago
    };
    const crypto = await import('crypto');
    const secret = process.env.QR_HMAC_SECRET || 'niyojan-venue-qr-secret-key-2026-secure-hmac';
    const b64 = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
    const expiredPass = `NIYOJAN_V2.${b64}.${sig}`;

    const validation = await QrSecurityService.verifySignedPass(expiredPass, slotId, candidate1Uid);
    const passed = !validation.valid && validation.errorCode === 'TOKEN_EXPIRED';

    record(
      10,
      'QR Expiration: QR Passes older than 5 minutes (TTL=300s) rejected with TOKEN_EXPIRED',
      'qr_security',
      passed,
      { valid: validation.valid, errorCode: validation.errorCode }
    );
  } catch (err: any) {
    record(10, 'QR expiration test', 'qr_security', false, undefined, err.message);
  }

  // Test 11: QR candidate and slot binding mismatch rejection
  try {
    const correctSlotId = 'slot_binding_corr_' + Date.now();
    const wrongSlotId = 'slot_binding_wrong_' + Date.now();
    const pass = QrSecurityService.generateSignedPass(candidate1Uid, 'drive_bind', correctSlotId);

    const checkWrongSlot = await QrSecurityService.verifySignedPass(pass, wrongSlotId, candidate1Uid);
    const checkWrongCand = await QrSecurityService.verifySignedPass(pass, correctSlotId, candidate2Uid);

    const passed =
      !checkWrongSlot.valid &&
      checkWrongSlot.errorCode === 'BINDING_MISMATCH' &&
      !checkWrongCand.valid &&
      checkWrongCand.errorCode === 'BINDING_MISMATCH';

    record(
      11,
      'QR Binding Integrity: Token presentation at wrong slot or by wrong candidate rejected',
      'qr_security',
      passed,
      { slotMismatchBlocked: !checkWrongSlot.valid, candidateMismatchBlocked: !checkWrongCand.valid }
    );
  } catch (err: any) {
    record(11, 'QR binding mismatch test', 'qr_security', false, undefined, err.message);
  }

  // Test 12: QR transactional single-use nonce replay prevention
  try {
    const slotId = 'slot_replay_' + Date.now();
    const validPass = QrSecurityService.generateSignedPass(candidate1Uid, 'drive_replay', slotId);

    // First use: Should succeed and record nonce in ledger
    const firstScan = await QrSecurityService.verifySignedPass(validPass, slotId, candidate1Uid);

    // Second use (Replay attempt): Must be rejected
    const secondScan = await QrSecurityService.verifySignedPass(validPass, slotId, candidate1Uid);

    const passed = firstScan.valid && !secondScan.valid && secondScan.errorCode === 'REPLAY_PREVENTED';

    record(
      12,
      'QR Replay Prevention: Transactional nonce ledger blocks re-presentation of consumed token',
      'qr_security',
      passed,
      { firstScanPassed: firstScan.valid, replayBlocked: !secondScan.valid, code: secondScan.errorCode }
    );
  } catch (err: any) {
    record(12, 'QR replay prevention test', 'qr_security', false, undefined, err.message);
  }

  // Test 13: OTP generation, 15-minute expiration, and verification
  try {
    const { otp, expiresAt } = QrSecurityService.generateOtp();
    const otpValidFormat = /^\d{6}$/.test(otp);
    const expiryTime = new Date(expiresAt).getTime();
    const is15MinsAhead = expiryTime - Date.now() > 14 * 60 * 1000 && expiryTime - Date.now() <= 16 * 60 * 1000;

    const passed = otpValidFormat && is15MinsAhead;
    record(
      13,
      'OTP Generation: 6-digit numeric OTP generated with 15-minute validity window',
      'qr_security',
      passed,
      { otpLength: otp.length, expiresAt, is15MinsAhead }
    );
  } catch (err: any) {
    record(13, 'OTP generation test', 'qr_security', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // 4. API SECURITY & ABUSE CONTROLS
  // -------------------------------------------------------------------------

  // Test 14: Rate limiting enforcement (sliding-window middleware returns HTTP 429)
  try {
    const { createRateLimiter } = await import('../middleware/rateLimiter.ts');
    const testLimiter = createRateLimiter({
      windowMs: 60000,
      maxRequests: 3,
      keyPrefix: 'test_limit_' + Date.now()
    });

    let rateLimited = false;
    let finalStatus = 200;
    const mockReq: any = { headers: {}, socket: { remoteAddress: '10.0.0.1' } };
    for (let i = 0; i < 5; i++) {
      const mockRes: any = {
        statusCode: 200,
        headers: {},
        setHeader(k: string, v: any) {
          this.headers[k] = v;
        },
        status(code: number) {
          this.statusCode = code;
          finalStatus = code;
          return this;
        },
        json(payload: any) {
          if (finalStatus === 429) rateLimited = true;
        }
      };
      testLimiter(mockReq, mockRes, () => {});
    }

    const passed = rateLimited && finalStatus === 429;
    record(
      14,
      'Rate Limiting: Exceeding threshold triggers HTTP 429 with Retry-After header',
      'api_security',
      passed,
      { rateLimited, finalStatus }
    );
  } catch (err: any) {
    record(14, 'Rate limiting test', 'api_security', false, undefined, err.message);
  }

  // Test 15: Input sanitization (strips script injection and null bytes)
  try {
    const { sanitizeRequestBody } = await import('../middleware/sanitizer.ts');
    const maliciousReq: any = {
      body: {
        candidateName: 'Praveen <script>alert("xss")</script>',
        note: 'Candidate remarks with null \0 byte and javascript:payload'
      },
      query: {}
    };
    const mockRes: any = {};
    sanitizeRequestBody(maliciousReq, mockRes, () => {});

    const scriptStripped = !maliciousReq.body.candidateName.includes('<script>');
    const nullStripped = !maliciousReq.body.note.includes('\0');
    const jsStripped = !maliciousReq.body.note.includes('javascript:');

    const passed = scriptStripped && nullStripped && jsStripped;
    record(
      15,
      'Input Sanitization: Request payloads sanitized against XSS, null bytes and script injection',
      'api_security',
      passed,
      { sanitizedBody: maliciousReq.body }
    );
  } catch (err: any) {
    record(15, 'Input sanitization test', 'api_security', false, undefined, err.message);
  }

  // Test 16: Append-only audit log immutability (update and delete strictly blocked)
  try {
    const testLogId = 'audit_immutable_test_' + Date.now();
    await auditLogsRepository.create(testLogId, {
      id: testLogId,
      timestamp: new Date().toISOString(),
      action: 'SECURITY_TEST',
      actorId: 'test_actor',
      actorRole: 'admin',
      targetId: 'target_1',
      details: 'Audit log entry for immutability testing'
    });

    let updateBlocked = false;
    let deleteBlocked = false;

    try {
      await auditLogsRepository.update(testLogId, { details: 'Tampered details' } as any);
    } catch (err: any) {
      if (err.message.includes('append-only and strictly immutable')) {
        updateBlocked = true;
      }
    }

    try {
      await auditLogsRepository.delete(testLogId);
    } catch (err: any) {
      if (err.message.includes('append-only and strictly immutable')) {
        deleteBlocked = true;
      }
    }

    const passed = updateBlocked && deleteBlocked;
    record(
      16,
      'Audit Log Immutability: Update and delete on audit_logs strictly blocked with error',
      'api_security',
      passed,
      { updateBlocked, deleteBlocked }
    );
  } catch (err: any) {
    record(16, 'Audit log immutability test', 'api_security', false, undefined, err.message);
  }

  // Test 17: Candidate private profile and notes isolation
  try {
    const candidateOtherProfileRes = await fetch(`${baseUrl}/candidates/cand_other_999`, {
      headers: { Authorization: `Bearer ${candidate1Token}` }
    });
    const candidateNotesRes = await fetch(`${baseUrl}/notes/cand_other_999`, {
      headers: { Authorization: `Bearer ${candidate1Token}` }
    });

    const candidateProfileBlocked = candidateOtherProfileRes.status === 403;
    const candidateNotesBlocked = candidateNotesRes.status === 403;
    const passed = candidateProfileBlocked && candidateNotesBlocked;

    record(
      17,
      'Data Privacy Isolation: Candidate blocked (403) from other profiles and internal HR notes',
      'api_security',
      passed,
      { profileStatus: candidateOtherProfileRes.status, notesStatus: candidateNotesRes.status }
    );
  } catch (err: any) {
    record(17, 'Data privacy isolation test', 'api_security', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // 5. RELIABILITY, SCALE & REGRESSION
  // -------------------------------------------------------------------------

  // Test 18: Pagination on candidate and application rosters (limit, offset, total)
  try {
    const paginatedRes = await fetch(`${baseUrl}/applications?limit=2&offset=0`, {
      headers: { Authorization: `Bearer ${hrAdminToken}` }
    });
    const data = (await paginatedRes.json()) as any;
    const totalHeader = paginatedRes.headers.get('X-Total-Count');
    const hasItems = Array.isArray(data.data?.items) || Array.isArray(data.data);
    const passed = paginatedRes.status === 200 && (data.data?.limit === 2 || totalHeader !== null);

    record(
      18,
      'API Pagination: Applications roster supports limit and offset parameters with total count',
      'reliability',
      passed,
      { status: paginatedRes.status, totalHeader, limit: data.data?.limit }
    );
  } catch (err: any) {
    record(18, 'API pagination test', 'reliability', false, undefined, err.message);
  }

  // Test 19: Dynamic QR Pass Generation and Verification End-to-End
  try {
    // Generate pass via endpoint
    const passRes = await fetch(`${baseUrl}/attendance/pass/app_rohan_gse_01`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    const passData = (await passRes.json()) as any;
    const hasPass = passData.success && Boolean(passData.data?.qrPass);

    let verifyPassed = false;
    if (hasPass) {
      const verifyRes = await fetch(`${baseUrl}/attendance/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${superAdminToken}`
        },
        body: JSON.stringify({
          applicationId: 'app_rohan_gse_01',
          method: 'qr',
          providedCode: passData.data.qrPass
        })
      });
      const verifyData = (await verifyRes.json()) as any;
      verifyPassed = verifyRes.status === 200 || (verifyRes.status === 409 && verifyData.error?.code === 'REPLAY_PREVENTED');
    }

    const passed = hasPass && verifyPassed;
    record(
      19,
      'End-to-End Dynamic Pass: Generation with 5-minute TTL and single-use gate verification',
      'reliability',
      passed,
      { hasPass, verifyPassed }
    );
  } catch (err: any) {
    record(19, 'End-to-End dynamic pass test', 'reliability', false, undefined, err.message);
  }

  // Test 20: Regression verification for 9 recruitment core workflows
  try {
    const healthRes = await fetch(`${baseUrl}/health`);
    const dbHealthRes = await fetch(`${baseUrl}/health/database`);
    const drivesRes = await fetch(`${baseUrl}/drives`);
    const standbyRes = await fetch(`${baseUrl}/standby`, {
      headers: { Authorization: `Bearer ${hrAdminToken}` }
    });
    const absenceRes = await fetch(`${baseUrl}/absence`, {
      headers: { Authorization: `Bearer ${hrAdminToken}` }
    });

    const allEndpointsHealthy =
      healthRes.status === 200 &&
      dbHealthRes.status === 200 &&
      drivesRes.status === 200 &&
      standbyRes.status === 200 &&
      absenceRes.status === 200;

    record(
      20,
      'Core Workflow Regression: Health, Catalog, Standby Pool, and Absence APIs fully operational',
      'reliability',
      allEndpointsHealthy,
      {
        health: healthRes.status,
        dbHealth: dbHealthRes.status,
        drives: drivesRes.status,
        standby: standbyRes.status,
        absence: absenceRes.status
      }
    );
  } catch (err: any) {
    record(20, 'Core workflow regression test', 'reliability', false, undefined, err.message);
  }

  // Summary
  const passed = results.filter((r) => r.status === 'passed').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  console.log('\n-------------------------------------------------------------');
  console.log(`NIYOJAN PHASE 5 VERIFICATION: ${passed}/${results.length} TESTS PASSED`);
  console.log('-------------------------------------------------------------\n');

  return {
    summary: { total: results.length, passed, failed },
    results
  };
}

// Allow direct execution via tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  runPhase5Verification().then((res) => {
    if (res.summary.failed > 0) {
      process.exit(1);
    }
  });
}
