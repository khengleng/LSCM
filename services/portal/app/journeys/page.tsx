"use client";

import React from 'react';
import JourneyTracker from '../components/JourneyTracker';
import { useDashboard } from '../context/DashboardContext';
import { MousePointer2 } from 'lucide-react';

export default function JourneysPage() {
  const { journeys } = useDashboard();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-amber-600 rounded-2xl shadow-xl shadow-amber-500/20">
          <MousePointer2 className="w-6 h-6 text-white" />
        </div>
        <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Customer Journeys</h1>
           <p className="text-slate-500 font-medium italic mt-1">Real-time interaction matrix and voice session tracking.</p>
        </div>
      </div>

      <JourneyTracker journeys={journeys || []} />
    </div>
  );
}
