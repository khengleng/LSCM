"use client";

import React from 'react';
import RetargetingHub from '../components/RetargetingHub';
import { useDashboard } from '../context/DashboardContext';
import { Target } from 'lucide-react';

export default function RetargetingPage() {
  const { retargetingData, adjustCredits } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-indigo-500/20 group hover:rotate-3 transition-transform">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
             <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Customer Success Hub</h1>
             <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] mt-2 border-l-2 border-indigo-500/20 pl-4">Conversion Recovery // Engagement Intelligence</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Leads</span>
           <span className="text-2xl font-black text-indigo-600 tabular-nums">{(retargetingData?.hot_leads?.length || 0) + (retargetingData?.abandoned_payments?.length || 0)}</span>
        </div>
      </div>

      <RetargetingHub data={retargetingData} onRetarget={adjustCredits} />
      
      <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10"><Target className="w-40 h-40" /></div>
         <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-black tracking-tighter uppercase">Automated Campaign Engine</h3>
            <p className="text-indigo-200 text-sm mt-2 leading-relaxed font-bold">The system is currently monitoring real-time WebSocket signals for session abandonment. Active recovery tokens are ready for manual deployment.</p>
            <div className="mt-8 flex gap-4">
               <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">Enable Auto-Pilot</button>
               <button className="px-6 py-3 bg-transparent border border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Configure Rule-sets</button>
            </div>
         </div>
      </div>
    </div>
  );
}
