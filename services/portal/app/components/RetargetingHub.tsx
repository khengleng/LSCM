"use client";

import React from 'react';
import { Target, AlertCircle, ShoppingCart, ArrowRight, UserPlus, Zap } from 'lucide-react';

interface RetargetingHubProps {
  data: any;
}

export default function RetargetingHub({ data }: RetargetingHubProps) {
  const hotLeads = data?.hot_leads || [];
  const abandoned = data?.abandoned_payments || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
      {/* Hot Leads Section */}
      <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/60 shadow-2xl relative overflow-hidden group border-l-4 border-l-orange-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-500" />
              High Intent / Low Credit
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Users hitting usage walls</p>
          </div>
          <div className="p-2 bg-orange-500/10 rounded-full">
            <UserPlus className="w-4 h-4 text-orange-500" />
          </div>
        </div>

        <div className="space-y-4">
          {hotLeads.length > 0 ? hotLeads.map((user: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:bg-slate-800/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-black text-slate-500">
                  {user.name?.substring(0, 2) || '??'}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{user.name || 'Unknown'}</p>
                  <p className="text-[10px] text-slate-500 font-bold">Last Active: {new Date(user.last_seen).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[9px] font-black rounded border border-red-500/20 uppercase">
                  Balance: {user.credit_balance}
                </span>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-10 text-center">
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest italic">No hot leads detected</p>
            </div>
          )}
        </div>
      </div>

      {/* Abandoned Cart Section */}
      <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/60 shadow-2xl relative overflow-hidden group border-l-4 border-l-indigo-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-indigo-500" />
              Abandoned Conversions
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Top-up started but not finished</p>
          </div>
          <div className="p-2 bg-indigo-500/10 rounded-full">
            <AlertCircle className="w-4 h-4 text-indigo-500" />
          </div>
        </div>

        <div className="space-y-4">
          {abandoned.length > 0 ? abandoned.map((tx: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:bg-slate-800/50 transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-black text-indigo-400">
                  ${tx.amount}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{tx.user_name || 'Anonymous'}</p>
                  <p className="text-[10px] text-slate-500 font-bold">Initiated: {new Date(tx.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all">
                Retarget
              </button>
            </div>
          )) : (
            <div className="py-10 text-center">
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest italic">All journeys completed successfully</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
