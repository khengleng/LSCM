"use client";

import React from 'react';
import { Database, CheckCircle2, Globe, FileText } from 'lucide-react';
import { exportToCSV } from '../utils/export';

interface TransactionLedgerProps {
  transactions: any[];
}

export default function TransactionLedger({ transactions }: TransactionLedgerProps) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-slate-800/60 shadow-2xl overflow-hidden mt-10">
      <div className="px-10 py-8 bg-slate-900/40 flex justify-between items-center border-b border-slate-800/60">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            Platform Financial Ledger
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Tracking Bakong & Wing Liquidity</p>
        </div>
        <button 
          onClick={() => exportToCSV(transactions, 'transactions_ledger')}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700"
        >
          <FileText className="w-4 h-4" />
          Export Ledger
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <th className="px-10 py-6">Trace ID</th>
              <th className="px-10 py-6">Customer</th>
              <th className="px-10 py-6">Volume</th>
              <th className="px-10 py-6">Status</th>
              <th className="px-10 py-6">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {transactions.length > 0 ? transactions.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/20 transition-all group">
                <td className="px-10 py-6 font-mono font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">#{row.id?.substring(0,10).toUpperCase()}</td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                        {row.user_name?.substring(0,2) || '??'}
                     </div>
                     <span className="font-bold text-slate-200">{row.user_name || 'Anonymous'}</span>
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
                      <span className="text-xs">{new Date(row.created_at).toLocaleString()}</span>
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
  );
}
