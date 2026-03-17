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
import { exportToCSV } from './utils/export';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState('center');

  useEffect(() => {
    setResolvedApiUrl(getApiBase());
  }, []);

  const scrollTo = (id: string, segment: string) => {
    setActiveSegment(segment);
    setIsMobileMenuOpen(false);
    
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Sidebar - Desktop */}
      <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[70] flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('top', 'center')}>
          <div className="p-2 bg-slate-900 dark:bg-indigo-600 rounded-lg shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">Lifestyle Machine</h1>
            <p className="text-[10px] text-slate-500 font-medium">Ops Dashboard v1.0.7</p>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          <SidebarButton 
            active={activeSegment === 'center'} 
            onClick={() => scrollTo('top', 'center')} 
            icon={LayoutDashboard} 
            label="Control Center" 
          />
          <SidebarButton 
            active={activeSegment === 'users'} 
            onClick={() => scrollTo('section-users', 'users')} 
            icon={UsersIcon} 
            label="User Management" 
          />
          <SidebarButton 
            active={activeSegment === 'hot'} 
            onClick={() => scrollTo('section-hot-leads', 'hot')} 
            icon={Target} 
            label="Retargeting Hub" 
          />
          <SidebarButton 
            active={activeSegment === 'ledger'} 
            onClick={() => scrollTo('section-ledger', 'ledger')} 
            icon={PaymentIcon} 
            label="Financial Ledger" 
          />
          <SidebarButton 
            active={activeSegment === 'journeys'} 
            onClick={() => scrollTo('section-journeys', 'journeys')} 
            icon={MousePointer2} 
            label="Journey Trace" 
          />
          <SidebarButton 
            active={activeSegment === 'config'} 
            onClick={() => scrollTo('section-config', 'config')} 
            icon={Settings} 
            label="System Config" 
          />
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
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white dark:bg-slate-900 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-sm uppercase">LSCM Ops</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">✕</button>
            </div>
            <div className="p-4 space-y-1">
              <SidebarButton active={activeSegment === 'center'} onClick={() => scrollTo('top', 'center')} icon={LayoutDashboard} label="Control Center" />
              <SidebarButton active={activeSegment === 'users'} onClick={() => scrollTo('section-users', 'users')} icon={UsersIcon} label="Users" />
              <SidebarButton active={activeSegment === 'hot'} onClick={() => scrollTo('section-hot-leads', 'hot')} icon={Target} label="Retargeting" />
              <SidebarButton active={activeSegment === 'config'} onClick={() => scrollTo('section-config', 'config')} icon={Settings} label="Config" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Live Node</span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[140px] lg:max-w-none bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded">
               {resolvedApiUrl.replace('https://', '') || 'Resolving Endpoint...'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <HeaderAction icon={RefreshCcw} title="Refresh" onClick={refresh} loading={loading} />
            <HeaderAction icon={Settings} title="Settings" onClick={() => {
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
            }} />
            <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-500/20 shadow-lg">
              AD
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          <div id="top" className="scroll-mt-32">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Lifestyle Control Center</h2>
            <p className="text-slate-500 mt-1 font-medium italic">Operational oversight for voice-first AI engagement engines.</p>
          </div>

          <StatsGrid stats={stats} loading={loading} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
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
                      <p className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">Awaiting Data Synchronizer...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.isArray(usageStats) && usageStats.length > 0 ? usageStats.slice(0, 3).map((u, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{String(u?.event_type || 'untracked').replace(/_/g, ' ')} Utilization</span>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{u?.count || 0}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        <Activity className="w-3 h-3" /> Live
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-3 py-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    No Usage Analytics Streamed
                  </div>
                )}
              </div>
            </div>

            <div id="section-config" className="space-y-8 scroll-mt-24">
              <ConfigPanel configs={Array.isArray(configs) ? configs : []} onUpdate={updateConfig} />
              
              <div className="bg-slate-900 dark:bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm group border border-slate-800">
                <Cpu className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 -rotate-12 transition-transform group-hover:scale-110 duration-500" />
                <h4 className="text-lg font-bold">Orchestration Health</h4>
                <p className="text-slate-400 text-xs mt-1 italic uppercase tracking-widest">Status: OPTIMIZED</p>
                
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Throughput Capacity</span>
                    <span className="text-white font-mono">85%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden ring-1 ring-white/5">
                    <div className="h-full w-[85%] bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="section-hot-leads" className="space-y-4 pt-12 border-t border-slate-200 dark:border-slate-800 scroll-mt-24">
             <div className="flex items-center gap-2">
               <Target className="w-5 h-5 text-indigo-500" />
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">01. Customer Success Hub</h3>
             </div>
             <RetargetingHub data={retargetingData} onRetarget={adjustCredits} />
          </div>

          <div className="space-y-12 pt-20 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
               <Activity className="w-5 h-5 text-indigo-500" />
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">02. Operations Ledger & Audit</h3>
             </div>
            
            <div className="space-y-20">
              <div id="section-users" className="scroll-mt-24">
                <UserTable users={Array.isArray(users) ? users : []} onAdjustCredits={adjustCredits} />
              </div>
              <div id="section-ledger" className="scroll-mt-24">
                <TransactionLedger transactions={Array.isArray(transactions) ? transactions : []} />
              </div>
              <div id="section-journeys" className="scroll-mt-24">
                <JourneyTracker journeys={Array.isArray(journeys) ? journeys : []} />
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-20 px-8 py-8 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-600 flex justify-between items-center uppercase tracking-widest">
          <p>© 2026 LIFESTYLE MACHINE GLOBAL OPS</p>
          <div className="flex gap-8">
            <span className="hover:text-indigo-500 transition-colors cursor-pointer hidden sm:block">Security Protocol 7.4</span>
            <span onClick={() => exportToCSV(transactions, 'lscm_full_dump')} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors cursor-pointer shadow-xl">Export Ledger</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SidebarButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
        active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400'}`} />
      {label}
    </button>
  );
}

function HeaderAction({ icon: Icon, title, onClick, loading }: { icon: any, title: string, onClick: () => void, loading?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 rounded-xl transition-all border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 shadow-sm ${loading ? 'animate-spin' : ''}`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
