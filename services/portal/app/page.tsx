"use client";

import React from 'react';
import { useDashboard } from './context/DashboardContext';
import StatsGrid from './components/StatsGrid';
import RevenueChart from './components/RevenueChart';
import { TrendingUp, Activity, Cpu } from 'lucide-react';

export default function OverviewPage() {
  const { stats, revenueData, loading, usageStats } = useDashboard();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Control Center</h1>
        <p className="text-slate-500 font-medium italic">Operational overview of the Lifestyle Machine network.</p>
      </div>

      <StatsGrid stats={stats} loading={loading} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-8">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Real-time Performance
            </h3>
            <div className="h-[350px]">
              {revenueData.length > 0 ? <RevenueChart data={revenueData} /> : (
                <div className="h-full flex items-center justify-center border border-dashed rounded-2xl">
                   <Activity className="w-8 h-8 text-slate-200 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <Cpu className="absolute -bottom-8 -right-8 w-40 h-40 opacity-10 -rotate-12" />
              <h4 className="text-xl font-bold">Orchestrator</h4>
              <p className="text-indigo-100 text-sm mt-1 uppercase tracking-widest font-bold">Status: Online</p>
              
              <div className="mt-12 space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase">Load Capacity</span>
                    <span className="text-2xl font-black tabular-nums">85%</span>
                 </div>
                 <div className="h-2 bg-indigo-400/30 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {usageStats.slice(0, 2).map((u, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{u.event_type} Utilization</span>
                   <p className="text-2xl font-black mt-2 tabular-nums">{u.count}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
