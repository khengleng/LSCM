"use client";

import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import RevenueChart from '../components/RevenueChart';
import TransactionLedger from '../components/TransactionLedger';
import { CreditCard, TrendingUp, Activity } from 'lucide-react';

export default function LedgerPage() {
  const { revenueData, transactions } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/20">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Financial Ledger</h1>
           <p className="text-slate-500 font-medium italic mt-1">Settled payments and revenue growth trajectory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-lg font-bold flex items-center gap-2 mb-8">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Settlement Stream
           </h3>
           <div className="h-[250px]">
              {revenueData.length > 0 ? <RevenueChart data={revenueData} /> : (
                <div className="h-full flex items-center justify-center border border-dashed rounded-2xl">
                   <Activity className="w-8 h-8 text-slate-200 animate-pulse" />
                </div>
              )}
           </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-500/5 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-500/10 flex flex-col justify-center">
           <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Growth Node</span>
           <p className="text-4xl font-black mt-2 text-emerald-700 dark:text-emerald-500">+12.4%</p>
           <p className="text-xs text-emerald-600/60 dark:text-emerald-400/60 mt-2 font-bold italic">Settlement velocity since yesterday</p>
        </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-xl font-black uppercase tracking-tighter text-slate-400">Operations Audit</h3>
         <TransactionLedger transactions={transactions || []} />
      </div>
    </div>
  );
}
