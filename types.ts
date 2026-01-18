
export type UserRole = 'Student' | 'Faculty' | 'Admin';

export interface LoginState {
  isLoggedIn: boolean;
  user: {
    name: string;
    role: UserRole;
    id: string;
  } | null;
  error: string | null;
  isLoading: boolean;
}

export interface AssistantMessage {
  role: 'user' | 'model';
  text: string;
}

// Added missing Agent types referenced in AgentCard.tsx
export enum AgentStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED'
}

export interface AgentResult {
  status: AgentStatus;
  output: string;
}
