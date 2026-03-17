"use client";

import React, { useState } from 'react';
import { User, Shield, CreditCard, Languages, Plus, Minus, FileText, CheckCircle2, MoreVertical, Search, Gift, Trash2, X } from 'lucide-react';
import { exportToCSV } from '../utils/export';
import { useDashboard } from '../context/DashboardContext';

interface UserTableProps {
  users: any[];
  onAdjustCredits?: (userId: string, adjustment: number) => void;
}

export default function UserTable({ users: propUsers, onAdjustCredits }: UserTableProps) {
  const { filteredUsers, searchTerm, setSearchTerm, bulkGiftCredits } = useDashboard();
  const [adjustValue, setAdjustValue] = useState<number>(5);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  const displayUsers = filteredUsers || propUsers;

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === displayUsers.length) setSelectedUsers([]);
    else setSelectedUsers(displayUsers.map(u => u.id));
  };

  const handleBulkGift = () => {
    if (selectedUsers.length === 0) return;
    if (confirm(`Bulk gift ${adjustValue} credits to ${selectedUsers.length} users?`)) {
      bulkGiftCredits(selectedUsers, adjustValue);
      setSelectedUsers([]);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-xl">
        {/* Table Toolbar */}
        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-6 bg-slate-50/30 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">User Directory</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{displayUsers.length} Accounts Synchronized</p>
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                  {selectedUsers.length} Selected
                </span>
                <button 
                  onClick={handleBulkGift}
                  className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all"
                >
                  <Gift className="w-3.5 h-3.5" />
                  Bulk Gift
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 shadow-sm p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setAdjustValue(prev => Math.max(1, prev - 1))}
                className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-all"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="px-3 flex flex-col items-center">
                 <span className="text-[11px] font-black text-slate-900 dark:text-white tracking-widest">{adjustValue}</span>
                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Credits</span>
              </div>
              <button 
                onClick={() => setAdjustValue(prev => prev + 1)}
                className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button 
              onClick={() => exportToCSV(displayUsers, 'lscm_users')}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              title="Export Current View"
            >
              <FileText className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 h-16">
                <th className="px-8 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedUsers.length > 0 && selectedUsers.length === displayUsers.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4">Identity</th>
                <th className="px-6">Status</th>
                <th className="px-6">Engagement</th>
                <th className="px-6">Voice Node</th>
                <th className="px-8 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {displayUsers.map((user, i) => (
                <tr 
                  key={user.id} 
                  className={`group transition-all duration-200 ${
                    selectedUsers.includes(user.id) ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <td className="px-8 py-5">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                    />
                  </td>
                  <td className="px-4 py-5">
                    <div 
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => setSelectedProfile(user)}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm overflow-hidden">
                        {user.name ? user.name.substring(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{user.name || 'Anonymous Engine'}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1 opacity-60 truncate">{user.email || 'No Email Linked'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      user.plan_name === 'premium' 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      {user.plan_name || 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <span className="text-xs font-black text-slate-900 dark:text-white tracking-widest tabular-nums">{user.credit_balance}</span>
                       <div className="h-1 w-12 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${user.credit_balance < 5 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, user.credit_balance * 10)}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       {user.language === 'km' ? (
                         <><div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" /> Khmer</>
                       ) : (
                         <><div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" /> English</>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right flex justify-end gap-1.5">
                    <button 
                      onClick={() => onAdjustCredits?.(user.id, adjustValue)}
                      className="p-2.5 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 rounded-xl transition-all border border-emerald-100 dark:border-emerald-500/20"
                      title={`Add ${adjustValue}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onAdjustCredits?.(user.id, -adjustValue)}
                      className="p-2.5 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl transition-all border border-rose-100 dark:border-rose-500/20"
                      title={`Sub ${adjustValue}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedProfile(user)}
                      className="p-2.5 hover:bg-slate-900 hover:text-white text-slate-400 rounded-xl transition-all border border-slate-100 dark:border-slate-800"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayUsers.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center grayscale scale-90 opacity-50">
             <Search className="w-16 h-16 text-slate-300 mb-4" />
             <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Zero matches for "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Side Profile Drawer */}
      {selectedProfile && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedProfile(null)} />
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl relative animate-in slide-in-from-right duration-500 border-l border-slate-200 dark:border-slate-800">
            <div className="h-full flex flex-col">
              <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">User Intelligence Suite</h4>
                 <button onClick={() => setSelectedProfile(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg Transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-indigo-500/20">
                       {selectedProfile.name ? selectedProfile.name.substring(0, 2).toUpperCase() : <User className="w-12 h-12" />}
                    </div>
                    <div>
                       <h2 className="text-3xl font-black tracking-tighter uppercase">{selectedProfile.name || 'Anonymous'}</h2>
                       <p className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-[10px] mt-1">Profile Integrity: Verified</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <ProfileMetric label="Credit Balance" value={selectedProfile.credit_balance} icon={CreditCard} />
                    <ProfileMetric label="Active Plan" value={selectedProfile.plan_name || 'Free'} icon={Shield} />
                    <ProfileMetric label="Core Native" value={selectedProfile.language === 'km' ? 'Khmer' : 'English'} icon={Languages} />
                    <ProfileMetric label="System Role" value="Subscriber" icon={User} />
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational DNA</h5>
                    <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-200 dark:border-slate-800 font-mono text-[10px] space-y-2 opacity-80">
                       <p><span className="text-indigo-500">ID:</span> {selectedProfile.id}</p>
                       <p><span className="text-indigo-500">EMAIL:</span> {selectedProfile.email || 'N/A'}</p>
                       <p><span className="text-indigo-500">AUTH:</span> Firebase_Internal</p>
                       <p><span className="text-emerald-500">LASTPAY:</span> {selectedProfile.last_payment_date || 'None Recorded'}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interaction History</h5>
                    <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-slate-400 font-black uppercase text-[9px] tracking-[0.2em]">
                       No recent voice engagements found
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex gap-4">
                 <button 
                  onClick={() => onAdjustCredits?.(selectedProfile.id, 50)}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 transition-all"
                 >
                   Gift 50 Credits
                 </button>
                 <button className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-rose-500 hover:text-white transition-all text-slate-500">
                    <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMetric({ label, value, icon: Icon }: any) {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] shadow-sm">
       <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Icon className="w-3 h-3" />
          <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <p className="text-lg font-black tracking-tight text-slate-900 dark:text-white truncate uppercase">{value}</p>
    </div>
  );
}
