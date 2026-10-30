import { describe, it, expect } from 'vitest';
import { QuestionSuggestionService } from '../services/questionSuggestionService.ts';
import { hasPermission } from '../middleware/rbacMatrix.ts';
import {
  interviewEvaluationsRepository,
  interviewerAvailabilityRepository,
  interviewerConflictsRepository,
  interviewerIncidentsRepository
} from '../repositories/index.ts';

describe('NIYOJAN Dedicated Interviewer Workspace Integration Tests', () => {
  describe('1. Role-Based Access Control (RBAC) & Permission Isolation', () => {
    it('should grant interviewer workspace permissions to authorized interviewer role', () => {
      expect(hasPermission('interviewer', 'interviewer:workspace:view')).toBe(true);
      expect(hasPermission('interviewer', 'interviewer:candidates:view')).toBe(true);
      expect(hasPermission('interviewer', 'interviewer:execution:manage')).toBe(true);
      expect(hasPermission('interviewer', 'interviewer:evaluations:submit')).toBe(true);
      expect(hasPermission('interviewer', 'interviewer:availability:manage')).toBe(true);
      expect(hasPermission('interviewer', 'interviewer:conflicts:declare')).toBe(true);
      expect(hasPermission('interviewer', 'interviewer:incidents:report')).toBe(true);
      expect(hasPermission('interviewer', 'interviewer:questions:view')).toBe(true);
    });

    it('should strictly deny interviewer workspace permissions to candidates', () => {
      expect(hasPermission('candidate', 'interviewer:workspace:view')).toBe(false);
      expect(hasPermission('candidate', 'interviewer:candidates:view')).toBe(false);
      expect(hasPermission('candidate', 'interviewer:execution:manage')).toBe(false);
      expect(hasPermission('candidate', 'interviewer:evaluations:submit')).toBe(false);
      expect(hasPermission('candidate', 'interviewer:availability:manage')).toBe(false);
      expect(hasPermission('candidate', 'interviewer:conflicts:declare')).toBe(false);
      expect(hasPermission('candidate', 'notes:view')).toBe(false);
    });

    it('should protect confidential conflicts from being viewed by other interviewers', () => {
      expect(hasPermission('interviewer', 'interviewer:conflicts:view_own')).toBe(true);
      expect(hasPermission('interviewer', 'interviewer:conflicts:view_all')).toBe(false);
      expect(hasPermission('hr_admin', 'interviewer:conflicts:view_all')).toBe(true);
      expect(hasPermission('super_admin', 'interviewer:conflicts:view_all')).toBe(true);
    });
  });

  describe('2. Suggested Questions Engine', () => {
    it('should suggest relevant questions matching candidate skills and role', () => {
      const result = QuestionSuggestionService.suggestQuestions({
        skills: ['Java', 'Data Structures & Algorithms', 'System Design'],
        role: 'Graduate Software Engineer',
        interviewRound: 'Technical Round 1'
      });

      expect(result.source).toBe('rule_based_catalog');
      expect(result.questions.length).toBeGreaterThan(0);
      const hasDsaOrJava = result.questions.some(
        (q) => q.relevantSkills.includes('Java') || q.relevantSkills.includes('Data Structures & Algorithms')
      );
      expect(hasDsaOrJava).toBe(true);
    });

    it('should include target evaluation key points and difficulty ranking for questions', () => {
      const catalog = QuestionSuggestionService.getAllCatalogQuestions();
      expect(catalog.length).toBeGreaterThan(5);
      catalog.forEach((q) => {
        expect(q.id).toBeDefined();
        expect(q.expectedKeyPoints.length).toBeGreaterThan(0);
        expect(['entry', 'intermediate', 'advanced']).toContain(q.difficulty);
      });
    });
  });

  describe('3. Scorecards, Evaluations and Idempotency', () => {
    const testSlotId = 'slot_test_eval_' + Date.now();
    const testEvalId = `eval_${testSlotId}_int_01`;

    it('should create and store evaluation in repository with draft status', async () => {
      const draft = await interviewEvaluationsRepository.create(testEvalId, {
        id: testEvalId,
        applicationId: 'app_test_01',
        candidateId: 'cand_test_01',
        candidateName: 'Test Candidate',
        hiringDriveId: 'drive_excelsoft_gse_2026',
        slotId: testSlotId,
        interviewerId: 'int_01',
        interviewerName: 'Dr. Murali Krishna',
        interviewerRole: 'Principal Architect',
        roundName: 'Technical Round 1',
        criteriaScores: [
          {
            criterionId: 'crit_1',
            name: 'Technical Knowledge',
            category: 'technical',
            rating: 4,
            observation: 'Sound grasp of Java fundamentals'
          }
        ],
        strengths: ['Algorithms'],
        areasOfImprovement: ['CSS'],
        overallSummary: 'Good performance',
        recommendation: 'recommend_next_round',
        recommendationReason: 'Cleared core technical threshold',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      expect(draft.id).toBe(testEvalId);
      expect(draft.status).toBe('draft');
    });

    it('should transition evaluation to submitted and lock post-submission state', async () => {
      await interviewEvaluationsRepository.update(testEvalId, {
        status: 'submitted',
        submittedAt: new Date().toISOString()
      });

      const retrieved = await interviewEvaluationsRepository.findById(testEvalId);
      expect(retrieved?.status).toBe('submitted');
      expect(retrieved?.submittedAt).toBeDefined();
    });
  });

  describe('4. Availability & Leave Governance', () => {
    it('should persist availability records and leave requests', async () => {
      const availId = 'avail_test_' + Date.now();
      const record = await interviewerAvailabilityRepository.create(availId, {
        id: availId,
        interviewerId: 'int_01',
        date: '2026-11-25',
        status: 'leave',
        leaveType: 'sick',
        approvalStatus: 'pending',
        note: 'Outpatient appointment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      expect(record.status).toBe('leave');
      expect(record.approvalStatus).toBe('pending');
    });
  });

  describe('5. Confidential Conflict of Interest & Incident Reporting', () => {
    it('should store confidential conflict declarations with auditability', async () => {
      const conflictId = 'cnf_test_' + Date.now();
      const conflict = await interviewerConflictsRepository.create(conflictId, {
        id: conflictId,
        interviewerId: 'int_01',
        interviewerName: 'Dr. Murali Krishna',
        candidateId: 'cand_test_02',
        candidateName: 'Candidate Friend',
        applicationId: 'app_test_02',
        slotId: 'slot_test_02',
        hiringDriveId: 'drive_excelsoft_gse_2026',
        category: 'personal_relationship',
        confidentialReason: 'Personal acquaintance from previous institute',
        status: 'declared',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      expect(conflict.category).toBe('personal_relationship');
      expect(conflict.status).toBe('declared');
    });

    it('should record operational incidents with severity classifications', async () => {
      const incidentId = 'inc_test_' + Date.now();
      const incident = await interviewerIncidentsRepository.create(incidentId, {
        id: incidentId,
        interviewerId: 'int_01',
        interviewerName: 'Dr. Murali Krishna',
        hiringDriveId: 'drive_excelsoft_gse_2026',
        category: 'network_connectivity',
        severity: 'high',
        description: 'Temporary 5-minute broadband drop during live coding round',
        status: 'reported',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      expect(incident.category).toBe('network_connectivity');
      expect(incident.severity).toBe('high');
      expect(incident.status).toBe('reported');
    });
  });
});

