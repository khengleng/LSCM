"use client";

import React from 'react';
import { MousePointer2, Clock, User, ChevronRight } from 'lucide-react';

interface JourneyTrackerProps {
  journeys: any[];
}

export default function JourneyTracker({ journeys }: JourneyTrackerProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-8">
      <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MousePointer2 className="w-5 h-5 text-indigo-500" />
            Customer Journey Trace
          </h3>
          <p className="text-xs text-slate-500 mt-1">Sequential event tracking to audit platform flow and identify drop-off points</p>
        </div>
      </div>
      
      <div className="p-8">
        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-8">
          {journeys.length > 0 ? journeys.map((step, i) => (
            <div key={i} className="relative pl-8 group">
              {/* Timeline Dot */}
              <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 group-hover:border-indigo-500 transition-colors z-10" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{step.user_name || 'Anonymous'}</span>
                      <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 rounded text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide border border-indigo-100 dark:border-indigo-500/20">
                        {String(step.event_type || 'Unknown').replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-medium uppercase">{new Date(step.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 font-sans">
                  {step.metadata && Object.entries(step.metadata).map(([key, value]: [string, any], k) => (
                    <div key={k} className="px-2 py-0.5 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                      <span className="text-slate-400 font-medium mr-1">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center">
               <p className="text-slate-400 text-sm italic font-medium">Awaiting interaction logs...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

