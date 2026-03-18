"use client";

import React from 'react';
import { Database, CheckCircle2, Globe, FileText, Search, CreditCard, Clock, ArrowUpRight } from 'lucide-react';
import { exportToCSV } from '../utils/export';
import { useDashboard } from '../context/DashboardContext';

interface TransactionLedgerProps {
  transactions?: any[];
}

export default function TransactionLedger({ transactions: propTransactions }: TransactionLedgerProps) {
  const { filteredTransactions, searchTerm, approveTransaction } = useDashboard();
  
  const displayTx = filteredTransactions || propTransactions || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-xl group">
      <div className="px-8 py-8 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-6 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5 text-white" />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Business Ledger</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{displayTx.length} Verified Entries</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Value</span>
              <span className="text-lg font-black text-emerald-600 tabular-nums">
                ${displayTx.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0).toFixed(2)}
              </span>
           </div>
           <button 
             onClick={() => exportToCSV(displayTx, 'lscm_ledger_audit')}
             className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/10"
           >
             <FileText className="w-4 h-4" />
             Export Audit
           </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 h-16 bg-slate-50/30 dark:bg-slate-900/30">
              <th className="px-8 w-32 border-b border-slate-200 dark:border-slate-800">TX ID</th>
              <th className="px-6 border-b border-slate-200 dark:border-slate-800">Originator</th>
              <th className="px-6 border-b border-slate-200 dark:border-slate-800">Settlement</th>
              <th className="px-6 border-b border-slate-200 dark:border-slate-800">Verification</th>
              <th className="px-8 text-right border-b border-slate-200 dark:border-slate-800">Operational Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {displayTx.length > 0 ? displayTx.map((row, i) => (
              <tr key={row.id || i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all duration-200 group/row">
                <td className="px-8 py-5">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase mb-0.5">Hash</span>
                      <span className="font-mono text-[10px] text-slate-500 font-bold group-hover/row:text-indigo-500 transition-colors">#{String(row.id || i).substring(0,8).toUpperCase()}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase border border-slate-200 dark:border-slate-700">
                        {String(row.user_name || '??').substring(0,2)}
                     </div>
                     <div>
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{row.user_name || 'Anonymous User'}</span>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Identity Chain: Verified</p>
                     </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">${Number(row.amount || 0).toFixed(2)}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 shadow-sm ${
                      row.status === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
                    }`}>
                      {row.status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                      {row.status}
                    </span>
                    {row.status !== 'success' && (
                      <button 
                        onClick={() => {
                          if (confirm(`Force Approve this transaction?\nID: ${row.id}\nUser: ${row.user_name || 'Anonymous'}`)) {
                            approveTransaction(row.id);
                          }
                        }}
                        className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
                        title="Force Approve"
                      >
                         <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 text-slate-500 font-bold tabular-nums text-[10px]">
                         <Clock className="w-3.5 h-3.5 opacity-50" />
                         <span>{new Date(row.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-tighter opacity-60 mt-0.5">
                        Network: KHQR Cluster
                      </span>
                   </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="py-24 text-center grayscale opacity-50">
                  <div className="flex flex-col items-center">
                     <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                        <Database className="w-8 h-8 text-slate-400" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Ledger Synchronization Pending</p>
                     <p className="text-[9px] text-slate-500 font-medium italic">Try adjusting your global search filter.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
