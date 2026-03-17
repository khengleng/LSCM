"use client";

import React from 'react';
import { MousePointer2, Clock, User, ChevronRight } from 'lucide-react';

interface JourneyTrackerProps {
  journeys: any[];
}

export default function JourneyTracker({ journeys }: JourneyTrackerProps) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800/60 shadow-2xl overflow-hidden mt-10">
      <div className="px-10 py-8 bg-slate-900/40 flex justify-between items-center border-b border-slate-800/60">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <MousePointer2 className="w-5 h-5 text-amber-400" />
            </div>
            Customer Journey Trace
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Real-time behavior & interaction sequence</p>
        </div>
      </div>
      
      <div className="p-10">
        <div className="relative border-l-2 border-slate-800 ml-4 space-y-12">
          {journeys.length > 0 ? journeys.map((step, i) => (
            <div key={i} className="relative pl-10 group">
              {/* Timeline Dot */}
              <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-amber-500 transition-colors z-10" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/20 p-6 rounded-[1.5rem] border border-slate-800/40 hover:border-slate-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{step.user_name || 'Anonymous'}</span>
                      <ChevronRight className="w-3 h-3 text-slate-600" />
                      <span className="px-2 py-0.5 bg-amber-500/10 rounded text-[9px] font-black text-amber-500 uppercase tracking-widest border border-amber-500/20">
                        {step.event_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold font-mono uppercase">{new Date(step.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {step.metadata && Object.entries(step.metadata).map(([key, value]: [string, any], k) => (
                    <div key={k} className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-[10px] font-medium text-slate-400">
                      <span className="text-slate-600 mr-1">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center">
               <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Awaiting User Interactions...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
