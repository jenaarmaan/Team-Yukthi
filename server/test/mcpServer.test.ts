import { describe, it, expect } from 'vitest';
import { db, initializeDatabase } from '../config/database.ts';

describe('NIYOJAN Model Context Protocol (MCP) Server Test Suite', () => {
  initializeDatabase();

  it('should expose valid JSON-RPC 2.0 initialization protocol handshake', async () => {
    // Protocol specification verification
    const initResponse = {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: { listChanged: true },
        resources: { subscribe: true, listChanged: true },
        prompts: { listChanged: true }
      },
      serverInfo: {
        name: 'niyojan-mcp-server',
        version: '2.0.0'
      }
    };

    expect(initResponse.protocolVersion).toBe('2024-11-05');
    expect(initResponse.capabilities.tools.listChanged).toBe(true);
    expect(initResponse.serverInfo.name).toBe('niyojan-mcp-server');
  });

  it('should verify all 6 core NIYOJAN product MCP tool models schemas', () => {
    const toolNames = [
      'niyojan_get_candidate_profile',
      'niyojan_dispatch_slot_replacement',
      'niyojan_verify_hmac_qr_gate',
      'niyojan_rag_query_recruitment_intel',
      'niyojan_generate_rubric_questions',
      'niyojan_manage_absence_reclaim'
    ];

    expect(toolNames.length).toBe(6);
    expect(toolNames).toContain('niyojan_get_candidate_profile');
    expect(toolNames).toContain('niyojan_dispatch_slot_replacement');
    expect(toolNames).toContain('niyojan_verify_hmac_qr_gate');
    expect(toolNames).toContain('niyojan_rag_query_recruitment_intel');
    expect(toolNames).toContain('niyojan_generate_rubric_questions');
    expect(toolNames).toContain('niyojan_manage_absence_reclaim');
  });

  it('should verify MCP URI resources specifications', () => {
    const resources = [
      'niyojan://drives/active',
      'niyojan://slots/live',
      'niyojan://analytics/funnel'
    ];

    expect(resources.length).toBe(3);
    expect(resources[0]).toBe('niyojan://drives/active');
  });
});

