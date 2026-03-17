"use client";

import React from 'react';
import JourneyTracker from '../components/JourneyTracker';
import { useDashboard } from '../context/DashboardContext';
import { MousePointer2 } from 'lucide-react';

export default function JourneyPage() {
  const { journeys } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-indigo-500/20 group hover:rotate-3 transition-transform">
            <MousePointer2 className="w-8 h-8 text-white" />
          </div>
          <div>
             <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Journey Trace</h1>
             <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] mt-2 border-l-2 border-indigo-500/20 pl-4">Sequential Telemetry // System Event Hub</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Captured Events</span>
           <span className="text-2xl font-black text-indigo-600 tabular-nums">{journeys?.length || 0}</span>
        </div>
      </div>

      <JourneyTracker journeys={journeys} />
      
      <div className="p-10 bg-slate-100 dark:bg-slate-950/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
         <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-lg">
            <MousePointer2 className="w-8 h-8 text-indigo-500" />
         </div>
         <h4 className="text-sm font-black uppercase tracking-widest">End of Telemetry Stream</h4>
         <p className="text-xs text-slate-500 max-w-md font-medium leading-relaxed italic">Currently displaying the last {journeys?.length || 0} high-fidelity interaction nodes. Older traces are archived in the cold-storage audit logs.</p>
      </div>
    </div>
  );
}
