"use client";

import React from 'react';
import { Database, CheckCircle2, Globe, FileText } from 'lucide-react';
import { exportToCSV } from '../utils/export';

interface TransactionLedgerProps {
  transactions: any[];
}

export default function TransactionLedger({ transactions }: TransactionLedgerProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-8">
      <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            Transactions
          </h3>
          <p className="text-xs text-slate-500 mt-1">Audit log of all financial activities</p>
        </div>
        <button 
          onClick={() => exportToCSV(transactions, 'transactions_ledger')}
          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Export Ledger
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="px-8 py-4">ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-8 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.length > 0 ? transactions.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                <td className="px-8 py-4 font-mono text-xs text-slate-400">#{row.id?.substring(0,8).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase">
                        {row.user_name?.substring(0,2) || '??'}
                     </div>
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{row.user_name || 'Anonymous'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white tabular-nums">${row.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                    row.status === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
                  }`}>
                    {row.status === 'success' && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {row.status}
                  </span>
                </td>
                <td className="px-8 py-4">
                   <div className="flex items-center gap-2 text-slate-500">
                      <Globe className="w-3.5 h-3.5 opacity-50" />
                      <span className="text-xs">{new Date(row.created_at).toLocaleString()}</span>
                   </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-10 py-16 text-center">
                  <div className="flex flex-col items-center">
                     <Database className="w-10 h-10 text-slate-200 dark:text-slate-800 mb-2" />
                     <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">No transactions found</p>
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

