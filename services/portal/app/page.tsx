"use client";

import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  MessageSquare, 
  Activity, 
  Settings as SettingsIcon,
  TrendingUp,
  RefreshCcw,
  Save,
  CheckCircle2,
  Database,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { useDashboardData } from './hooks/useDashboard';

export default function Dashboard() {
  const { stats, configs, transactions, loading, updateConfig, refresh } = useDashboardData();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || '0', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Revenue', value: `$${stats?.total_revenue || '0.00'}`, icon: CreditCard, color: 'from-emerald-500 to-teal-600' },
    { label: 'Voice Queries', value: stats?.total_queries || '0', icon: MessageSquare, color: 'from-violet-500 to-purple-600' },
    { label: 'System Status', value: stats?.active_threshold || 'Live', icon: Zap, color: 'from-amber-400 to-orange-600' },
  ];

  const handleSave = async (key: string) => {
    await updateConfig(key, editValue);
    setEditingKey(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/60 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-md opacity-40 animate-pulse" />
            <div className="relative bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-xl shadow-lg">
              <Activity className="text-white w-6 h-6" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              Lifestyle Control Center
            </h1>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Operations Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Engine Active</span>
          </div>
          <button 
            onClick={refresh}
            className={`p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/50 group ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCcw className="w-5 h-5 group-hover:text-indigo-400" />
          </button>
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/20">
            KH
          </div>
        </div>
      </header>

      <main className="relative z-10 p-8 max-w-7xl mx-auto w-full space-y-10">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Business Intelligence</h2>
            <p className="text-slate-400 mt-2 text-lg">Managing high-conversion AI lifestyle insights across Cambodia.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Last Sync</p>
                <p className="text-sm font-mono text-indigo-400">{new Date().toLocaleTimeString()}</p>
             </div>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <div key={i} className="group relative bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/60 hover:border-indigo-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
              <div className="relative flex justify-between items-start">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-2xl shadow-lg ring-4 ring-slate-900/50`}>
                  <stat.icon className="text-white w-6 h-6" />
                </div>
                <div className="px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                </div>
              </div>
              <div className="relative mt-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-white mt-2 tabular-nums">
                  {loading ? '---' : stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800/60 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                </div>
                Revenue Stream Velocity
              </h3>
              <select className="bg-slate-800 border-none rounded-lg text-xs font-bold px-4 py-2 focus:ring-2 ring-indigo-500">
                <option>Last 30 Days</option>
                <option>All time</option>
              </select>
            </div>
            <div className="h-80 bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent opacity-50" />
              <Activity className="w-16 h-16 mb-4 text-indigo-500/20 animate-pulse" />
              <p className="text-slate-500 font-medium text-sm">Visualizing transactional growth patterns...</p>
            </div>
          </div>

          {/* Real-time Config Panel */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800/60 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <SettingsIcon className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-8 relative">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <SettingsIcon className="w-5 h-5 text-purple-400" />
              </div>
              Engine Tuner
            </h3>
            
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 scrollbar-hide relative">
              {configs.map((cfg) => (
                <div key={cfg.key} className="group bg-slate-800/30 hover:bg-slate-800/60 p-5 rounded-2xl border border-slate-800/50 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cfg.key.replace(/_/g, ' ')}</span>
                    <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 rounded-full text-indigo-400 font-bold border border-indigo-500/20">{cfg.category}</span>
                  </div>
                  
                  {editingKey === cfg.key ? (
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-slate-900 text-sm p-2 rounded-lg border border-indigo-500/50 focus:outline-none focus:ring-2 ring-indigo-500/30 text-white"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => handleSave(cfg.key)} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 shadow-lg shadow-emerald-500/20">
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-indigo-100 truncate max-w-[160px] font-mono">
                        {cfg.value || "---"}
                      </span>
                      <button 
                        onClick={() => { setEditingKey(cfg.key); setEditValue(cfg.value); }}
                        className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all"
                      >
                        Adjust
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-start gap-3">
               <ShieldCheck className="w-5 h-5 text-amber-500/60 flex-shrink-0" />
               <p className="text-[10px] text-amber-500/70 leading-relaxed italic uppercase font-bold tracking-tight">
                 Warning: Changing Model Routing or Limits will affect all active voice sessions instantly.
               </p>
            </div>
          </div>
        </div>

        {/* Global Financial Ledger */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-slate-800/60 shadow-2xl overflow-hidden">
          <div className="px-10 py-8 bg-slate-900/40 flex justify-between items-center border-b border-slate-800/60">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                Omni-platform Financial Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Tracking Bakong, Wing & KHQR Liquidity</p>
            </div>
            <div className="flex gap-4">
               <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700">
                 Download Ledger
               </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">Trace ID</th>
                  <th className="px-10 py-6">Customer / Merchant</th>
                  <th className="px-10 py-6">Volume</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Network Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm">
                {transactions.length > 0 ? transactions.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition-all group">
                    <td className="px-10 py-6 font-mono font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">#{row.id.substring(0,10).toUpperCase()}</td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                            {row.user_name.substring(0,2)}
                         </div>
                         <span className="font-bold text-slate-200">{row.user_name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 font-black text-white tabular-nums">${row.amount}</td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        row.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {row.status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-2 text-slate-500">
                          <Globe className="w-4 h-4 text-slate-600" />
                          <span className="text-xs">{new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center">
                         <Database className="w-12 h-12 text-slate-800 mb-4" />
                         <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Awaiting Transaction Traffic</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800/60 bg-slate-900/60 backdrop-blur-md px-10 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
          <p>© 2026 Lifestyle Machine Platform</p>
          <div className="flex gap-8">
             <span className="hover:text-slate-400 cursor-pointer">Security Protocol</span>
             <span className="hover:text-slate-400 cursor-pointer">API Docs</span>
             <span className="hover:text-slate-400 cursor-pointer">Node Health</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
