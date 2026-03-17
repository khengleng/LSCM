"use client";

import React from 'react';
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
import { useDashboardData } from './hooks/useDashboard';
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Modern Sidebar */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 bg-slate-900/50 backdrop-blur-3xl border-r border-slate-800/60 z-[60] flex flex-col items-center py-8 gap-10">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
          <Cpu className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col gap-6">
          <button className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20"><LayoutDashboard className="w-5 h-5" /></button>
          <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors"><UsersIcon className="w-5 h-5" /></button>
          <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors"><Target className="w-5 h-5" /></button>
          <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors"><PaymentIcon className="w-5 h-5" /></button>
        </div>
      </nav>

      <div className="pl-20">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/40 border-b border-slate-800/40 px-10 py-5 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-500 tracking-tighter">
              LIFESTYLE MACHINE <span className="text-indigo-500">v1.0.2</span>
            </h1>
            <div className="flex items-center gap-4 mt-0.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Ops Active</span>
              </div>
              <span className="text-[8px] font-mono text-slate-600 border border-slate-800 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                Target: {process.env.NEXT_PUBLIC_API_URL || 'Localhost (Fallback)'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-4">
               <div className="flex flex-col items-end">
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Sync Health</span>
                 <span className="text-xs font-mono text-emerald-400">Stable</span>
               </div>
               <button 
                onClick={refresh}
                className={`p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg transition-all border border-slate-700 ${loading ? 'animate-spin text-indigo-400' : ''}`}
                title="Refresh Data"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  const url = prompt('Enter your Gateway URL (e.g. https://gateway-production.up.railway.app/api/v1):', localStorage.getItem('LSCM_API_OVERRIDE') || '');
                  if (url !== null) {
                    if (url.trim() === '') {
                      localStorage.removeItem('LSCM_API_OVERRIDE');
                    } else {
                      localStorage.setItem('LSCM_API_OVERRIDE', url.trim());
                    }
                    window.location.reload();
                  }
                }}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg transition-all border border-slate-700"
                title="Configure API Gateway"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-xl shadow-indigo-500/20 border border-white/10">
              AD
            </div>
          </div>
        </header>

        <main className="p-10 max-w-[1600px] mx-auto space-y-10">
          {/* Welcome Branding */}
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-white tracking-tighter">Business Console</h2>
              <p className="text-slate-500 font-medium">Monitoring AI delivery, behavior and financial velocity across the ecosystem.</p>
            </div>
          </div>

          {/* Core Metrics */}
          <StatsGrid stats={stats} loading={loading} />

          {/* Intelligence Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Analytics Section */}
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/60 shadow-2xl overflow-hidden group">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                      Revenue Velocity
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Daily Liquidity Accumulation</p>
                  </div>
                </div>
                
                <div className="h-[350px] w-full relative">
                  {revenueData && revenueData.length > 0 ? (
                    <RevenueChart data={revenueData} />
                  ) : (
                    <div className="h-full w-full bg-slate-950/20 border border-slate-800/40 rounded-[2rem] flex flex-col items-center justify-center">
                      <Activity className="w-10 h-10 text-slate-800 mb-3 animate-pulse" />
                      <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Staging Data Stream...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Stats Overlay */}
              <div className="grid grid-cols-3 gap-6">
                {usageStats?.slice(0, 3).map((u, i) => (
                  <div key={i} className="bg-slate-900/30 p-5 rounded-3xl border border-slate-800/50 flex flex-col justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{u.event_type.replace(/_/g, ' ')} Utilization</span>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-2xl font-black text-white">{u.count}</span>
                      <div className="p-1 px-2 bg-emerald-500/10 text-emerald-500 rounded-md text-[8px] font-bold flex items-center gap-1">
                        <ArrowUpRight className="w-2 h-2" /> Live
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Control Center */}
            <div className="space-y-10">
              <ConfigPanel configs={configs} onUpdate={updateConfig} />
              
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                <div className="absolute top-0 right-0 p-10 opacity-10 -rotate-12 translate-x-4">
                  <Cpu className="w-40 h-40" />
                </div>
                <h4 className="text-lg font-black tracking-tight leading-tight">System Health Protocol</h4>
                <p className="text-indigo-100/60 text-xs mt-2 uppercase font-black tracking-widest">Orchestrator Node: ACTIVE</p>
                <div className="mt-8 space-y-2">
                  <div className="h-1 w-full bg-indigo-400/20 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-white rounded-full" />
                  </div>
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-indigo-200/80">
                    <span>Processing Quota</span>
                    <span>85% Capacity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Retargeting Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 ml-2">
               <Target className="w-6 h-6 text-indigo-500" />
               <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Conversion Funnels</h3>
            </div>
            <RetargetingHub data={retargetingData} onRetarget={adjustCredits} />
          </div>

          {/* Behavior Analysis Section */}
          <JourneyTracker journeys={journeys} />

          {/* Management Tables Section */}
          <div className="grid grid-cols-1 gap-10">
            <UserTable users={users} onAdjustCredits={adjustCredits} />
            <TransactionLedger transactions={transactions} />
          </div>
        </main>

        <footer className="mt-20 p-10 border-t border-slate-800/40 bg-slate-900/20 text-[10px] font-black text-slate-600 flex justify-between uppercase tracking-[0.3em]">
          <p>© 2026 LIFESTYLE MACHINE OPERATIONS PORTAL</p>
          <div className="flex gap-10">
            <span className="hover:text-indigo-400 cursor-pointer">Security Protocol</span>
            <span className="hover:text-indigo-400 cursor-pointer">Export Logs</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
