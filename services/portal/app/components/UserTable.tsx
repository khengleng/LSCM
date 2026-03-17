"use client";

import React, { useState } from 'react';
import { User, Shield, CreditCard, Languages, Plus, Minus, FileText } from 'lucide-react';
import { exportToCSV } from '../utils/export';

interface UserTableProps {
  users: any[];
  onAdjustCredits?: (userId: string, adjustment: number) => void;
}

export default function UserTable({ users, onAdjustCredits }: UserTableProps) {
  const [adjustValue, setAdjustValue] = useState<number>(5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Users
            </h3>
            <p className="text-xs text-slate-500 mt-1">Manage user accounts and credit allocations</p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setAdjustValue(prev => Math.max(1, prev - 1))}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 px-2 min-w-[70px] text-center">{adjustValue} Credits</span>
            <button 
               onClick={() => setAdjustValue(prev => prev + 1)}
               className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          onClick={() => exportToCSV(users, 'user_database')}
          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Export CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="px-8 py-4">User</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Credits</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user, i) => (
              <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {user.name?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{user.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {user.id.substring(0, 10)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                    user.plan_name === 'premium' 
                    ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    {user.plan_name || 'Standard'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{user.credit_balance}</span>
                    <span className="text-[9px] font-medium text-slate-400">total</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 opacity-50" />
                    {user.language === 'km' ? 'Khmer' : 'English'}
                  </div>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onAdjustCredits?.(user.id, adjustValue)}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white rounded-lg transition-all text-[10px] font-bold uppercase"
                    >
                      Refuel
                    </button>
                    <button 
                      onClick={() => onAdjustCredits?.(user.id, -adjustValue)}
                      className="px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-all text-[10px] font-bold uppercase"
                    >
                      Drain
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

