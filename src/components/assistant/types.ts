export type AssistantRole =
  | 'super_admin'
  | 'hr_admin'
  | 'recruitment_manager'
  | 'interview_coordinator'
  | 'interviewer'
  | 'candidate'
  | 'guest';

export interface AssistantActionLink {
  label: string;
  action: string;
  targetId?: string;
  roleRequired?: string[];
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  status?: 'sending' | 'delivered' | 'error';
  actionLinks?: AssistantActionLink[];
  intent?: string;
  groundedFacts?: string[];
}

export interface AssistantStatusResponse {
  status: 'online' | 'offline';
  engine: string;
  activeRole: AssistantRole;
  authenticated: boolean;
  suggestions: string[];
  timestamp: string;
}

