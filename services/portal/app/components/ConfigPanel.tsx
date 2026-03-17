"use client";

import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface ConfigPanelProps {
  configs: any[];
  onUpdate: (key: string, value: string) => Promise<void>;
}

export default function ConfigPanel({ configs, onUpdate }: ConfigPanelProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [shownKeys, setShownKeys] = useState<Set<string>>(new Set());

  const handleSave = async (key: string) => {
    await onUpdate(key, editValue);
    setEditingKey(null);
  };

  const toggleVisibility = (key: string) => {
    const newShown = new Set(shownKeys);
    if (newShown.has(key)) newShown.delete(key);
    else newShown.add(key);
    setShownKeys(newShown);
  };

  const isSensitive = (key: string) => {
    const k = key.toLowerCase();
    return k.includes('key') || k.includes('token') || k.includes('secret') || k.includes('password');
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative h-full">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
        <SettingsIcon className="w-5 h-5 text-slate-400" />
        Dynamic Configuration
      </h3>
      
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {configs.sort((a,b) => a.category.localeCompare(b.category)).map((cfg) => (
          <div key={cfg.key} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 group transition-all">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{cfg.key.replace(/_/g, ' ')}</span>
              <span className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-bold text-slate-600 dark:text-slate-400">{cfg.category}</span>
            </div>
            
            {editingKey === cfg.key ? (
              <div className="flex gap-2">
                <input 
                  type={(isSensitive(cfg.key) && !shownKeys.has(cfg.key)) ? "password" : "text"}
                  className="flex-1 bg-white dark:bg-slate-900 text-sm px-3 py-2 rounded-lg border border-indigo-500 dark:border-indigo-500/50 focus:outline-none focus:ring-4 ring-indigo-500/10 text-slate-900 dark:text-white"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <button onClick={() => setEditingKey(null)} className="px-3 py-2 text-xs text-slate-500 font-semibold hover:text-slate-900 dark:hover:text-white">Cancel</button>
                <button onClick={() => handleSave(cfg.key)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-sm transition-all">
                   Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                    {(isSensitive(cfg.key) && !shownKeys.has(cfg.key)) ? "••••••••••••••••" : (cfg.value || "---")}
                  </span>
                  {isSensitive(cfg.key) && (
                    <button 
                      onClick={() => toggleVisibility(cfg.key)}
                      className="text-slate-400 hover:text-indigo-500 p-1 transition-colors"
                    >
                      {shownKeys.has(cfg.key) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => { setEditingKey(cfg.key); setEditValue(cfg.value); }}
                  className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-all"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-500/5 rounded-xl border border-amber-100 dark:border-amber-500/10 flex items-start gap-3">
         <ShieldCheck className="w-4 h-4 text-amber-500/60 shrink-0 mt-0.5" />
         <p className="text-[10px] text-amber-700/70 dark:text-amber-500/70 leading-relaxed font-medium">
           Security Note: Keys are encrypted at rest. Rotating the dashboard token will update access requirements globally.
         </p>
      </div>
    </div>
  );
}

