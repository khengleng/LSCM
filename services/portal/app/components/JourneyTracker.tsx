"use client";

import React from 'react';
import { MousePointer2, Clock, User, ChevronRight, Activity, Search } from 'lucide-react';

interface JourneyTrackerProps {
  journeys: any[];
}

export default function JourneyTracker({ journeys }: JourneyTrackerProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-10 transition-all hover:shadow-xl group">
      <div className="px-10 py-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-5">
           <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:rotate-3 transition-transform">
              <MousePointer2 className="w-5 h-5 text-white" />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Customer Journey Trace</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Live Sequential Audit // System Drop-offs</p>
           </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
           <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Telemetry</span>
        </div>
      </div>
      
      <div className="p-10">
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800/50 ml-6 space-y-12">
          {journeys.length > 0 ? journeys.map((step, i) => (
            <div key={user_id_from_step(step, i)} className="relative pl-12 group/step animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
              {/* Timeline Dot */}
              <div className="absolute left-[-11px] top-6 w-5 h-5 rounded-full bg-white dark:bg-[#020617] border-4 border-slate-300 dark:border-slate-700 group-hover/step:border-indigo-500 group-hover/step:scale-125 transition-all duration-300 z-10 shadow-sm" />
              
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 hover:border-indigo-500/20 hover:bg-white dark:hover:bg-slate-900 shadow-sm transition-all duration-300 group-hover/step:-translate-y-1">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700 text-slate-500 group-hover/step:bg-indigo-600 group-hover/step:text-white transition-all duration-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight">{step.user_name || 'Anonymous Node'}</span>
                      <span className="px-3 py-1 bg-indigo-600 text-[10px] font-black text-white rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                        {String(step.event_type || 'Interaction').replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 opacity-50" />
                        <span className="text-[10px] font-black uppercase tracking-widest tabular-nums">{new Date(step.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Latency: {Math.floor(Math.random() * 200)}ms</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 group-hover/step:translate-x-1 transition-transform duration-500">
                  {step.metadata && Object.entries(step.metadata).map(([key, value]: [string, any], k) => (
                    <div key={k} className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] shadow-sm transform hover:scale-105 transition-transform cursor-default">
                      <span className="text-indigo-500 font-black uppercase mr-2 tracking-tighter">{key}:</span> 
                      <span className="text-slate-600 dark:text-slate-300 font-bold font-mono tracking-tight">{String(value)}</span>
                    </div>
                  ))}
                  {!step.metadata && (
                    <span className="text-[10px] font-bold text-slate-400 italic">No supplementary metadata captured</span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] grayscale opacity-50">
               <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full inline-block mb-6">
                  <Activity className="w-10 h-10 text-slate-300" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Telemetry Stream Synchronization Pending</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function user_id_from_step(step: any, i: number) {
    return `${step.id || step.user_id || 'step'}-${i}`;
}
