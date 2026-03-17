"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  RefreshCcw,
  TrendingUp,
  LayoutDashboard,
  Users as UsersIcon,
  CreditCard as PaymentIcon,
  Cpu,
  ArrowUpRight,
  MousePointer2,
  Target,
  Settings
} from 'lucide-react';
import { useDashboardData, getApiBase } from './hooks/useDashboard';
import StatsGrid from './components/StatsGrid';
import RevenueChart from './components/RevenueChart';
import ConfigPanel from './components/ConfigPanel';
import UserTable from './components/UserTable';
import TransactionLedger from './components/TransactionLedger';
import JourneyTracker from './components/JourneyTracker';
import RetargetingHub from './components/RetargetingHub';

export default function Dashboard() {
  const { 
    stats, 
    configs, 
    transactions, 
    revenueData, 
    users, 
    usageStats, 
    journeys,
    retargetingData,
    loading, 
    updateConfig, 
    adjustCredits,
    refresh 
  } = useDashboardData();

  // Resolve actual runtime API URL after hydration
  const [resolvedApiUrl, setResolvedApiUrl] = useState<string>('');
  useEffect(() => {
    setResolvedApiUrl(getApiBase());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[60] flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-slate-900 dark:bg-indigo-600 rounded-lg shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">Lifestyle Machine</h1>
            <p className="text-[10px] text-slate-500 font-medium">Ops Dashboard v1.0.5</p>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-indigo-500/10 text-slate-900 dark:text-indigo-400 rounded-lg text-sm font-bold transition-all">
            <LayoutDashboard className="w-4 h-4" />
            Control Center
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-all">
            <UsersIcon className="w-4 h-4" />
            User Management
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-all">
            <Target className="w-4 h-4" />
            Retargeting Hub
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-all">
            <PaymentIcon className="w-4 h-4" />
            Financial Ledger
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-all">
            <MousePointer2 className="w-4 h-4" />
            Journey Trace
          </button>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>System Health</span>
              <span className="text-emerald-500">Stable</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-indigo-500 rounded-full" />
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">Orchestrator at 85% capacity</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Live Services</span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 truncate max-w-[200px] lg:max-w-none">
              API: {resolvedApiUrl || 'Resolving...'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={refresh}
              className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-all border border-slate-200 dark:border-slate-800 ${loading ? 'animate-spin' : ''}`}
              title="Refresh Data"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                const url = prompt('Enter your Gateway URL:', localStorage.getItem('LSCM_API_OVERRIDE') || '');
                if (url !== null) {
                  if (url.trim() === '') localStorage.removeItem('LSCM_API_OVERRIDE');
                  else localStorage.setItem('LSCM_API_OVERRIDE', url.trim());
                  
                  const token = prompt('Enter Admin Access Token:', localStorage.getItem('LSCM_ADMIN_TOKEN_OVERRIDE') || '');
                  if (token !== null) {
                    if (token.trim() === '') localStorage.removeItem('LSCM_ADMIN_TOKEN_OVERRIDE');
                    else localStorage.setItem('LSCM_ADMIN_TOKEN_OVERRIDE', token.trim());
                  }
                  window.location.reload();
                }
              }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-all border border-slate-200 dark:border-slate-800"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-slate-900 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-950">
              AD
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Lifestyle Control Center</h2>
            <p className="text-slate-500 mt-1">Operational oversight for voice-first lifestyle engagement engines.</p>
          </div>

          {/* Stats Section */}
          <StatsGrid stats={stats} loading={loading} />

          {/* Performance & Configuration Zone */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                       <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Financial Performance
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Gross revenue trends and settlement velocity</p>
                  </div>
                </div>
                
                <div className="h-[350px] w-full">
                  {Array.isArray(revenueData) && revenueData.length > 0 ? (
                    <RevenueChart data={revenueData} />
                  ) : (
                    <div className="h-full w-full bg-slate-50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center">
                      <Activity className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2 animate-pulse" />
                      <p className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">Waiting for data stream...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {Array.isArray(usageStats) && usageStats.slice(0, 3).map((u, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{u.event_type.replace(/_/g, ' ')} Utilization</span>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{u.count}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        <Activity className="w-3 h-3" /> Live
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <ConfigPanel configs={Array.isArray(configs) ? configs : []} onUpdate={updateConfig} />
              
              <div className="bg-slate-900 dark:bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm group border border-slate-800">
                <Cpu className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 -rotate-12 transition-transform group-hover:scale-110 duration-500" />
                <h4 className="text-lg font-bold">Orchestration Health</h4>
                <p className="text-slate-400 text-xs mt-1">System Load Node: ACTIVE</p>
                
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span>Throughput Capacity</span>
                    <span>85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-indigo-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth & Success Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
             <div className="flex items-center gap-2">
               <Target className="w-5 h-5 text-indigo-500" />
               <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none uppercase text-[12px] tracking-widest text-slate-400">Section 01: Customer Success Hub</h3>
             </div>
             <RetargetingHub data={retargetingData} onRetarget={adjustCredits} />
          </div>

          {/* Business Operations Audit Zone */}
          <div className="space-y-12 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
               <Activity className="w-5 h-5 text-indigo-500" />
               <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none uppercase text-[12px] tracking-widest text-slate-400">Section 02: Operations Ledger & Audit</h3>
             </div>
            
            <div className="space-y-12">
              <UserTable users={Array.isArray(users) ? users : []} onAdjustCredits={adjustCredits} />
              <TransactionLedger transactions={Array.isArray(transactions) ? transactions : []} />
              <JourneyTracker journeys={Array.isArray(journeys) ? journeys : []} />
            </div>
          </div>
        </main>

        <footer className="mt-20 px-8 py-8 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-600 flex justify-between uppercase tracking-widest">
          <p>© 2026 LIFESTYLE MACHINE OPERATIONS</p>
          <div className="flex gap-8">
            <span className="hover:text-indigo-500 transition-colors cursor-pointer">Security Protocol</span>
            <span className="hover:text-indigo-500 transition-colors cursor-pointer">Export Data</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
