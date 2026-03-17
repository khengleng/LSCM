"use client";

import React from 'react';
import { Users, CreditCard, MessageSquare, Zap, TrendingUp } from 'lucide-react';

interface StatsGridProps {
  stats: any;
  loading: boolean;
}

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  const statCards = [
    { label: 'Total Users', value: stats?.total_users || '0', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Revenue', value: `$${stats?.total_revenue || '0.00'}`, icon: CreditCard, color: 'from-emerald-500 to-teal-600' },
    { label: 'Voice Queries', value: stats?.total_queries || '0', icon: MessageSquare, color: 'from-violet-500 to-purple-600' },
    { label: 'System Status', value: stats?.active_threshold || 'Live', icon: Zap, color: 'from-amber-400 to-orange-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, i) => (
        <div key={i} className="group relative bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/60 hover:border-indigo-500/50 transition-all duration-500 shadow-lg hover:shadow-indigo-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
          <div className="relative flex justify-between items-start">
            <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-2xl shadow-lg ring-4 ring-slate-900/50`}>
              <stat.icon className="text-white w-6 h-6" />
            </div>
            <div className="px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            </div>
          </div>
          <div className="relative mt-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-white mt-2 tabular-nums">
              {loading ? '---' : stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
