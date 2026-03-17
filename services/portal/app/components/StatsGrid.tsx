"use client";

import React from 'react';
import { Users, CreditCard, MessageSquare, Zap, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface StatsGridProps {
  stats: any;
  loading: boolean;
}

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  const statCards = [
    { 
      label: 'Volume (Users)', 
      value: stats?.total_users || '0', 
      icon: Users, 
      color: 'from-blue-500 to-indigo-600',
      sub: 'Total Registered'
    },
    { 
      label: 'Gross Revenue', 
      value: `$${stats?.total_revenue || '0.00'}`, 
      icon: CreditCard, 
      color: 'from-emerald-500 to-teal-600',
      sub: 'Settled Payments'
    },
    { 
      label: 'AI Burn (Cost)', 
      value: `$${stats?.estimated_cost?.toFixed(2) || '0.00'}`, 
      icon: DollarSign, 
      color: 'from-red-500 to-rose-600',
      sub: 'Infrastructure Cost'
    },
    { 
      label: 'Current Margin', 
      value: `${stats?.gross_margin || '0'}%`, 
      icon: Activity, 
      color: 'from-amber-400 to-orange-600',
      sub: 'Profitability Ratio'
    },
    { 
      label: 'AI Velocity', 
      value: stats?.total_queries || '0', 
      icon: MessageSquare, 
      color: 'from-violet-500 to-purple-600',
      sub: 'Total Voice Tasks'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {statCards.map((stat, i) => (
        <div key={i} className="group relative bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/60 hover:border-indigo-500/50 transition-all duration-500 shadow-lg hover:shadow-indigo-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
          <div className="relative flex justify-between items-start">
            <div className={`bg-gradient-to-br ${stat.color} p-2.5 rounded-xl shadow-lg ring-4 ring-slate-900/50`}>
              <stat.icon className="text-white w-5 h-5" />
            </div>
            <div className="px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
            </div>
          </div>
          <div className="relative mt-5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-white mt-1 tabular-nums tracking-tighter">
              {loading ? '---' : stat.value}
            </h3>
            <p className="text-[9px] text-slate-600 font-bold uppercase mt-1 tracking-tighter">{stat.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
