import { describe, it, expect, beforeAll } from 'vitest';
import { JwtUtil } from '../utils/jwt.ts';
import { DistributedTransactionService } from '../services/distributedTransactionService.ts';
import { RecruitmentStateMachine } from '../services/stateMachine.ts';
import { QrSecurityService } from '../services/qrSecurityService.ts';
import { StorageService } from '../services/storageService.ts';
import { createRateLimiter } from '../middleware/rateLimiter.ts';
import { sanitizeRequestBody } from '../middleware/sanitizer.ts';
import { CandidatesController } from '../controllers/candidatesController.ts';
import {
  auditLogsRepository,
  candidateProfilesRepository,
  hiringDrivesRepository,
  applicationsRepository,
  interviewSlotsRepository,
  internalHRNotesRepository
} from '../repositories/index.ts';

describe('NIYOJAN Phase 5: Enterprise Transactional Hardening & Security Audit', () => {
  const candidate1Uid = 'cand_vitest_1_' + Date.now();
  const candidate2Uid = 'cand_vitest_2_' + Date.now();

  describe('1. Distributed Concurrency & Database-Backed Transactions', () => {
    it('should serialize concurrent claims on same slot so exactly one succeeds', async () => {
      const slotId = 'slot_vitest_occ_' + Date.now();
      const uniqueVenue = 'Room 201_' + Date.now();
      const [claim1, claim2] = await Promise.all([
        DistributedTransactionService.claimReplacementSlotTransaction({
          applicationId: 'app_v1_' + Date.now(),
          candidateId: candidate1Uid,
          hiringDriveId: 'drive_v1',
          slotId,
          venue: uniqueVenue,
          date: '2026-11-28',
          time: '10:00 AM',
          location: 'Mysuru Campus'
        }),
        DistributedTransactionService.claimReplacementSlotTransaction({
          applicationId: 'app_v2_' + Date.now(),
          candidateId: candidate2Uid,
          hiringDriveId: 'drive_v1',
          slotId,
          venue: uniqueVenue,
          date: '2026-11-28',
          time: '10:00 AM',
          location: 'Mysuru Campus'
        })
      ]);

      const oneSucceeded = (claim1.success && !claim2.success) || (!claim1.success && claim2.success);
      expect(oneSucceeded).toBe(true);
      const failedClaim = !claim1.success ? claim1 : claim2;
      expect(failedClaim.errorCode).toBe('CONCURRENCY_CONFLICT');
    });

    it('should prevent panel double-booking via database locks in Cloud Firestore', async () => {
      const panelKey = `Panel_Test_${Date.now()}`;
      const alloc1 = await DistributedTransactionService.allocatePanelTransaction({
        panelKey,
        candidateId: candidate1Uid,
        slotId: 'slot_alloc_1',
        venue: 'Room A',
        date: '2026-11-28',
        time: '02:00 PM'
      });
      const alloc2 = await DistributedTransactionService.allocatePanelTransaction({
        panelKey,
        candidateId: candidate2Uid,
        slotId: 'slot_alloc_2',
        venue: 'Room A',
        date: '2026-11-28',
        time: '02:00 PM'
      });

      expect(alloc1.success).toBe(true);
      expect(alloc2.success).toBe(false);
      expect(alloc2.errorCode).toBe('CONCURRENCY_BLOCKED');
    });

    it('should reject expired replacement slot claims (past deadline)', async () => {
      const expiredClaim = await DistributedTransactionService.claimReplacementSlotTransaction({
        applicationId: 'app_v_exp',
        candidateId: candidate1Uid,
        hiringDriveId: 'drive_v_exp',
        slotId: 'slot_v_exp_' + Date.now(),
        venue: 'Room B_' + Date.now(),
        date: '2026-11-28',
        time: '03:00 PM',
        location: 'Bengaluru Campus',
        confirmationDeadline: new Date(Date.now() - 3600000).toISOString()
      });

      expect(expiredClaim.success).toBe(false);
      expect(expiredClaim.errorCode).toBe('EXPIRED');
    });

    it('should reject duplicate applications via database idempotency key', async () => {
      const driveId = 'drive_idemp_v_' + Date.now();
      const first = await DistributedTransactionService.registerApplicationTransaction({
        candidateId: candidate1Uid,
        hiringDriveId: driveId
      });
      const duplicate = await DistributedTransactionService.registerApplicationTransaction({
        candidateId: candidate1Uid,
        hiringDriveId: driveId
      });

      expect(first.success).toBe(true);
      expect(duplicate.success).toBe(false);
      expect(duplicate.errorCode).toBe('DUPLICATE_APPLICATION');
    });
  });

  describe('2. Recruitment State Machine Integrity', () => {
    it('should reject terminal state mutation (completed -> shortlisted)', () => {
      const res = RecruitmentStateMachine.validateApplicationTransition('completed', 'shortlisted');
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('INVALID_STATE_TRANSITION');
    });

    it('should reject terminal state mutation (rejected -> confirmed)', () => {
      const res = RecruitmentStateMachine.validateApplicationTransition('rejected', 'confirmed');
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('INVALID_STATE_TRANSITION');
    });

    it('should reject reopening blocked application without super_admin role', () => {
      const candidateAttempt = RecruitmentStateMachine.validateApplicationTransition('blocked', 'confirmed', 'candidate');
      const hrAttempt = RecruitmentStateMachine.validateApplicationTransition('blocked', 'confirmed', 'hr_admin');
      const superAdminAttempt = RecruitmentStateMachine.validateApplicationTransition('blocked', 'confirmed', 'super_admin');

      expect(candidateAttempt.isValid).toBe(false);
      expect(candidateAttempt.errorCode).toBe('BLOCKED_STATE_VIOLATION');
      expect(hrAttempt.isValid).toBe(false);
      expect(superAdminAttempt.isValid).toBe(true);
    });

    it('should reject premature recovery before candidate acceptance', () => {
      const premature = RecruitmentStateMachine.validateRecoveryTransition('invitations_dispatched', 'recovered', false);
      const valid = RecruitmentStateMachine.validateRecoveryTransition('invitations_dispatched', 'recovered', true);

      expect(premature.isValid).toBe(false);
      expect(premature.errorCode).toBe('PREMATURE_RECOVERY_VIOLATION');
      expect(valid.isValid).toBe(true);
    });

    it('should reject invalid standby invitation state transitions', () => {
      const invalid = RecruitmentStateMachine.validateStandbyTransition('declined', 'confirmed_slot');
      const valid = RecruitmentStateMachine.validateStandbyTransition('replacement_offered', 'confirmed_slot');

      expect(invalid.isValid).toBe(false);
      expect(invalid.errorCode).toBe('INVALID_STANDBY_TRANSITION');
      expect(valid.isValid).toBe(true);
    });
  });

  describe('3. Security Audit & Token Governance', () => {
    it('should issue and verify valid JWT authentication tokens', async () => {
      const token = JwtUtil.sign({
        uid: 'user_jwt_test',
        email: 'test@niyojan.edu',
        role: 'candidate',
        displayName: 'Test Candidate'
      });
      const verified = await JwtUtil.verify(token);

      expect(verified.uid).toBe('user_jwt_test');
      expect(verified.role).toBe('candidate');
      expect(verified.emailVerified).toBe(true);
    });

    it('should reject forged or tampered JWT signatures', async () => {
      const token = JwtUtil.sign({
        uid: 'user_tamper',
        email: 'tamper@niyojan.edu',
        role: 'candidate'
      });
      const parts = token.split('.');
      const tampered = `${parts[0]}.${parts[1]}.forged_signature_12345`;

      await expect(JwtUtil.verify(tampered)).rejects.toThrow();
    });

    it('should reject revoked tokens immediately upon session logout', async () => {
      const token = JwtUtil.sign({
        uid: 'user_revoke_test',
        email: 'revoke@niyojan.edu',
        role: 'candidate'
      });

      // Verify token passes initially
      const before = await JwtUtil.verify(token);
      expect(before.uid).toBe('user_revoke_test');

      // Revoke token
      JwtUtil.revokeToken(token);

      // Verify token is now rejected
      await expect(JwtUtil.verify(token)).rejects.toMatchObject({
        code: 'auth/id-token-revoked'
      });
    });

    it('should reject all sessions for a user upon global logout revocation', async () => {
      const uid = 'user_global_revoke_' + Date.now();
      const token1 = JwtUtil.sign({ uid, email: 'g@niyojan.edu', role: 'candidate' }, 3600);

      // Global revocation timestamp
      JwtUtil.revokeUserSessions(uid);

      await expect(JwtUtil.verify(token1)).rejects.toMatchObject({
        code: 'auth/id-token-revoked'
      });
    });
  });

  describe('4. Storage Security & File Upload Policy', () => {
    it('should reject unpermitted file types (executable, html)', async () => {
      await expect(
        StorageService.generateRestrictedUploadUrl({
          candidateId: 'cand_1',
          driveId: 'drive_1',
          documentType: 'resume',
          originalFileName: 'malware.exe',
          mimeType: 'application/x-msdownload'
        })
      ).rejects.toThrow('Only PDF and JPEG/PNG images are accepted');

      await expect(
        StorageService.generateRestrictedUploadUrl({
          candidateId: 'cand_1',
          driveId: 'drive_1',
          documentType: 'resume',
          originalFileName: 'payload.html',
          mimeType: 'text/html'
        })
      ).rejects.toThrow('Only PDF and JPEG/PNG images are accepted');
    });

    it('should reject file sizes exceeding 5MB limit', async () => {
      await expect(
        StorageService.generateRestrictedUploadUrl({
          candidateId: 'cand_1',
          driveId: 'drive_1',
          documentType: 'resume',
          originalFileName: 'huge_resume.pdf',
          mimeType: 'application/pdf',
          fileSizeBytes: 8 * 1024 * 1024 // 8MB
        })
      ).rejects.toThrow('exceeds maximum limit of 5MB');
    });

    it('should generate isolated private upload URLs with expiration', async () => {
      const res = await StorageService.generateRestrictedUploadUrl({
        candidateId: 'cand_isolated_1',
        driveId: 'drive_isolated_1',
        documentType: 'resume',
        originalFileName: 'my_resume.pdf',
        mimeType: 'application/pdf',
        fileSizeBytes: 1024 * 1024
      });

      expect(res.storagePath).toContain('documents/drive_isolated_1/cand_isolated_1/resume/');
      expect(res.isPrivate).toBe(true);
      expect(new Date(res.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('5. Input Sanitization & Abuse Mitigation', () => {
    it('should sanitize request payloads against XSS and null bytes', () => {
      const req: any = {
        body: {
          name: 'Praveen <script>alert("xss")</script>',
          notes: 'Candidate feedback with null \0 byte and javascript:void(0);'
        },
        query: {}
      };
      const res: any = {};
      sanitizeRequestBody(req, res, () => {});

      expect(req.body.name).not.toContain('<script>');
      expect(req.body.notes).not.toContain('\0');
      expect(req.body.notes).not.toContain('javascript:');
    });

    it('should enforce rate limiting and trigger HTTP 429 when threshold exceeded', () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        maxRequests: 2,
        keyPrefix: 'test_phase5_rate_' + Date.now()
      });

      let blocked = false;
      let statusCode = 200;
      const req: any = { headers: {}, socket: { remoteAddress: '192.168.1.100' } };

      for (let i = 0; i < 4; i++) {
        const res: any = {
          statusCode: 200,
          headers: {},
          setHeader(k: string, v: any) { this.headers[k] = v; },
          status(code: number) { statusCode = code; return this; },
          json() { if (statusCode === 429) blocked = true; }
        };
        limiter(req, res, () => {});
      }

      expect(blocked).toBe(true);
      expect(statusCode).toBe(429);
    });
  });

  describe('6. QR Cryptography, TTL & Replay Prevention', () => {
    it('should reject tampered HMAC-SHA256 signatures', async () => {
      const slotId = 'slot_vitest_tamper_' + Date.now();
      const pass = QrSecurityService.generateSignedPass(candidate1Uid, 'drive_tamper', slotId);
      const parts = pass.split('.');
      const tampered = `${parts[0]}.${parts[1]}.tampered_sig_12345`;

      const check = await QrSecurityService.verifySignedPass(tampered, slotId, candidate1Uid);
      expect(check.valid).toBe(false);
      expect(check.errorCode).toBe('SIGNATURE_MISMATCH');
    });

    it('should reject candidate or slot binding mismatch', async () => {
      const slot1 = 'slot_bind_1_' + Date.now();
      const slot2 = 'slot_bind_2_' + Date.now();
      const pass = QrSecurityService.generateSignedPass(candidate1Uid, 'drive_bind', slot1);

      const checkWrongSlot = await QrSecurityService.verifySignedPass(pass, slot2, candidate1Uid);
      const checkWrongCand = await QrSecurityService.verifySignedPass(pass, slot1, candidate2Uid);

      expect(checkWrongSlot.valid).toBe(false);
      expect(checkWrongSlot.errorCode).toBe('BINDING_MISMATCH');
      expect(checkWrongCand.valid).toBe(false);
      expect(checkWrongCand.errorCode).toBe('BINDING_MISMATCH');
    });

    it('should prevent replay of consumed single-use nonce via Cloud Firestore', async () => {
      const slotId = 'slot_vitest_nonce_' + Date.now();
      const pass = QrSecurityService.generateSignedPass(candidate1Uid, 'drive_nonce', slotId);

      const firstUse = await QrSecurityService.verifySignedPass(pass, slotId, candidate1Uid);
      const secondUse = await QrSecurityService.verifySignedPass(pass, slotId, candidate1Uid);

      expect(firstUse.valid).toBe(true);
      expect(secondUse.valid).toBe(false);
      expect(secondUse.errorCode).toBe('REPLAY_PREVENTED');
    });

    it('should generate valid 6-digit OTP with 15-minute window', () => {
      const { otp, expiresAt } = QrSecurityService.generateOtp();
      expect(/^\d{6}$/.test(otp)).toBe(true);
      const diffMs = new Date(expiresAt).getTime() - Date.now();
      expect(diffMs).toBeGreaterThan(14 * 60 * 1000);
      expect(diffMs).toBeLessThanOrEqual(16 * 60 * 1000);
    });
  });

  describe('7. Database & Audit Integrity', () => {
    it('should throw error on audit log update or delete (strictly append-only)', async () => {
      const logId = 'log_immutability_' + Date.now();
      await auditLogsRepository.create(logId, {
        id: logId,
        timestamp: new Date().toISOString(),
        action: 'VITEST_SECURITY',
        actorId: 'admin_vitest',
        actorRole: 'admin',
        targetId: 't1',
        details: 'Audit log integrity check'
      });

      await expect(auditLogsRepository.update(logId, { details: 'hacked' } as any)).rejects.toThrow(
        'append-only and strictly immutable'
      );
      await expect(auditLogsRepository.delete(logId)).rejects.toThrow(
        'append-only and strictly immutable'
      );
    });
  });

  describe('8. Career Preferences (Up to 4 Locations Boundary)', () => {
    it('should allow saving up to 4 preferred locations for candidate profile', async () => {
      const prefUid = 'cand_pref_' + Date.now();
      await candidateProfilesRepository.create(prefUid, {
        id: prefUid,
        candidateType: 'fresher',
        fullName: 'Test Candidate Preferences',
        email: 'pref.cand@example.com',
        phone: '+91 9888877777',
        currentLocation: 'Mysuru',
        preferredLocations: ['Mysuru'],
        education: {
          institution: 'MSRIT',
          degree: 'B.Tech',
          branch: 'Computer Science',
          yearOfPassing: 2026,
          cgpa: 8.8
        },
        skills: [
          { id: 'sk_java', name: 'Java', category: 'language', proficiency: 'advanced', verificationLevel: 'assessment_verified' },
          { id: 'sk_sql', name: 'SQL', category: 'database', proficiency: 'intermediate', verificationLevel: 'assessment_verified' }
        ],
        verificationStatus: 'verified',
        profileCompletionPercentage: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      let statusCode = 200;
      let responseBody: any = null;
      const mockRes: any = {
        status(code: number) {
          statusCode = code;
          return this;
        },
        json(data: any) {
          responseBody = data;
          return this;
        }
      };

      // Valid: 4 cities
      const validReq: any = {
        user: { uid: prefUid, role: 'candidate' },
        body: { preferredLocations: ['Mysuru', 'Bengaluru', 'Hyderabad', 'Pune'] }
      };
      await CandidatesController.updatePreferredLocations(validReq, mockRes);
      expect(statusCode).toBe(200);
      expect(responseBody.success).toBe(true);
      expect(responseBody.data.preferredLocations).toEqual(['Mysuru', 'Bengaluru', 'Hyderabad', 'Pune']);

      // Invalid: 5 cities (> 4)
      let rejectedCode = 200;
      let rejectedBody: any = null;
      const rejectRes: any = {
        status(code: number) {
          rejectedCode = code;
          return this;
        },
        json(data: any) {
          rejectedBody = data;
          return this;
        }
      };
      const invalidReq: any = {
        user: { uid: prefUid, role: 'candidate' },
        body: { preferredLocations: ['Mysuru', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai'] }
      };
      await CandidatesController.updatePreferredLocations(invalidReq, rejectRes);
      expect(rejectedCode).toBe(400);
      expect(rejectedBody.success).toBe(false);
      expect(rejectedBody.error.message).toContain('between 1 and 4');
    });
  });
});
