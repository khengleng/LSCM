"use client";

import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, ShieldCheck } from 'lucide-react';

interface ConfigPanelProps {
  configs: any[];
  onUpdate: (key: string, value: string) => Promise<void>;
}

export default function ConfigPanel({ configs, onUpdate }: ConfigPanelProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleSave = async (key: string) => {
    await onUpdate(key, editValue);
    setEditingKey(null);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800/60 shadow-2xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <SettingsIcon className="w-32 h-32" />
      </div>
      <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-8 relative">
        <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <SettingsIcon className="w-5 h-5 text-purple-400" />
        </div>
        Engine Tuner
      </h3>
      
      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 scrollbar-hide relative custom-scrollbar">
        {configs.map((cfg) => (
          <div key={cfg.key} className="group bg-slate-800/30 hover:bg-slate-800/60 p-5 rounded-2xl border border-slate-800/50 transition-all">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cfg.key.replace(/_/g, ' ')}</span>
              <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 rounded-full text-indigo-400 font-bold border border-indigo-500/20">{cfg.category}</span>
            </div>
            
            {editingKey === cfg.key ? (
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-slate-900 text-sm p-2 rounded-lg border border-indigo-500/50 focus:outline-none focus:ring-2 ring-indigo-500/30 text-white"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <button onClick={() => handleSave(cfg.key)} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 shadow-lg shadow-emerald-500/20">
                   <Save className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-100 truncate max-w-[160px] font-mono">
                  {cfg.value || "---"}
                </span>
                <button 
                  onClick={() => { setEditingKey(cfg.key); setEditValue(cfg.value); }}
                  className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all"
                >
                  Adjust
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-start gap-3">
         <ShieldCheck className="w-5 h-5 text-amber-500/60 flex-shrink-0" />
         <p className="text-[10px] text-amber-500/70 leading-relaxed italic uppercase font-bold tracking-tight">
           Warning: Changing Model Routing or Limits will affect all active voice sessions instantly.
         </p>
      </div>
    </div>
  );
}
