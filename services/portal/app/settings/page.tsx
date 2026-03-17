"use client";

import React from 'react';
import ConfigPanel from '../components/ConfigPanel';
import { useDashboard } from '../context/DashboardContext';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const { configs, updateConfig } = useDashboard();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-900 dark:bg-slate-700 rounded-2xl shadow-xl">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">System Architecture</h1>
           <p className="text-slate-500 font-medium italic mt-1">Global dynamic configuration and security tokens.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <ConfigPanel configs={configs || []} onUpdate={updateConfig} />
         
         <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-full mb-6">
               <Settings className="w-12 h-12 text-indigo-500 animate-spin-slow" />
            </div>
            <h4 className="text-xl font-bold">Dynamic Engine</h4>
            <p className="text-slate-500 max-w-sm mt-4">These parameters control the AI orchestration layer in real-time. Changes are applied instantly across the entire network cluster.</p>
         </div>
      </div>
    </div>
  );
}
