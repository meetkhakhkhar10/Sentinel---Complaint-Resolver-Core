import React, { useState } from 'react';
import { UserRole } from '../types';

interface DashboardProps {
  user: {
    name: string;
    role: UserRole;
    id: string;
  };
  onLogout: () => void;
}

const SECTIONS = [
  { id: 'home', label: 'Home / Overview', icon: '🏠' },
  { id: 'academics', label: 'Academics', icon: '📚' },
  { id: 'exams', label: 'Exams & Results', icon: '📝' },
  { id: 'finance', label: 'Fees & Finance', icon: '💰' },
  { id: 'attendance', label: 'Attendance', icon: '📊' },
  { id: 'docs', label: 'Documents', icon: '📂' },
  { id: 'faculty', label: 'Faculty Interaction', icon: '🧑‍🏫' },
  { id: 'campus', label: 'Campus Life', icon: '🏫' },
  { id: 'career', label: 'Learning & Career', icon: '🧠' },
  { id: 'notifs', label: 'Notifications', icon: '🔔' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'support', label: 'Support & Logout', icon: '🚪' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');

  const isStudent = user.role === 'Student';
  const isFaculty = user.role === 'Faculty';
  const isAdmin = user.role === 'Admin';

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 animate-slide">
            <div className="bg-gradient-to-r from-blue-900/60 to-slate-900/40 border border-blue-500/30 p-10 rounded-3xl relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome, {user.name}!</h2>
                <p className="text-blue-200 text-lg opacity-80">
                  {isStudent && `Student ID: ${user.id} | B.Tech Computer Science | Semester 4`}
                  {isFaculty && `Faculty ID: ${user.id} | Dept. of Artificial Intelligence | Senior Professor`}
                  {isAdmin && `Admin ID: ${user.id} | Systems Management Group | Full Access`}
                </p>
                <div className="mt-8 flex gap-4">
                  <span className="bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/30 uppercase tracking-widest">
                    {isStudent ? 'Current Semester' : 'Academic Year 2024-25'}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-500/30 uppercase tracking-widest">
                    Status: Verified
                  </span>
                </div>
               </div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {isStudent && [
                { label: 'Attendance', value: '92.4%', color: 'text-blue-400', sub: 'Min required: 75%' },
                { label: 'Current GPA', value: '3.82', color: 'text-emerald-400', sub: 'Last Sem: 3.75' },
                { label: 'Earned Credits', value: '64 / 120', color: 'text-amber-400', sub: 'On track' },
                { label: 'Pending Fees', value: '$0.00', color: 'text-purple-400', sub: 'Paid on May 12' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all hover:translate-y-[-4px] shadow-lg">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium">{stat.sub}</p>
                </div>
              ))}
              {(isFaculty || isAdmin) && [
                { label: 'Active Sessions', value: '12', color: 'text-blue-400', sub: 'Current system load' },
                { label: 'Pending Requests', value: '45', color: 'text-emerald-400', sub: 'Action required' },
                { label: 'Storage Used', value: '64%', color: 'text-amber-400', sub: 'Cloud capacity' },
                { label: 'Uptime', value: '99.9%', color: 'text-purple-400', sub: 'Service status' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all shadow-lg">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex justify-between items-center">
                  Recent Notifications
                  <span className="text-xs text-blue-400 font-bold cursor-pointer hover:underline uppercase tracking-tighter">View All</span>
                </h3>
                <div className="space-y-4">
                  {[
                    { title: 'Final Exam Timetable released', time: '2h ago', type: 'EXAM', urgent: true },
                    { title: 'Campus Wi-Fi Maintenance at 10 PM', time: '5h ago', type: 'IT', urgent: false },
                    { title: 'New grading policy for 2024 published', time: '1d ago', type: 'ACADEMIC', urgent: false }
                  ].map((n, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer border border-transparent hover:border-slate-700">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${n.urgent ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {n.urgent ? '⚠️' : '📢'}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-slate-100">{n.title}</p>
                        <div className="flex gap-2 text-[10px] mt-1 text-slate-500 font-bold uppercase tracking-tighter">
                          <span>{n.type}</span>
                          <span>•</span>
                          <span>{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl">
                 <h3 className="text-lg font-bold text-white mb-6">Upcoming Events</h3>
                 <div className="space-y-4">
                    {[
                      { event: 'Hackathon 2024 Briefing', date: 'Tomorrow, 10:00 AM', loc: 'Auditorium A' },
                      { event: 'Guest Lecture: AI in Healthcare', date: 'Oct 24, 02:00 PM', loc: 'Virtual Hall 2' },
                      { event: 'Inter-College Sports Meet', date: 'Oct 26, All Day', loc: 'Sports Complex' }
                    ].map((e, i) => (
                      <div key={i} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/50 flex justify-between items-center group cursor-pointer hover:border-blue-500/30 transition-all">
                        <div>
                          <p className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{e.event}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{e.loc}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{e.date}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        );

      case 'academics':
        return (
          <div className="space-y-8 animate-slide">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Design & Analysis of Algorithms', 'Cloud Computing Architecture', 'Network Security', 'Machine Learning Foundations', 'Database Management', 'Ethics in Tech'].map((course, i) => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3">
                        <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">CS-40{i+1}</span>
                     </div>
                     <h4 className="text-lg font-bold text-white pr-12 group-hover:text-blue-400 transition-colors">{course}</h4>
                     <p className="text-xs text-slate-500 mt-2 mb-6">Instructor: Prof. Sarah Jenkins</p>
                     
                     <div className="space-y-4">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
                           <span>Progress</span>
                           <span>{75 - (i * 10)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full" style={{ width: `${75 - (i * 10)}%` }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                           <button className="py-2 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-all">Materials</button>
                           <button className="py-2 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-all">Assignments</button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-6">Class Timetable</h3>
                <div className="overflow-x-auto custom-scrollbar">
                   <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          <th className="py-4 font-bold uppercase tracking-widest text-[10px]">Time</th>
                          <th className="py-4 font-bold uppercase tracking-widest text-[10px]">Mon</th>
                          <th className="py-4 font-bold uppercase tracking-widest text-[10px]">Tue</th>
                          <th className="py-4 font-bold uppercase tracking-widest text-[10px]">Wed</th>
                          <th className="py-4 font-bold uppercase tracking-widest text-[10px]">Thu</th>
                          <th className="py-4 font-bold uppercase tracking-widest text-[10px]">Fri</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-slate-800/50">
                          <td className="py-6 font-bold text-blue-400">09:00 - 10:30</td>
                          <td className="py-6">Algorithms</td>
                          <td className="py-6">Cloud Comp</td>
                          <td className="py-6">Algorithms</td>
                          <td className="py-6">Cloud Comp</td>
                          <td className="py-6 text-slate-600">Off</td>
                        </tr>
                        <tr className="border-b border-slate-800/50">
                          <td className="py-6 font-bold text-blue-400">11:00 - 12:30</td>
                          <td className="py-6">ML Found.</td>
                          <td className="py-6">ML Found.</td>
                          <td className="py-6">ML Found.</td>
                          <td className="py-6">ML Found.</td>
                          <td className="py-6">Lab (ML)</td>
                        </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        );

      case 'exams':
        return (
          <div className="space-y-6 animate-slide max-w-4xl mx-auto">
             <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-10">
                   <div>
                      <h3 className="text-2xl font-black text-white">Semester Results</h3>
                      <p className="text-slate-500 text-sm">Spring Semester 2024-2025</p>
                   </div>
                   <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                      Download Grade Card (PDF)
                   </button>
                </div>
                <div className="space-y-2">
                   {[
                     { name: 'Data Structures', grade: 'A+', credits: 4, marks: 94 },
                     { name: 'Operating Systems', grade: 'A', credits: 4, marks: 88 },
                     { name: 'Discrete Maths', grade: 'B+', credits: 3, marks: 76 },
                     { name: 'Computer Networks', grade: 'A+', credits: 4, marks: 91 }
                   ].map((r, i) => (
                     <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-800/30 rounded-xl transition-all border border-transparent hover:border-slate-800">
                        <div className="flex gap-4 items-center">
                           <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-blue-500">{r.grade}</div>
                           <div>
                              <p className="text-sm font-bold text-white">{r.name}</p>
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{r.credits} Credits</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-slate-200">{r.marks}/100</p>
                           <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Pass</p>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center">
                   <div className="flex gap-8">
                      <div>
                         <p className="text-xs text-slate-500 font-bold uppercase mb-1">Semester GPA</p>
                         <p className="text-2xl font-black text-blue-400">3.82</p>
                      </div>
                      <div>
                         <p className="text-xs text-slate-500 font-bold uppercase mb-1">Overall CGPA</p>
                         <p className="text-2xl font-black text-emerald-400">3.75</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">Request Revaluation</button>
                      <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">Apply for Honors</button>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-6 animate-slide max-w-5xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 p-8 rounded-3xl shadow-xl">
                   <h3 className="text-xl font-bold text-white mb-8">Financial Overview</h3>
                   <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 flex justify-between items-center">
                         <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Semester Fee</p>
                            <p className="text-3xl font-black text-white mt-1">$12,450.00</p>
                         </div>
                         <div className="text-right">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Fully Paid</span>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Scholarship Grant</p>
                            <p className="text-lg font-black text-blue-400">-$2,500.00</p>
                         </div>
                         <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Library Fines</p>
                            <p className="text-lg font-black text-red-400">$0.00</p>
                         </div>
                      </div>
                   </div>
                   <div className="mt-10">
                      <h4 className="text-sm font-bold text-slate-300 mb-4">Payment History</h4>
                      <div className="space-y-2">
                         {[
                           { desc: 'Tuition Fee - Sem 4', date: 'May 12, 2024', amt: '$9,950.00' },
                           { desc: 'Library Subscription', date: 'Apr 05, 2024', amt: '$250.00' },
                           { desc: 'Lab Maintenance Fee', date: 'Mar 28, 2024', amt: '$150.00' }
                         ].map((p, i) => (
                           <div key={i} className="flex justify-between items-center p-3 text-xs hover:bg-slate-800/30 rounded-lg group">
                              <div>
                                 <p className="font-bold text-slate-200">{p.desc}</p>
                                 <p className="text-slate-500 text-[10px]">{p.date}</p>
                              </div>
                              <div className="flex gap-4 items-center">
                                 <p className="font-bold text-slate-200">{p.amt}</p>
                                 <button className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">PDF</button>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
                      <h4 className="font-bold text-white mb-4">Secure Payment</h4>
                      <p className="text-xs text-blue-200/60 leading-relaxed mb-6">Quickly settle pending dues or upcoming registration fees using our encrypted gateway.</p>
                      <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/20">Pay Now</button>
                   </div>
                   <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
                      <h4 className="font-bold text-white mb-4">Scholarship Portal</h4>
                      <div className="space-y-4">
                         <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Merit Grant B1</p>
                            <p className="text-sm font-bold text-emerald-400">ACTIVE</p>
                         </div>
                         <button className="w-full py-3 border border-slate-700 hover:border-blue-500 text-slate-400 hover:text-white transition-all rounded-xl text-xs font-bold">Browse Opportunities</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-8 animate-slide max-w-5xl mx-auto">
             <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
                <div className="flex justify-between items-end mb-10">
                   <div>
                      <h3 className="text-2xl font-black text-white">Attendance Analytics</h3>
                      <p className="text-slate-500 text-sm">Last updated: Today, 08:30 AM</p>
                   </div>
                   <div className="text-right">
                      <p className="text-4xl font-black text-blue-500">92.4%</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Aggregate</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                   {[
                     { name: 'Analysis of Algorithms', current: 24, total: 26, color: 'bg-blue-500' },
                     { name: 'Cloud Computing', current: 18, total: 20, color: 'bg-emerald-500' },
                     { name: 'Network Security', current: 15, total: 22, color: 'bg-amber-500' },
                     { name: 'Machine Learning', current: 26, total: 26, color: 'bg-purple-500' }
                   ].map((s, i) => {
                     const perc = Math.round((s.current / s.total) * 100);
                     return (
                       <div key={i} className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                             <span className="font-bold text-slate-200">{s.name}</span>
                             <span className={`font-black ${perc < 75 ? 'text-red-400' : 'text-slate-400'}`}>{perc}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full transition-all duration-1000 ${s.color}`} style={{ width: `${perc}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                             <span>{s.current} / {s.total} Sessions</span>
                             {perc < 75 && <span className="text-red-500 animate-pulse">Low Attendance Alert</span>}
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>
             <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
                <h4 className="font-bold text-white mb-4">Attendance History</h4>
                <div className="flex gap-2">
                   {Array.from({length: 30}).map((_, i) => (
                     <div key={i} title={`Day ${i+1}`} className={`w-3 h-3 rounded-sm ${Math.random() > 0.1 ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}></div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'docs':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide">
             {[
               { name: 'Digital ID Card', desc: 'Secure blockchain-verified ID', icon: '🆔', active: true },
               { name: 'Bonafide Certificate', desc: 'Official student status proof', icon: '📄', active: false },
               { name: 'Official Transcript', desc: 'Semester-wise academic record', icon: '📝', active: false },
               { name: 'Exam Hall Ticket', desc: 'Sem 4 - Spring 2025', icon: '🎫', active: true },
               { name: 'Fee Receipts', desc: 'All financial transaction logs', icon: '🧾', active: true },
               { name: 'Scholarship Letter', desc: 'Eligibility & approval docs', icon: '🎓', active: false }
             ].map((doc, i) => (
               <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                     <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{doc.icon}</div>
                     <button className={`p-2 rounded-lg transition-all ${doc.active ? 'text-blue-400 hover:bg-blue-500/10' : 'text-slate-600'}`}>
                        📥
                     </button>
                  </div>
                  <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{doc.name}</h4>
                  <p className="text-xs text-slate-500 mt-2">{doc.desc}</p>
                  <div className="mt-6 flex justify-between items-center">
                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${doc.active ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-slate-500'}`}>
                        {doc.active ? 'AVAILABLE' : 'PENDING'}
                     </span>
                     <span className="text-[10px] text-slate-600 font-mono tracking-tighter">REF_ID: 9021-X{i}</span>
                  </div>
               </div>
             ))}
          </div>
        );

      case 'faculty':
        return (
          <div className="space-y-8 animate-slide">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Dr. Sarah Jenkins', role: 'Head of AI Dept.', sub: 'Machine Learning Foundations', office: 'Cabin 402' },
                  { name: 'Prof. David Miller', role: 'Senior Lecturer', sub: 'Cloud Computing Architecture', office: 'Cabin 312' },
                  { name: 'Dr. Michael Cho', role: 'Research Lead', sub: 'Network Security', office: 'Lab 02' },
                  { name: 'Emma Watson', role: 'Teaching Asst.', sub: 'Design & Analysis of Algorithms', office: 'Shared Space B' }
                ].map((f, i) => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center gap-6">
                     <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/20 rounded-2xl flex items-center justify-center text-2xl">
                        {['👩‍🏫', '👨‍🏫', '👨‍💻', '👩‍💻'][i]}
                     </div>
                     <div className="flex-grow">
                        <div className="flex justify-between items-start">
                           <div>
                              <h4 className="font-bold text-white">{f.name}</h4>
                              <p className="text-xs text-blue-500 font-bold uppercase tracking-tighter">{f.role}</p>
                           </div>
                           <button className="text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest">Message</button>
                        </div>
                        <div className="mt-4 flex gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                           <span>{f.sub}</span>
                           <span>•</span>
                           <span>{f.office}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
                <h4 className="font-bold text-white mb-6">Doubt Requests / Appointments</h4>
                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl flex justify-between items-center">
                   <p className="text-sm text-slate-400 italic">No pending requests. Use the faculty directory to schedule office hours.</p>
                   <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-500 transition-all">Schedule New</button>
                </div>
             </div>
          </div>
        );

      case 'campus':
        return (
          <div className="space-y-8 animate-slide">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { tag: 'Clubs', name: 'Robotics & Automation Society', img: '🤖', join: 'Active' },
                  { tag: 'Sports', name: 'Elite Basketball Team', img: '🏀', join: 'Open' },
                  { tag: 'Cultural', name: 'Symphony Music Band', img: '🎸', join: 'Auditions' },
                  { tag: 'Volunteer', name: 'Green Campus Initiative', img: '🌱', join: 'Active' },
                  { tag: 'Hackathon', name: 'CyberSec CTF 2024', img: '🚩', join: 'Registration' },
                  { tag: 'Workshop', name: 'Quantum Computing Intro', img: '⚛️', join: 'Nov 12' }
                ].map((c, i) => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all group">
                     <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-4xl grayscale group-hover:grayscale-0 transition-all">{c.img}</div>
                     <div className="p-6">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{c.tag}</p>
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{c.name}</h4>
                        <div className="mt-6 flex justify-between items-center">
                           <span className="text-xs text-slate-500 font-bold tracking-tighter uppercase">{c.join}</span>
                           <button className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors underline underline-offset-4 decoration-slate-700">Details</button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'career':
        return (
          <div className="space-y-8 animate-slide max-w-5xl mx-auto">
             <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-3xl flex justify-between items-center">
                <div>
                   <h3 className="text-2xl font-black text-white mb-2">Placement Portal</h3>
                   <p className="text-blue-200/60 text-sm max-w-md">Your resume is currently up to date. 12 new internship opportunities match your profile.</p>
                </div>
                <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">Apply Now</button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
                   <h4 className="font-bold text-white mb-6">Skill Certifications</h4>
                   <div className="space-y-4">
                      {[
                        { name: 'Google Cloud: Data Engineer', status: 'Completed', date: 'Aug 2024' },
                        { name: 'IBM: Quantum Practitioner', status: 'In Progress', date: 'Exp Nov 2024' }
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                           <p className="text-sm font-bold text-slate-200">{s.name}</p>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${s.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{s.status}</span>
                        </div>
                      ))}
                      <button className="w-full py-3 border border-dashed border-slate-700 text-slate-500 text-[10px] font-black hover:border-blue-500 hover:text-blue-500 transition-all uppercase tracking-widest mt-2">+ Add New Certification</button>
                   </div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
                   <h4 className="font-bold text-white mb-6">Job Applications</h4>
                   <div className="space-y-4">
                      {[
                        { co: 'NVIDIA', role: 'DL Intern', status: 'Under Review' },
                        { co: 'SpaceX', role: 'Software Eng 1', status: 'Final Round' }
                      ].map((j, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                           <div>
                              <p className="text-sm font-bold text-slate-200">{j.co}</p>
                              <p className="text-[10px] text-slate-500 font-bold">{j.role}</p>
                           </div>
                           <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{j.status}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-3xl mx-auto space-y-6 animate-slide">
             <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-8">Personalization & Security</h3>
                <div className="space-y-8">
                   <div className="flex justify-between items-center p-4 hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer">
                      <div>
                         <p className="font-bold text-slate-200">Dark Mode</p>
                         <p className="text-xs text-slate-500">Enable forced OLED dark theme</p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                   </div>
                   <div className="flex justify-between items-center p-4 hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer">
                      <div>
                         <p className="font-bold text-slate-200">Multi-Factor Auth</p>
                         <p className="text-xs text-slate-500">Institutional app verification required</p>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">ENABLED</span>
                   </div>
                   <div className="flex justify-between items-center p-4 hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer">
                      <div>
                         <p className="font-bold text-slate-200">Language Selection</p>
                         <p className="text-xs text-slate-500">English (Academic US)</p>
                      </div>
                      <span className="text-lg">🌐</span>
                   </div>
                   <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all border border-slate-700">Update Profile Details</button>
                   <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all border border-slate-700">Change Authentication Passcode</button>
                </div>
             </div>
          </div>
        );

      case 'support':
        return (
          <div className="max-w-2xl mx-auto space-y-6 animate-slide">
             <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-3xl text-center shadow-2xl">
                <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 animate-pulse">
                   🎧
                </div>
                <h3 className="text-3xl font-black text-white mb-4">University Help Desk</h3>
                <p className="text-slate-400 mb-10 leading-relaxed">Connected to high-priority institutional support nodes. Real-time response average: 8 mins.</p>
                <div className="grid grid-cols-2 gap-4">
                   <button className="p-8 rounded-2xl border border-slate-800 hover:border-blue-500 bg-slate-950/40 transition-all group">
                      <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">🎫</div>
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors">Raise Ticket</p>
                      <p className="text-[10px] text-slate-600 mt-2 font-black uppercase tracking-widest">Institutional Portal</p>
                   </button>
                   <button className="p-8 rounded-2xl border border-slate-800 hover:border-emerald-500 bg-slate-950/40 transition-all group">
                      <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">📞</div>
                      <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">Emergency Call</p>
                      <p className="text-[10px] text-slate-600 mt-2 font-black uppercase tracking-widest">24/7 Helpline</p>
                   </button>
                </div>
                <div className="mt-12 space-y-4">
                   <button className="w-full py-4 bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all rounded-xl font-bold text-xs uppercase tracking-widest">Frequently Asked Questions</button>
                   <button 
                     onClick={onLogout}
                     className="w-full py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-500/5"
                   >
                     Terminate Session & Logout
                   </button>
                </div>
             </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 animate-slide">
             <div className="text-7xl mb-6 grayscale opacity-40">⚙️</div>
             <p className="text-2xl font-black text-slate-400 tracking-tighter">NODE_SYNCHRONIZING</p>
             <p className="text-sm mt-2 opacity-60">The {SECTIONS.find(s => s.id === activeTab)?.label} module is undergoing periodic state recalibration.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800 flex flex-col fixed h-full z-50">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 uni-gradient rounded-xl flex items-center justify-center font-bold shadow-xl shadow-blue-500/20 text-white text-lg">U</div>
            <h1 className="text-xl font-black text-white italic tracking-tighter">UNIPORTAL</h1>
          </div>
        </div>
        
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {SECTIONS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className={`text-xl transition-all duration-500 ${activeTab === tab.id ? 'scale-110 rotate-[-5deg]' : 'group-hover:scale-125'}`}>
                {tab.icon}
              </span>
              <span className={`text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                {tab.label.split(' / ')[0]}
              </span>
              {activeTab === tab.id && (
                <div className="ml-auto w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-800 bg-slate-950/40">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 font-black text-xl shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-white truncate tracking-tight">{user.name}</p>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">{user.role}</p>
                </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow ml-72 flex flex-col min-h-screen">
        <header className="h-20 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800 flex items-center justify-between px-10 sticky top-0 z-40">
           <div className="flex items-center gap-5">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] opacity-80">{SECTIONS.find(s => s.id === activeTab)?.label}</h2>
              <span className="h-4 w-[1px] bg-slate-800"></span>
              <span className="text-[10px] text-slate-600 font-mono font-black opacity-50">NODE_ID::{user.id}</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="relative group hidden xl:block">
                 <input 
                   type="text" 
                   placeholder="SEARCH GATEWAY..." 
                   className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black text-slate-400 w-56 focus:w-80 transition-all focus:border-blue-500 focus:bg-slate-950 outline-none uppercase tracking-widest placeholder:text-slate-700" 
                 />
                 <span className="absolute left-3.5 top-2.5 text-slate-700 pointer-events-none group-focus-within:text-blue-500 transition-colors">🔍</span>
              </div>
              
              <div className="flex items-center gap-3">
                 <button className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all relative group">
                    <span className="text-xl group-hover:scale-110 transition-transform">🔔</span>
                    <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
                 </button>
                 <button onClick={onLogout} className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all group">
                    <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
                 </button>
              </div>
           </div>
        </header>

        <div className="p-12 max-w-7xl">
           {renderContent()}
        </div>
        
        <footer className="mt-auto p-10 border-t border-slate-900/50 flex justify-between items-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">
           <span>&copy; 2024 UNIPORTAL ENCRYPTED ACCESS NODE</span>
           <span>STATION_ID: {Math.floor(Math.random() * 10000)}</span>
        </footer>
      </main>
    </div>
  );
};
