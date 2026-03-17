"use client";

import React from 'react';
import { Target, AlertCircle, ShoppingCart, ArrowRight, UserPlus, Zap, Gift, CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface RetargetingHubProps {
  data?: any;
  onRetarget?: (userId: string, amount: number) => void;
}

export default function RetargetingHub({ data: propData, onRetarget: propOnRetarget }: RetargetingHubProps) {
  const { retargetingData, adjustCredits } = useDashboard();
  
  const data = retargetingData || propData;
  const onRetarget = adjustCredits || propOnRetarget;

  const hotLeads = data?.hot_leads || [];
  const abandoned = data?.abandoned_payments || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
      {/* Hot Leads Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-l-8 border-l-amber-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
              Hot Leads
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-widest">High intent // Zero credit balance</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform">
            <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </div>
        </div>

        <div className="space-y-4">
          {hotLeads.length > 0 ? hotLeads.map((user: any, i: number) => (
            <div key={user.id || i} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-500/30 transition-all hover:translate-x-1 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500">
                  {user.name?.substring(0, 2) || '??'}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-tight">{user.name || 'Anonymous'}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Active: {new Date(user.last_seen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {user.credit_balance} cr
                </div>
                <button 
                  onClick={() => onRetarget?.(user.id, 5)}
                  className="px-4 py-2 bg-amber-600 dark:bg-amber-600 text-white text-[10px] font-black rounded-xl hover:bg-amber-700 transition-all uppercase tracking-widest shadow-lg shadow-amber-500/20"
                >
                  Gift +5
                </button>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl opacity-50 grayscale">
               <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full inline-block mb-4">
                  <CheckCircle2 className="w-8 h-8 text-slate-300" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">No high-intent drop-offs<br/>within 24h window</p>
            </div>
          )}
        </div>
      </div>

      {/* Abandoned Cart Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-l-8 border-l-indigo-600">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-indigo-500" />
              Drop-off Recovery
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-widest">Pending KHQR Settlement Interventions</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform">
            <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
          </div>
        </div>

        <div className="space-y-4">
          {abandoned.length > 0 ? abandoned.map((tx: any, i: number) => (
            <div key={tx.id || i} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all hover:translate-x-1 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-600">
                  ${tx.amount}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-tight">{tx.user_name || 'Subscriber'}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Halt: {new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <button 
                onClick={() => onRetarget?.(tx.user_id, 10)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest shadow-xl shadow-indigo-500/20"
              >
                <Zap className="w-3.5 h-3.5" />
                Incentivize
              </button>
            </div>
          )) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl opacity-50 grayscale">
               <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full inline-block mb-4">
                  <CheckCircle2 className="w-8 h-8 text-slate-300" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">No blocked payments<br/>cluster status: optimal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
