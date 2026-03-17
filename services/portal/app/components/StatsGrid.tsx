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
      label: 'Volume', 
      value: stats?.total_users || '0', 
      icon: Users, 
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
      sub: 'Total Registered'
    },
    { 
      label: 'Gross Revenue', 
      value: `$${stats?.total_revenue || '0.00'}`, 
      icon: CreditCard, 
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
      sub: 'Settled Payments'
    },
    { 
      label: 'AI Burn', 
      value: `$${stats?.estimated_cost?.toFixed(2) || '0.00'}`, 
      icon: DollarSign, 
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10',
      sub: 'Infrastructure Cost'
    },
    { 
      label: 'Profit Margin', 
      value: `${stats?.gross_margin || '0'}%`, 
      icon: Activity, 
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
      sub: 'Profitability Ratio'
    },
    { 
      label: 'AI Velocity', 
      value: stats?.total_queries || '0', 
      icon: MessageSquare, 
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10',
      sub: 'Voice Tasks'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            {i === 1 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3" /> 12%
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums tracking-tight">
              {loading ? <span className="animate-pulse">...</span> : stat.value}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

