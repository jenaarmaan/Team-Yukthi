import { describe, it, expect, beforeEach } from 'vitest';
import { AssistantService } from '../services/assistantService.ts';

describe('NIYOJAN Role-Aware AI Assistant Service & Context Engine', () => {
  beforeEach(() => {
    AssistantService.clearHistory('cand_test_01');
    AssistantService.clearHistory('int_test_01');
    AssistantService.clearHistory('hr_test_01');
  });

  it('should accurately classify user intents across recruitment queries', () => {
    expect(AssistantService.classifyIntent('What is my current application status?')).toBe('APPLICATION_STATUS');
    expect(AssistantService.classifyIntent('How does the dynamic QR check-in pass work?')).toBe('ATTENDANCE_AND_QR');
    expect(AssistantService.classifyIntent('What is my waitlist rank and queue position?')).toBe('WAITLIST_POSITION');
    expect(AssistantService.classifyIntent('Can I get a standby replacement slot?')).toBe('STANDBY_AND_RECOVERY');
    expect(AssistantService.classifyIntent('I missed my interview slot due to medical emergency')).toBe('ABSENCE_GOVERNANCE');
    expect(AssistantService.classifyIntent('When is my next interview scheduled?')).toBe('INTERVIEW_SCHEDULE');
    expect(AssistantService.classifyIntent('Explain 4-tier skill verification credentials')).toBe('SKILL_VERIFICATION');
    expect(AssistantService.classifyIntent('Show active hiring drives and vacancies')).toBe('HIRING_DRIVES');
    expect(AssistantService.classifyIntent('Show rubric scorecard criteria and question difficulty banks')).toBe('INTERVIEW_EVALUATION');
    expect(AssistantService.classifyIntent('Show recruitment pipeline funnel and selection rates')).toBe('RECRUITMENT_ANALYTICS');
    expect(AssistantService.classifyIntent('Show audit logs and user permissions')).toBe('SYSTEM_AND_SECURITY');
  });

  it('should return role-tailored prompt suggestions for all 6 roles', () => {
    const candidateSuggestions = AssistantService.getRoleSuggestions('candidate');
    expect(candidateSuggestions.length).toBeGreaterThanOrEqual(4);
    expect(candidateSuggestions[0]).toContain('application status');

    const interviewerSuggestions = AssistantService.getRoleSuggestions('interviewer');
    expect(interviewerSuggestions[0]).toContain('assigned interview slots');

    const coordinatorSuggestions = AssistantService.getRoleSuggestions('interview_coordinator');
    expect(coordinatorSuggestions[0]).toContain('QR check-in');

    const managerSuggestions = AssistantService.getRoleSuggestions('recruitment_manager');
    expect(managerSuggestions[0]).toContain('pipeline funnel');

    const hrAdminSuggestions = AssistantService.getRoleSuggestions('hr_admin');
    expect(hrAdminSuggestions[0]).toContain('hiring drives');

    const superAdminSuggestions = AssistantService.getRoleSuggestions('super_admin');
    expect(superAdminSuggestions[0]).toContain('telemetry');
  });

  it('should process candidate queries with strict personal data scope', async () => {
    const user = {
      uid: 'cand_test_01',
      email: 'rohan.sharma.vtu@gmail.com',
      role: 'candidate' as const,
      displayName: 'Rohan Sharma'
    };

    const res = await AssistantService.processMessage(user, 'What is my current application status?');
    expect(res.role).toBe('candidate');
    expect(res.intent).toBe('APPLICATION_STATUS');
    expect(res.answer.length).toBeGreaterThan(20);
    expect(res.suggestions.length).toBeGreaterThanOrEqual(4);

    // Verify history was saved
    const history = AssistantService.getHistory('cand_test_01');
    expect(history.length).toBe(2); // user + assistant
    expect(history[0].sender).toBe('user');
    expect(history[1].sender).toBe('assistant');
  });

  it('should process interviewer queries without exposing confidential HR notes', async () => {
    const user = {
      uid: 'int_test_01',
      email: 'murali.krishna@excelsoftcorp.com',
      role: 'interviewer' as const,
      displayName: 'Dr. Murali Krishna'
    };

    const res = await AssistantService.processMessage(user, 'Show my assigned interviews and rubrics');
    expect(res.role).toBe('interviewer');
    expect(res.answer).toContain('interviewer');
    // Verify explicit Zero-Trust note protection is stated
    expect(res.answer.toLowerCase()).toContain('zero-trust');
  });

  it('should process HR Admin queries with organizational drive context', async () => {
    const user = {
      uid: 'hr_test_01',
      email: 'praveen.kumar@excelsoftcorp.com',
      role: 'hr_admin' as const,
      displayName: 'Praveen Kumar'
    };

    const res = await AssistantService.processMessage(user, 'Show all hiring drives and absences');
    expect(res.role).toBe('hr_admin');
    expect(res.answer).toContain('Absence');
    expect(res.actionLinks).toBeDefined();
    expect(res.actionLinks?.length).toBeGreaterThan(0);
  });

  it('should manage conversation history lifecycle correctly', () => {
    AssistantService.clearHistory('session_lifecycle');
    expect(AssistantService.getHistory('session_lifecycle').length).toBe(0);

    AssistantService.appendMessage('session_lifecycle', {
      id: 'm1',
      sender: 'user',
      text: 'Hello NIYOJAN',
      timestamp: new Date().toISOString()
    });

    AssistantService.appendMessage('session_lifecycle', {
      id: 'm2',
      sender: 'assistant',
      text: 'Hello! How can I assist you?',
      timestamp: new Date().toISOString()
    });

    const history = AssistantService.getHistory('session_lifecycle');
    expect(history.length).toBe(2);

    AssistantService.clearHistory('session_lifecycle');
    expect(AssistantService.getHistory('session_lifecycle').length).toBe(0);
  });
});

