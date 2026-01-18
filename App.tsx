import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, LoginState, AssistantMessage, AgentStatus, AgentResult } from './types';
import { CampusAssistantService } from './services/gemini';
import { AgentCard } from './components/AgentCard';
import { Dashboard } from './components/Dashboard';

// Hardcoded Credentials based on request
const CREDENTIALS = {
  Student: {
    email: 'classroom10yes@gmail.student',
    pass: 'student2305207',
    name: 'Undergraduate Student'
  },
  Faculty: {
    email: 'faculty.member@uni.edu',
    pass: 'faculty2024',
    name: 'Senior Faculty Member'
  },
  Admin: {
    email: 'system.admin@uni.edu',
    pass: 'admin2024',
    name: 'System Administrator'
  }
};

interface AgentSequenceState {
  activeAgentIndex: number;
  agentResults: AgentResult[];
  isComplete: boolean;
}

export default function App() {
  const [role, setRole] = useState<UserRole>('Student');
  const [email, setEmail] = useState(CREDENTIALS.Student.email);
  const [password, setPassword] = useState('');
  const [isDashboardLaunched, setIsDashboardLaunched] = useState(false);
  
  const [loginState, setLoginState] = useState<LoginState>({
    isLoggedIn: false,
    user: null,
    error: null,
    isLoading: false,
  });

  const [sequence, setSequence] = useState<AgentSequenceState | null>(null);
  const [assistantInput, setAssistantInput] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: 'model', text: 'Welcome to UniPortal Support. Please enter your institutional credentials to continue.' }
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  const assistantService = useMemo(() => new CampusAssistantService(), []);

  useEffect(() => {
    setEmail(CREDENTIALS[role].email);
    setPassword('');
    setLoginState(prev => ({ ...prev, error: null }));
  }, [role]);

  // Password strength logic
  const passwordStrength = useMemo(() => {
    if (!password) return { label: 'Empty', color: 'bg-slate-700', width: '0%', text: 'text-slate-500' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '33%', text: 'text-red-500' };
    if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { label: 'Medium', color: 'bg-yellow-500', width: '66%', text: 'text-yellow-500' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%', text: 'text-emerald-500' };
  }, [password]);

  useEffect(() => {
    if (!sequence || sequence.isComplete || !loginState.isLoggedIn) return;

    const agents = [
      { name: 'Auth-Sentry', role: 'Identity Verification', delay: 1200, output: 'Cryptographic handshake complete. Signature matches university records... Authenticated.' },
      { name: 'Access-Arbiter', role: 'Role Authorization', delay: 1400, output: `Fetching permissions for ${role} namespace. Applying security policies... Verified.` },
      { name: 'Portal-Engin', role: 'Session Provisioning', delay: 1000, output: 'Allocating workspace resources. Mounting academic storage. Ready.' }
    ];

    const currentAgent = sequence.activeAgentIndex;
    if (currentAgent >= agents.length) {
      const timer = setTimeout(() => {
        setSequence(prev => prev ? ({ ...prev, isComplete: true }) : null);
      }, 500);
      return () => clearTimeout(timer);
    }

    setSequence(prev => {
      if (!prev) return null;
      const newResults = [...prev.agentResults];
      if (newResults[currentAgent].status === AgentStatus.IDLE) {
        newResults[currentAgent] = { status: AgentStatus.RUNNING, output: 'Initializing sequence protocol...' };
        return { ...prev, agentResults: newResults };
      }
      return prev;
    });

    const timer = setTimeout(() => {
      setSequence(prev => {
        if (!prev) return null;
        const newResults = [...prev.agentResults];
        newResults[currentAgent] = { status: AgentStatus.COMPLETED, output: agents[currentAgent].output };
        return { 
          ...prev, 
          agentResults: newResults,
          activeAgentIndex: currentAgent + 1 
        };
      });
    }, agents[currentAgent].delay);

    return () => clearTimeout(timer);
  }, [sequence, role, loginState.isLoggedIn]);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginState(prev => ({ ...prev, isLoading: true, error: null }));

    setTimeout(() => {
      const targetCreds = CREDENTIALS[role];
      if (email === targetCreds.email && password === targetCreds.pass) {
        setSequence({
          activeAgentIndex: 0,
          isComplete: false,
          agentResults: [
            { status: AgentStatus.IDLE, output: '' },
            { status: AgentStatus.IDLE, output: '' },
            { status: AgentStatus.IDLE, output: '' },
          ]
        });

        setLoginState({
          isLoggedIn: true,
          user: {
            name: targetCreds.name,
            role: role,
            id: 'UNI-' + Math.floor(100000 + Math.random() * 900000),
          },
          error: null,
          isLoading: false,
        });
      } else {
        setLoginState({
          isLoggedIn: false,
          user: null,
          error: "Invalid institutional credentials. Access denied.",
          isLoading: false
        });
      }
    }, 800);
  };

  const handleLogout = () => {
    setLoginState({ isLoggedIn: false, user: null, error: null, isLoading: false });
    setSequence(null);
    setIsDashboardLaunched(false);
    setPassword('');
  };

  const handleAssistantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;
    const userMsg: AssistantMessage = { role: 'user', text: assistantInput };
    setMessages(prev => [...prev, userMsg]);
    setAssistantInput('');
    setIsAssistantLoading(true);
    try {
      const reply = await assistantService.getHelp(assistantInput, role);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Service temporarily unavailable." }]);
    } finally { setIsAssistantLoading(false); }
  };

  if (isDashboardLaunched && loginState.user) {
    return <Dashboard user={loginState.user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 uni-gradient rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20 text-white">U</div>
            <h1 className="text-2xl font-black tracking-tight text-white italic">UNIPORTAL</h1>
          </div>
          {loginState.isLoggedIn && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white">{loginState.user?.name}</p>
                <p className="text-xs text-slate-400">{loginState.user?.role} • ID: {loginState.user?.id}</p>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700 shadow-sm">
                Sign Out
              </button>
            </div>
          )}
        </header>

        <main>
          {!loginState.isLoggedIn ? (
            <div className="max-w-md mx-auto bg-slate-900/40 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm animate-slide">
              <h2 className="text-xl font-bold mb-6 text-center text-white">Academic Gateway Access</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Institutional Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Student', 'Faculty', 'Admin'] as UserRole[]).map(r => (
                      <button 
                        key={r} 
                        onClick={() => setRole(r)} 
                        className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${role === r ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-750'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleManualLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Institutional Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-sm outline-none text-slate-100 focus:border-blue-500 transition-colors" 
                      placeholder="name@university.edu"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Passcode</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-sm outline-none text-slate-100 focus:border-blue-500 transition-colors" 
                      placeholder="••••••••"
                      required 
                    />
                    {/* Password Strength Indicator */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                        <span className="text-slate-500">Security Rating</span>
                        <span className={passwordStrength.text}>{passwordStrength.label}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${passwordStrength.color}`} 
                          style={{ width: passwordStrength.width }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={loginState.isLoading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50">
                    {loginState.isLoading ? 'Verifying Gateway...' : 'Authenticate Access'}
                  </button>
                </form>

                {loginState.error && (
                  <div className="p-4 rounded-xl text-xs font-medium border text-center bg-red-900/20 border-red-500/30 text-red-400 animate-pulse">
                    {loginState.error}
                  </div>
                )}

                <div className="pt-8 border-t border-slate-800">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Campus AI Assistant</h3>
                  <div className="bg-slate-950/50 rounded-xl border border-slate-800/50 p-4 mb-4 max-h-48 overflow-y-auto space-y-3 custom-scrollbar">
                    {messages.map((m, idx) => (
                      <div key={idx} className={`text-xs ${m.role === 'model' ? 'text-blue-400' : 'text-slate-300'}`}>
                        <span className="font-bold mr-1 uppercase text-[10px] opacity-70">{m.role === 'model' ? 'AI:' : 'You:'}</span> {m.text}
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAssistantSubmit} className="relative">
                    <input type="text" value={assistantInput} onChange={(e) => setAssistantInput(e.target.value)} placeholder="Ask about login issues..." className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-4 text-sm pr-12 text-slate-100 outline-none focus:border-blue-500 transition-colors" />
                    <button type="submit" className="absolute right-2 top-1.5 p-1 text-blue-500 hover:text-blue-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-end justify-between animate-slide">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2">Portal Initializing</h2>
                  <p className="text-slate-400 max-w-lg">Establishing secure encrypted tunnel for <span className="text-blue-400 font-bold">{loginState.user?.name}</span>.</p>
                </div>
                {sequence?.isComplete && (
                  <button onClick={() => setIsDashboardLaunched(true)} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-xl animate-pulse ring-4 ring-blue-500/20">
                    Launch Dashboard →
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sequence?.agentResults.map((res, i) => (
                  <AgentCard key={i} name={['Auth-Sentry', 'Access-Arbiter', 'Portal-Engin'][i]} role={['Identity Verification', 'Role Authorization', 'Session Provisioning'][i]} result={res} icon={<span>🔒</span>} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
