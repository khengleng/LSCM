"use client";

import React from 'react';
import { Database, CheckCircle2, Globe, User, Shield, CreditCard } from 'lucide-react';

interface UserTableProps {
  users: any[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-slate-800/60 shadow-2xl overflow-hidden mt-10">
      <div className="px-10 py-8 bg-slate-900/40 flex justify-between items-center border-b border-slate-800/60">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            Global User Management
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Active Subscribers & Profile Status</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <th className="px-10 py-6">User Identity</th>
              <th className="px-10 py-6">Language</th>
              <th className="px-10 py-6">Subscription</th>
              <th className="px-10 py-6">Credits</th>
              <th className="px-10 py-6">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {users.length > 0 ? users.map((user, i) => (
              <tr key={i} className="hover:bg-slate-800/20 transition-all group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase shadow-inner">
                        {user.name?.substring(0,2) || '??'}
                     </div>
                     <div className="flex flex-col">
                       <span className="font-bold text-slate-200">{user.name || 'Anonymous'}</span>
                       <span className="text-[10px] text-slate-500 font-mono tracking-tighter">{user.id.substring(0,18)}...</span>
                     </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className="px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-xs font-bold text-slate-400 uppercase">
                    {user.language || 'km'}
                  </span>
                </td>
                <td className="px-10 py-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.plan_name === 'premium' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {user.plan_name === 'premium' && <Shield className="w-3 h-3" />}
                    {user.plan_name || 'free'}
                  </span>
                </td>
                <td className="px-10 py-6 font-black text-white tabular-nums">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <CreditCard className="w-3 h-3 opacity-50" />
                    {user.credit_balance || 0}
                  </div>
                </td>
                <td className="px-10 py-6">
                   <div className="flex items-center gap-2 text-slate-500">
                      <Globe className="w-4 h-4 text-slate-600" />
                      <span className="text-xs">{new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                   </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-10 py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                  No Users Registered Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
