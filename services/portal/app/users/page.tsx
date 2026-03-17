"use client";

import React from 'react';
import UserTable from '../components/UserTable';
import { useDashboard } from '../context/DashboardContext';
import { Users as UsersIcon } from 'lucide-react';

export default function UsersPage() {
  const { filteredUsers, adjustCredits, searchTerm } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-indigo-500/20 group hover:rotate-3 transition-transform">
            <UsersIcon className="w-8 h-8 text-white" />
          </div>
          <div>
             <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">User Intelligence</h1>
             <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] mt-2 border-l-2 border-indigo-500/20 pl-4">Account Integrity // Resource Allocation Plane</p>
          </div>
        </div>

        <div className="flex gap-4">
           {searchTerm && (
             <div className="bg-indigo-50 dark:bg-indigo-500/10 px-6 py-4 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 flex flex-col justify-center">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Active Filter</span>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">"{searchTerm}"</span>
             </div>
           )}
           <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Density</span>
              <span className="text-2xl font-black text-indigo-600 tabular-nums">{filteredUsers?.length || 0} Nodes</span>
           </div>
        </div>
      </div>

      <UserTable users={filteredUsers || []} onAdjustCredits={adjustCredits} />
    </div>
  );
}
