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
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800/60 shadow-2xl overflow-hidden mt-10">
      <div className="px-10 py-8 bg-slate-900/40 border-b border-slate-800/60 flex justify-between items-center whitespace-nowrap overflow-x-auto gap-10">
        <div className="flex items-center gap-10">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-3">
               <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              User Ecosystem
            </h3>
            <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Customer segments & engagement profiles</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-800/40 p-1 rounded-xl border border-slate-700/50">
            <button 
              onClick={() => setAdjustValue(prev => Math.max(1, prev - 1))}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-white px-2">± {adjustValue} Credits</span>
            <button 
               onClick={() => setAdjustValue(prev => prev + 1)}
               className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          onClick={() => exportToCSV(users, 'user_database')}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700"
        >
          <FileText className="w-4 h-4" />
          Export Users
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/20 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <th className="px-10 py-5">Identities</th>
              <th className="px-6 py-5">Sub Context</th>
              <th className="px-6 py-5 text-center">Fuel Balance</th>
              <th className="px-6 py-5">Lingua</th>
              <th className="px-10 py-5 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {users.map((user, i) => (
              <tr key={i} className="group hover:bg-slate-800/10 transition-colors">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-500 group-hover:border-indigo-500/50 transition-colors">
                      {user.name?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{user.name || 'Incognito User'}</p>
                      <p className="text-[10px] text-slate-500 font-medium font-mono lowercase">ID: {user.id.substring(0, 13)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    user.plan_name === 'premium' 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-lg shadow-purple-500/10' 
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {user.plan_name || 'free tier'}
                  </span>
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-mono font-black text-white">{user.credit_balance}</span>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Left</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase">
                    <Languages className="w-3 h-3" />
                    {user.language === 'km' ? 'Khmer' : 'English'}
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onAdjustCredits?.(user.id, adjustValue)}
                      className="px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl border border-indigo-500/20 transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                      Refuel
                    </button>
                    <button 
                      onClick={() => onAdjustCredits?.(user.id, -adjustValue)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 transition-all font-black text-[10px] uppercase tracking-widest"
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
