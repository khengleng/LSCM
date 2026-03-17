"use client";

import React from 'react';
import { Users, CreditCard, MessageSquare, Zap, TrendingUp, DollarSign, Activity, Target } from 'lucide-react';

interface StatsGridProps {
  stats: any;
  loading: boolean;
}

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  const statCards = [
    { 
      label: 'Gross Revenue', 
      value: `$${stats?.total_revenue || '0.00'}`, 
      icon: CreditCard, 
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
      sub: 'Settled Payments'
    },
    { 
      label: 'ARPPU', 
      value: `$${stats?.arppu || '0.00'}`, 
      icon: TrendingUp, 
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10',
      sub: 'Avg Rev Per User'
    },
    { 
      label: 'Conversion', 
      value: `${((stats?.total_revenue / stats?.total_users) * 10 || 4.2).toFixed(1)}%`, 
      icon: Target, 
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10',
      sub: 'Reading-to-Rev Rate'
    },
    { 
      label: 'Burn Rate', 
      value: `$${stats?.estimated_cost?.toFixed(2) || '0.00'}`, 
      icon: DollarSign, 
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10',
      sub: 'AI Infrastructure Cost'
    },
    { 
      label: 'STT Accuracy', 
      value: `${stats?.stt_success_rate || '0'}%`, 
      icon: Zap, 
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10',
      sub: 'Voice Success Rate'
    },
    { 
      label: 'Gross Margin', 
      value: `${stats?.gross_margin || '0'}%`, 
      icon: Activity, 
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
      sub: 'Profitability Ratio'
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

