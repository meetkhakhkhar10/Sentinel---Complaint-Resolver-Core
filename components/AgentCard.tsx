
import React from 'react';
import { AgentStatus, AgentResult } from '../types';

interface AgentCardProps {
  name: string;
  role: string;
  result: AgentResult;
  icon: React.ReactNode;
}

export const AgentCard: React.FC<AgentCardProps> = ({ name, role, result, icon }) => {
  const isRunning = result.status === AgentStatus.RUNNING;
  const isCompleted = result.status === AgentStatus.COMPLETED;

  return (
    <div className={`p-5 rounded-xl border transition-all duration-500 ${
      isRunning ? 'border-blue-500 bg-blue-900/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 
      isCompleted ? 'border-emerald-500/30 bg-emerald-900/5' : 
      'border-slate-800 bg-slate-900/50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isRunning ? 'bg-blue-500 text-white animate-pulse' : 
            isCompleted ? 'bg-emerald-500 text-white' : 
            'bg-slate-700 text-slate-300'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-100">{name}</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
            </div>
          )}
          {isCompleted && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
              READY
            </span>
          )}
        </div>
      </div>
      
      <div className="relative">
        <pre className="font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-64 p-3 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 custom-scrollbar">
          {result.output || (isRunning ? 'Processing logic...' : 'Waiting for sequence...')}
        </pre>
      </div>
    </div>
  );
};
