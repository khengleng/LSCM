"use client";

import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import RevenueChart from '../components/RevenueChart';
import TransactionLedger from '../components/TransactionLedger';
import { CreditCard, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';

export default function LedgerPage() {
  const { revenueData, transactions, searchTerm, filteredTransactions } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-600 rounded-[1.5rem] shadow-xl shadow-emerald-500/20 group hover:rotate-3 transition-transform">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
             <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Financial Ledger</h1>
             <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] mt-2 border-l-2 border-emerald-500/20 pl-4">Verified Settlement Matrix // Corporate Audit View</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
           {/* Financial Summary Board */}
           <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-800">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">EBITDA Estimate</p>
                 <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">85%</p>
              </div>
              <div className="px-6 py-4">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Growth Index</p>
                 <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <p className="text-xl font-black text-emerald-600 tabular-nums">+12.4%</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:border-emerald-500/20 transition-all">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xl font-black flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Settlement Velocity
                 </h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">7-Day Aggregated Revenue Stream</p>
              </div>
              <div className="h-2 w-32 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full w-2/3 bg-emerald-500 animate-pulse" />
              </div>
           </div>
           
           <div className="h-[350px]">
              {revenueData.length > 0 ? <RevenueChart data={revenueData} /> : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                   <Activity className="w-10 h-10 text-slate-200 dark:text-slate-800 animate-pulse" />
                </div>
              )}
           </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
           {/* Projection Card */}
           <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20 group">
              <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 transition-transform group-hover:scale-125 duration-500" />
              <h4 className="text-xl font-black tracking-tight">Q1 Forecast</h4>
              <p className="text-emerald-100 text-[10px] mt-1 font-black opacity-80 uppercase tracking-widest">Projection Strength: High</p>
              
              <div className="mt-14 space-y-6">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-[10px] font-black uppercase opacity-60">Target Revenue</span>
                       <span className="text-4xl font-black tabular-nums tracking-tighter animate-in zoom-in-50 duration-500">$12,400</span>
                    </div>
                    <div className="h-2.5 bg-emerald-400/30 rounded-full overflow-hidden backdrop-blur-sm">
                       <div className="h-full w-[65%] bg-white rounded-full shadow-[0_0_20px_white]" />
                    </div>
                 </div>
                 
                 <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Insight Node</p>
                    <p className="text-xs font-bold mt-2 leading-relaxed">Scale-up pattern detected. Current settlement velocity suggests exceeding quarterly target by 14%.</p>
                 </div>
              </div>
           </div>

           {/* Health Card */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
               <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Verification Nodes</h5>
               <div className="space-y-6 opacity-80">
                  <VerificationRow label="KHQR Settlement" check />
                  <VerificationRow label="Card Processor" check />
                  <VerificationRow label="Crypto Gateway" status="Standby" />
               </div>
           </div>
        </div>
      </div>

      <div className="space-y-6 pt-10">
         <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Audit Stream</h3>
            {searchTerm && (
              <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full uppercase">Filtering for "{searchTerm}"</span>
            )}
         </div>
         <TransactionLedger transactions={transactions || []} />
      </div>
    </div>
  );
}

function VerificationRow({ label, check = false, status = "Active" }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
       <div className="flex items-center gap-2">
          {check && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          <span className={`text-[10px] font-black uppercase ${check ? 'text-emerald-500' : 'text-slate-400 opacity-60'}`}>{status}</span>
       </div>
    </div>
  );
}
