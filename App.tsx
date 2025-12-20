
import React, { useState } from 'react';
import { ComplaintResolverService } from './services/gemini';
import { AgentStatus, PipelineResults } from './types';
import { AgentCard } from './components/AgentCard';

// Icons
const CategoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
);
const PriorityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
);
const DraftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
const ActionIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
);
const StateIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
);

const INITIAL_RESULTS: PipelineResults = {
  categorizer: { output: '', status: AgentStatus.IDLE, timestamp: 0 },
  prioritizer: { output: '', status: AgentStatus.IDLE, timestamp: 0 },
  drafter: { output: '', status: AgentStatus.IDLE, timestamp: 0 },
  planner: { output: '', status: AgentStatus.IDLE, timestamp: 0 },
  evaluator: { output: '', status: AgentStatus.IDLE, timestamp: 0 },
};

const DEFAULT_COMPLAINTS = `Complaint ID: COMP-001
User: "I was double charged for my monthly subscription and I haven't heard back from support for 3 days. This is unacceptable."

Complaint ID: COMP-002
User: "The mobile app keeps crashing whenever I try to upload a photo. I've reinstalled twice."

Complaint ID: COMP-003
User: "Your delivery driver left the package in the rain and now my electronics are ruined."`;

export default function App() {
  const [input, setInput] = useState(DEFAULT_COMPLAINTS);
  const [results, setResults] = useState<PipelineResults>(INITIAL_RESULTS);
  const [isBusy, setIsBusy] = useState(false);

  const runPipeline = async () => {
    if (!input.trim() || isBusy) return;

    setIsBusy(true);
    setResults(INITIAL_RESULTS);
    const service = new ComplaintResolverService();

    try {
      // Step 1: Categorizer
      setResults(prev => ({ ...prev, categorizer: { ...prev.categorizer, status: AgentStatus.RUNNING } }));
      const catOut = await service.runCategorizer(input);
      setResults(prev => ({ ...prev, categorizer: { output: catOut, status: AgentStatus.COMPLETED, timestamp: Date.now() } }));

      // Step 2: Prioritizer
      setResults(prev => ({ ...prev, prioritizer: { ...prev.prioritizer, status: AgentStatus.RUNNING } }));
      const prioOut = await service.runPrioritizer(input, catOut);
      setResults(prev => ({ ...prev, prioritizer: { output: prioOut, status: AgentStatus.COMPLETED, timestamp: Date.now() } }));

      // Step 3: Drafter
      setResults(prev => ({ ...prev, drafter: { ...prev.drafter, status: AgentStatus.RUNNING } }));
      const draftOut = await service.runDrafter(input, prioOut);
      setResults(prev => ({ ...prev, drafter: { output: draftOut, status: AgentStatus.COMPLETED, timestamp: Date.now() } }));

      // Step 4: Planner
      setResults(prev => ({ ...prev, planner: { ...prev.planner, status: AgentStatus.RUNNING } }));
      const planOut = await service.runPlanner(input, draftOut, prioOut);
      setResults(prev => ({ ...prev, planner: { output: planOut, status: AgentStatus.COMPLETED, timestamp: Date.now() } }));

      // Step 5: Evaluator
      setResults(prev => ({ ...prev, evaluator: { ...prev.evaluator, status: AgentStatus.RUNNING } }));
      const allContext = `Categorization: ${catOut}\nPriorities: ${prioOut}\nDrafts: ${draftOut}\nActions: ${planOut}`;
      const evalOut = await service.runEvaluator(allContext);
      setResults(prev => ({ ...prev, evaluator: { output: evalOut, status: AgentStatus.COMPLETED, timestamp: Date.now() } }));

    } catch (error) {
      console.error("Pipeline failed", error);
    } finally {
      setIsBusy(false);
    }
  };

  const isComplete = results.evaluator.status === AgentStatus.COMPLETED;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-4 md:p-8 space-y-8">
      <header className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent italic">SENTINEL-X</h1>
            <p className="text-slate-500 text-sm font-medium tracking-tight">COMPLAINT RESOLVER AGENT ENGINE</p>
          </div>
        </div>
        
        <button 
          onClick={runPipeline}
          disabled={isBusy}
          className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${
            isBusy 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:-translate-y-0.5'
          }`}
        >
          {isBusy ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
              PROCESSING FEED...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              RESOLVE COMPLAINTS
            </>
          )}
        </button>
      </header>

      <main className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex-1 flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Complaint Feed</span>
              <div className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">LIVE</div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 w-full bg-transparent p-6 font-mono text-sm outline-none resize-none text-blue-100/90 custom-scrollbar placeholder:text-slate-700"
              placeholder="// Paste customer complaints here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4 max-h-[700px] overflow-y-auto custom-scrollbar pr-2">
          <AgentCard name="Phase 1: Categorizer" role="Context Specialist" result={results.categorizer} icon={<CategoryIcon />} />
          <AgentCard name="Phase 2: Prioritizer" role="Risk Strategist" result={results.prioritizer} icon={<PriorityIcon />} />
          <AgentCard name="Phase 3: Response Drafter" role="Empathy Architect" result={results.drafter} icon={<DraftIcon />} />
          <AgentCard name="Phase 4: Action Planner" role="Operations Lead" result={results.planner} icon={<ActionIcon />} />
          <AgentCard name="Phase 5 & 6: Re-evaluator" role="Compliance Overseer" result={results.evaluator} icon={<StateIcon />} />
        </div>
      </main>

      {isComplete && (
        <section className="max-w-7xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-slate-900 shadow-2xl overflow-hidden">
            <div className="bg-emerald-600/10 px-6 py-4 border-b border-emerald-500/20 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <h2 className="font-bold text-emerald-100 tracking-wide uppercase text-sm">System Resolution Summary</h2>
            </div>
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800">
                    <h3 className="text-blue-400 font-bold text-xs uppercase mb-4 tracking-widest">Urgency Re-evaluation</h3>
                    <div className="text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                      {results.evaluator.output.split('HIGH_PRIORITY_STATE:')[0].replace('URGENCY_REEVALUATION:', '').trim()}
                    </div>
                  </div>
                  <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 shadow-[0_0_20px_rgba(244,63,94,0.05)]">
                    <h3 className="text-rose-400 font-bold text-xs uppercase mb-4 tracking-widest">High Priority State Tracking</h3>
                    <div className="text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                      {results.evaluator.output.split('HIGH_PRIORITY_STATE:')[1]?.trim() || "No critical states logged."}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      <footer className="max-w-7xl w-full mx-auto pb-8 pt-4 flex items-center justify-between text-slate-600 text-[10px] tracking-widest uppercase font-bold">
        <span>© 2025 SENTINEL-X CUSTOMER CARE</span>
        <div className="flex gap-4">
          <span>GEMINI PRO AGENT CLUSTER</span>
          <span className="text-slate-800">•</span>
          <span>AUTONOMOUS RESOLUTION</span>
        </div>
      </footer>
    </div>
  );
}
