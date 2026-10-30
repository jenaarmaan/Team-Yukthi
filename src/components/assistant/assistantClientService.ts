import { apiClient } from '../../services/apiClient.ts';
import { clientAuthService } from '../../services/firebaseAuth.ts';
import {
  AssistantMessage,
  AssistantRole,
  AssistantStatusResponse
} from './types.ts';

export class AssistantClientService {
  /**
   * Fetches the current operational status of the NIYOJAN AI Assistant.
   */
  public static async getStatus(activeRole?: AssistantRole): Promise<AssistantStatusResponse> {
    try {
      const user = clientAuthService.getCurrentUser();
      const token = await clientAuthService.getValidIdToken();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (activeRole) {
        headers['x-niyojan-role'] = activeRole;
      }
      if (user) {
        headers['x-niyojan-uid'] = user.uid;
        headers['x-niyojan-email'] = user.email;
      }

      const res = await fetch('/api/v1/assistant/status', { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[AssistantClientService] Status fetch error:', err);
    }

    return {
      status: 'online',
      engine: 'NIYOJAN Local Grounded Engine (Offline Fallback)',
      activeRole: activeRole || 'guest',
      authenticated: Boolean(clientAuthService.getCurrentUser()),
      suggestions: [
        'What is my current application status?',
        'How does dynamic QR attendance work?',
        'Show active hiring drives and vacancies',
        'Explain 4-tier skill verification'
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Sends a user chat query to the backend assistant service.
   */
  public static async sendMessage(
    message: string,
    activeRole?: AssistantRole
  ): Promise<{
    answer: string;
    role: string;
    intent: string;
    actionLinks?: any[];
    suggestions: string[];
    groundedFacts: string[];
  }> {
    const user = clientAuthService.getCurrentUser();
    const token = await clientAuthService.getValidIdToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (activeRole) {
      headers['x-niyojan-role'] = activeRole;
    }
    if (user) {
      headers['x-niyojan-uid'] = user.uid;
      headers['x-niyojan-email'] = user.email;
    }

    try {
      const res = await fetch('/api/v1/assistant/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }

      // If server returned structured error
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.error?.message || `Request failed with status ${res.status}`);
    } catch (err: any) {
      console.error('[AssistantClientService.sendMessage] Error:', err);
      // Graceful offline fallback
      return {
        answer: `I am currently operating in resilient offline mode. You can check your dashboard sections, active interview schedules, and dynamic QR passes directly. (Detail: ${err.message})`,
        role: activeRole || 'guest',
        intent: 'OFFLINE_FALLBACK',
        suggestions: [
          'What is my application status?',
          'How does the dynamic QR check-in work?',
          'What are the 4-tier skill levels?'
        ],
        groundedFacts: ['Mode: Resilient Fallback']
      };
    }
  }

  /**
   * Retrieves conversation history.
   */
  public static async getHistory(activeRole?: AssistantRole): Promise<AssistantMessage[]> {
    try {
      const user = clientAuthService.getCurrentUser();
      const token = await clientAuthService.getValidIdToken();

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (activeRole) headers['x-niyojan-role'] = activeRole;
      if (user) headers['x-niyojan-uid'] = user.uid;

      const res = await fetch('/api/v1/assistant/history', { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.history) {
          return json.data.history;
        }
      }
    } catch {
      // Ignore
    }
    return [];
  }

  /**
   * Clears conversation history.
   */
  public static async clearHistory(activeRole?: AssistantRole): Promise<boolean> {
    try {
      const user = clientAuthService.getCurrentUser();
      const token = await clientAuthService.getValidIdToken();

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (activeRole) headers['x-niyojan-role'] = activeRole;
      if (user) headers['x-niyojan-uid'] = user.uid;

      const res = await fetch('/api/v1/assistant/history', {
        method: 'DELETE',
        headers
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Executes a confirmed action.
   */
  public static async executeAction(
    action: string,
    targetId?: string,
    confirmed = true,
    activeRole?: AssistantRole
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = clientAuthService.getCurrentUser();
      const token = await clientAuthService.getValidIdToken();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (activeRole) headers['x-niyojan-role'] = activeRole;
      if (user) headers['x-niyojan-uid'] = user.uid;

      const res = await fetch('/api/v1/assistant/action', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, targetId, confirmed })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, message: json.data?.message || 'Action executed successfully.' };
      }
      return { success: false, message: json.error?.message || 'Action execution failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error executing action.' };
    }
  }
}

