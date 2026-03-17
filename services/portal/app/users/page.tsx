"use client";

import React from 'react';
import UserTable from '../components/UserTable';
import { useDashboard } from '../context/DashboardContext';
import { Users as UsersIcon } from 'lucide-react';

export default function UsersPage() {
  const { users, adjustCredits } = useDashboard();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20">
          <UsersIcon className="w-6 h-6 text-white" />
        </div>
        <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">User Management</h1>
           <p className="text-slate-500 font-medium italic mt-1">Audit credits, language and engagement status.</p>
        </div>
      </div>

      <UserTable users={users || []} onAdjustCredits={adjustCredits} />
    </div>
  );
}
