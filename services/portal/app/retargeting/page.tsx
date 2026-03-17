"use client";

import React from 'react';
import RetargetingHub from '../components/RetargetingHub';
import { useDashboard } from '../context/DashboardContext';
import { Target } from 'lucide-react';

export default function RetargetingPage() {
  const { retargetingData, adjustCredits } = useDashboard();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Customer Success Hub</h1>
           <p className="text-slate-500 font-medium italic mt-1">Direct intervention for hot leads and abandoned payments.</p>
        </div>
      </div>

      <RetargetingHub data={retargetingData} onRetarget={adjustCredits} />
    </div>
  );
}
