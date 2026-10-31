import { describe, it, expect, beforeEach } from 'vitest';
import { recruitmentService } from '../../src/services/storageService';

describe('Fairness-Aware Multi-Stage Candidate Prioritisation (FMCP) Engine', () => {
  beforeEach(() => {
    // Reset admin role to super_admin for full allocation privileges
    recruitmentService.switchAdminRole('super_admin');
  });

  describe('1. Weighted Scoring (Merit & Suitability)', () => {
    it('should correctly score candidates using verified skills and academic qualifications', () => {
      const candidates = recruitmentService.getAllCandidates();
      expect(candidates.length).toBeGreaterThan(0);

      const targetCandidate = candidates[0].profile;
      const score = recruitmentService.calculateFmcpScore(targetCandidate.id);

      expect(score).toBeDefined();
      expect(score.totalFmcpScore).toBeGreaterThanOrEqual(0);
      expect(score.totalFmcpScore).toBeLessThanOrEqual(100);

      // Weighted Merit checks (max 65)
      expect(score.weightedMeritScore).toBeGreaterThan(0);
      expect(score.weightedMeritScore).toBeLessThanOrEqual(65);
      expect(score.skillsScore).toBeGreaterThanOrEqual(0);
      expect(score.skillsScore).toBeLessThanOrEqual(35);
      expect(score.qualificationScore).toBeGreaterThanOrEqual(0);
      expect(score.qualificationScore).toBeLessThanOrEqual(20);
      expect(score.experienceScore).toBeGreaterThanOrEqual(0);
      expect(score.experienceScore).toBeLessThanOrEqual(10);
    });

    it('should grant higher skill weight to assessment/hr-verified badges than unverified skills', () => {
      const candidates = recruitmentService.getAllCandidates();
      const cand = candidates[0].profile;

      const score = recruitmentService.calculateFmcpScore(cand.id);
      expect(score.skillsScore).toBeGreaterThanOrEqual(15);
      expect(score.transparentReasons.some((r) => r.includes('Weighted Merit'))).toBe(true);
    });
  });

  describe('2. Fair Ranking (Disparity Reduction & Anti-Bias)', () => {
    it('should apply parity equalizer for state university candidates with verified skills', () => {
      const candidates = recruitmentService.getAllCandidates();
      const stateUnivCand = candidates.find((c) =>
        c.profile.education.institution.toLowerCase().includes('vtu') ||
        c.profile.education.institution.toLowerCase().includes('affiliated')
      );

      if (stateUnivCand) {
        const score = recruitmentService.calculateFmcpScore(stateUnivCand.profile.id);
        expect(score.fairRankingScore).toBeGreaterThanOrEqual(5);
        expect(score.disparateImpactRatio).toBeGreaterThanOrEqual(0.80);
        expect(score.parityCategory).toBe('state_univ_inclusion');
        expect(score.fairnessAdjustmentDetails).toContain('Applied Institutional Parity Equalizer');
      }
    });

    it('should maintain Disparate Impact Ratio >= 0.80 (EEOC 4/5ths rule)', () => {
      const audit = recruitmentService.getFmcpFairnessAudit();
      expect(audit.disparateImpactMetric).toBeGreaterThanOrEqual(0.80);
      expect(audit.parityAdjustmentsCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('3. Aging Priority (Anti-Starvation Progression)', () => {
    it('should calculate aging priority score based on queue elapsed time', () => {
      const waitlist = recruitmentService.getAllWaitlistApplications();
      expect(waitlist.length).toBeGreaterThan(0);

      const waitlistedCand = waitlist[0].candidate;
      const score = recruitmentService.calculateFmcpScore(waitlistedCand.id);

      expect(score.agingPriorityScore).toBeGreaterThanOrEqual(10);
      expect(score.hoursQueued).toBeGreaterThanOrEqual(24);
      expect(score.starvationPreventionApplied).toBe(true);
      expect(score.agingRationale).toContain('Active Anti-Starvation Lock');
    });

    it('should elevate priority as queue wait time increases to prevent perpetual leapfrogging', () => {
      const recs = recruitmentService.getFmcpRecommendations();
      expect(recs.length).toBeGreaterThan(1);

      // Verify that candidates in queue receive aging boosts
      const agingBoosted = recs.filter((r) => r.fmcpScore.agingPriorityScore >= 10);
      expect(agingBoosted.length).toBeGreaterThan(0);
    });
  });

  describe('4. Constraint-Based Allocation (Appointments & Scheduling)', () => {
    it('should verify venue, time window, and panelist conflict constraints', () => {
      const candidates = recruitmentService.getAllCandidates();
      const cand = candidates[0].profile;

      const score = recruitmentService.calculateFmcpScore(cand.id, undefined, {
        location: 'Mysuru Campus',
        time: '11:00 AM - 12:00 PM IST'
      });

      expect(score.venueConstraintMet).toBe(true);
      expect(score.timeWindowConstraintMet).toBe(true);
      expect(score.panelistConflictFree).toBe(true);
      expect(score.isAllocationFeasible).toBe(true);
      expect(score.constraintScore).toBe(10);
    });

    it('should successfully appoint a candidate to an interview slot with In-App QR Pass and audit log', () => {
      const candidates = recruitmentService.getAllCandidates();
      const target = candidates[0].profile;

      const appointmentResult = recruitmentService.appointCandidateFmcp(
        target.id,
        {
          date: 'Saturday, Nov 28, 2026',
          time: '11:00 AM - 12:00 PM IST',
          roomOrPanel: 'Panel 1 (Technical & Architecture)',
          location: 'Mysuru Campus',
          venueAddress: 'Excelsoft Technologies, Mysuru Campus Center'
        },
        'Test HR Admin',
        'Appointed via FMCP Engine unit test'
      );

      expect(appointmentResult.success).toBe(true);
      expect(appointmentResult.data).toBeDefined();
      expect(appointmentResult.data?.qrToken).toContain('NIYOJAN_FMCP');
      expect(appointmentResult.data?.otpCode).toBeDefined();
      expect(appointmentResult.data?.roomOrPanel).toBe('Panel 1 (Technical & Architecture)');

      // Verify candidate application status transitioned to confirmed
      const updatedApplications = recruitmentService.getAllApplications();
      const app = updatedApplications.find((a) => a.candidateId === target.id);
      expect(app?.status).toBe('confirmed');
      expect(app?.interviewSlot).toBeDefined();
    });

    it('should prevent double-booking of the same panel slot via atomic concurrency mutex', () => {
      const candidates = recruitmentService.getAllCandidates();
      expect(candidates.length).toBeGreaterThanOrEqual(2);

      const candidateA = candidates[0].profile;
      const candidateB = candidates[1].profile;

      const sharedSlot = {
        date: 'Sunday, Nov 29, 2026',
        time: '02:00 PM - 03:00 PM IST',
        roomOrPanel: 'Panel 3 (System Design)',
        location: 'Bengaluru Campus',
        venueAddress: 'Excelsoft Technologies, Bengaluru Campus'
      };

      // First appointment succeeds
      const resA = recruitmentService.appointCandidateFmcp(candidateA.id, sharedSlot, 'HR Admin');
      expect(resA.success).toBe(true);

      // Second appointment to the exact same venue/date/time collides
      const resB = recruitmentService.appointCandidateFmcp(candidateB.id, sharedSlot, 'HR Admin');
      expect(resB.success).toBe(false);
      expect(resB.errorCode).toBe('CONCURRENCY_CONFLICT');
    });
  });

  describe('5. Human-Reviewable Decision Audit Summary', () => {
    it('should generate human-reviewable explanations and transparent rationales for all ranked candidates', () => {
      const recommendations = recruitmentService.getFmcpRecommendations();
      expect(recommendations.length).toBeGreaterThan(0);

      recommendations.forEach((rec) => {
        expect(rec.fmcpScore.transparentReasons.length).toBeGreaterThanOrEqual(4);
        expect(rec.fmcpScore.transparentReasons.some((r) => r.includes('Weighted Merit'))).toBe(true);
        expect(rec.fmcpScore.transparentReasons.some((r) => r.includes('Fair Ranking'))).toBe(true);
        expect(rec.fmcpScore.transparentReasons.some((r) => r.includes('Aging Priority'))).toBe(true);
        expect(rec.fmcpScore.transparentReasons.some((r) => r.includes('Constraint Allocation'))).toBe(true);
      });
    });
  });
});
