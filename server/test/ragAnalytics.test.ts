import { describe, it, expect } from 'vitest';
import { RagAnalyticsService } from '../services/ragAnalyticsService.ts';

describe('NIYOJAN RAG Analytics & Recruitment Intelligence Engine', () => {
  it('should build a comprehensive knowledge corpus from live SQLite data', async () => {
    const corpus = await RagAnalyticsService.buildKnowledgeCorpus();
    expect(corpus.length).toBeGreaterThan(0);
    const summary = corpus.find((c) => c.category === 'metric_summary');
    expect(summary).toBeDefined();
    expect(summary?.content).toContain('Total registered candidates');
  });

  it('should accurately classify user query intents', () => {
    expect(RagAnalyticsService.classifyIntent('What is our candidate attendance and no-show rate?')).toBe('ATTENDANCE_AND_ABSENCE');
    expect(RagAnalyticsService.classifyIntent('How are candidate selection conversion rates trending?')).toBe('CONVERSION_RATES');
    expect(RagAnalyticsService.classifyIntent('Check standby queue and slot recovery metrics')).toBe('WAITLIST_AND_STANDBY');
    expect(RagAnalyticsService.classifyIntent('Tell me about upcoming and past hiring drives')).toBe('DRIVE_PERFORMANCE');
  });

  it('should retrieve relevant chunks and generate grounded source-cited responses', async () => {
    const result = await RagAnalyticsService.executeRagQuery('What is our candidate attendance verification and no-show rate?', 'hr_admin');
    expect(result.intent).toBe('ATTENDANCE_AND_ABSENCE');
    expect(result.answer).toContain('attendance verification rate');
    expect(result.metrics.attendanceRate).toBeGreaterThan(0);
    expect(result.insights.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.sources.length).toBeGreaterThan(0);
    // Verify Secured Federated Learning (FL) Layer integration
    expect(result.answer).toContain('Secured Federated Learning (FL) Layer');
    expect(result.federatedLearning).toBeDefined();
    expect(result.federatedLearning?.enabled).toBe(true);
    expect(result.federatedLearning?.totalNodes).toBe(4);
    expect(result.federatedLearning?.zeroDataEgressVerified).toBe(true);
    expect(result.federatedLearning?.globalPrivacyBudget.epsilon).toBe(0.74);
    expect(result.sources.some((s) => s.category === 'FEDERATED_LEARNING')).toBe(true);
  });
});

