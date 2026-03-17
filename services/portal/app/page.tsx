"use client";

import React from 'react';
import { useDashboard } from './context/DashboardContext';
import StatsGrid from './components/StatsGrid';
import RevenueChart from './components/RevenueChart';
import { TrendingUp, Activity, Cpu, Bell, ExternalLink, Zap } from 'lucide-react';

export default function OverviewPage() {
  const { stats, revenueData, loading, usageStats, events } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-[10px] font-black text-white px-2 py-0.5 rounded-full tracking-widest uppercase">Operational Mode</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Control Center</h1>
          <p className="text-slate-500 font-medium italic mt-1 text-sm tracking-tight border-l-2 border-indigo-500/20 pl-4">Live orchestration telemetry for the global AI engagement cluster.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Scale</span>
              <span className="text-xl font-black text-indigo-600 tabular-nums">1.4x Growth</span>
           </div>
        </div>
      </div>

      <StatsGrid stats={stats} loading={loading} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Main Operational Performance */}
        <div className="xl:col-span-8 space-y-10">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/20 transition-all">
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-xl font-black flex items-center gap-2 tracking-tight">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    Real-time Economic Performance
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Settled Revenue Velocity & AI Consumption</p>
               </div>
               <div className="flex gap-2">
                  <span className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-not-allowed opacity-50"><ExternalLink className="w-4 h-4" /></span>
               </div>
            </div>
            
            <div className="h-[400px]">
              {revenueData.length > 0 ? <RevenueChart data={revenueData} /> : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                   <Activity className="w-10 h-10 text-slate-200 dark:text-slate-800 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl group transition-transform hover:-translate-y-1 duration-500">
                <Cpu className="absolute -bottom-8 -right-8 w-40 h-40 opacity-10 -rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-125 duration-700" />
                <h4 className="text-xl font-black tracking-tight">AI Orchestrator</h4>
                <p className="text-indigo-100 text-xs mt-1 uppercase tracking-widest font-black opacity-70">Cluster Status: Optimizing</p>
                
                <div className="mt-12 space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest">Global Load Capacity</span>
                      <span className="text-3xl font-black tabular-nums">85%</span>
                   </div>
                   <div className="h-2.5 bg-indigo-400/30 rounded-full overflow-hidden backdrop-blur-sm">
                      <div className="h-full w-[85%] bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.7)]" />
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {usageStats.length > 0 ? usageStats.slice(0, 2).map((u, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.event_type} Throughput</span>
                     <div className="flex items-end justify-between mt-4">
                        <p className="text-3xl font-black tabular-nums tracking-tighter">{u.count}</p>
                        <div className="h-6 w-12 bg-emerald-50 dark:bg-emerald-500/10 rounded flex items-center justify-center">
                           <Zap className="w-3 h-3 text-emerald-500" />
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="p-8 border border-dashed rounded-[2rem] flex items-center justify-center text-slate-400 font-black uppercase text-[10px] tracking-widest">Awaiting Pulse...</div>
                )}
             </div>
          </div>
        </div>

        {/* Live Operations Feed Sidebar */}
        <div className="xl:col-span-4 space-y-6">
           <div className="bg-slate-900 dark:bg-slate-900 rounded-[2.5rem] p-8 text-white min-h-[600px] flex flex-col shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20"><Bell className="w-16 h-16" /></div>
              <div className="flex items-center gap-3 mb-10">
                 <div className="p-2 bg-indigo-600 rounded-lg"><Bell className="w-4 h-4" /></div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Live Operations Feed</h4>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                {events.length > 0 ? events.map((event, i) => (
                  <div key={event.id} className="flex gap-4 group animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex flex-col items-center">
                       <div className={`w-3 h-3 rounded-full shrink-0 mt-1 shadow-lg ${
                         event.severity === 'success' ? 'bg-emerald-500' :
                         event.severity === 'warning' ? 'bg-amber-500' :
                         event.severity === 'error' ? 'bg-rose-500' : 'bg-indigo-500'
                       }`} />
                       <div className="w-0.5 flex-1 bg-slate-800 mt-2 mb-2 group-last:hidden" />
                    </div>
                    <div className="flex-1 min-w-0 pb-6 border-b border-slate-800 last:border-none">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex justify-between">
                          <span>{event.type} // {event.id.toUpperCase()}</span>
                          <span className="tabular-nums opacity-60">{new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                       </p>
                       <p className="text-xs font-bold leading-relaxed text-slate-200 group-hover:text-white transition-colors">{event.message}</p>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                     <Activity className="w-12 h-12 animate-pulse" />
                     <p className="text-[10px] font-bold uppercase tracking-widest">Synchronizing Event Stream</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-800">
                 <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Export Log History</button>
              </div>
           </div>

           {/* Health Card */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm">
               <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Network Health Index</h5>
               <div className="space-y-6">
                  <HealthRow label="Payment Gateway" status="Stable" />
                  <HealthRow label="Voice Synthesizer" status="Optimal" />
                  <HealthRow label="LLM Inference" status="High Priority" warning />
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function HealthRow({ label, status, warning = false }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
       <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
         warning ? 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
       }`}>{status}</span>
    </div>
  );
}
