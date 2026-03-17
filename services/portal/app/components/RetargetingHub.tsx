"use client";

import React from 'react';
import { Target, AlertCircle, ShoppingCart, ArrowRight, UserPlus, Zap } from 'lucide-react';

interface RetargetingHubProps {
  data: any;
  onRetarget: (userId: string, amount: number) => void;
}

export default function RetargetingHub({ data, onRetarget }: RetargetingHubProps) {
  const hotLeads = data?.hot_leads || [];
  const abandoned = data?.abandoned_payments || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
      {/* Hot Leads Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group border-l-4 border-l-amber-500">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Stalled Profiles
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Users with high intent but low credit balances</p>
          </div>
          <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-full">
            <UserPlus className="w-4 h-4 text-amber-600 dark:text-amber-500" />
          </div>
        </div>

        <div className="space-y-3">
          {hotLeads.length > 0 ? hotLeads.map((user: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-500/30 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                  {user.name?.substring(0, 2) || '??'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{user.name || 'Anonymous'}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Active {new Date(user.last_seen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded">
                  {user.credit_balance} cr
                </span>
                <button 
                  onClick={() => onRetarget(user.id, 2)}
                  className="px-3 py-1.5 bg-amber-600 dark:bg-amber-600 text-white text-[10px] font-bold rounded-lg hover:bg-amber-700 transition-all uppercase"
                >
                  Gift +2
                </button>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center">
              <p className="text-slate-400 text-xs font-medium italic">No active leads detected at this time</p>
            </div>
          )}
        </div>
      </div>

      {/* Abandoned Cart Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group border-l-4 border-l-indigo-500">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-500" />
              Incomplete checkouts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Pending payments requiring intervention</p>
          </div>
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">
            <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-500" />
          </div>
        </div>

        <div className="space-y-3">
          {abandoned.length > 0 ? abandoned.map((tx: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  ${tx.amount}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{tx.user_name || 'Anonymous'}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Initiated {new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  onRetarget(tx.user_id, 5);
                  alert(`Sent $${tx.amount} equivalent engagement bonus to ${tx.user_name}`);
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-all uppercase"
              >
                Incentivize
              </button>
            </div>
          )) : (
            <div className="py-12 text-center">
              <p className="text-slate-400 text-xs font-medium italic">All conversion paths are currently healthy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

