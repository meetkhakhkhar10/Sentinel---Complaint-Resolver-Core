
export enum AgentStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AgentResult {
  output: string;
  status: AgentStatus;
  timestamp: number;
}

export interface PipelineResults {
  categorizer: AgentResult;
  prioritizer: AgentResult;
  drafter: AgentResult;
  planner: AgentResult;
  evaluator: AgentResult;
}

export interface AuditSession {
  complaints: string;
  results: PipelineResults;
}
