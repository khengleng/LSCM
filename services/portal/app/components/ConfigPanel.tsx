"use client";

import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface ConfigPanelProps {
  configs: any[];
  onUpdate: (key: string, value: string) => Promise<void>;
}

const SUGGESTED_KEYS = [
  { key: 'telegram_bot_token', category: 'api_keys', label: 'Telegram Bot Token' },
  { key: 'gemini_api_key', category: 'api_keys', label: 'Gemini AI Hub Key' },
  { key: 'facebook_messenger_page_token', category: 'api_keys', label: 'FB Messenger Page Token' },
  { key: 'fb_verify_token', category: 'api_keys', label: 'FB Webhook Verify Secret' },
  { key: 'openai_api_key', category: 'api_keys', label: 'OpenAI (DALL-E) Key' },
  { key: 'google_api_key', category: 'api_keys', label: 'Google STT/TTS Token' },
];

export default function ConfigPanel({ configs, onUpdate }: ConfigPanelProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [shownKeys, setShownKeys] = useState<Set<string>>(new Set());
  
  // New Key State
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleSave = async (key: string, val: string) => {
    await onUpdate(key, val);
    setEditingKey(null);
    setIsAdding(false);
    setNewKey("");
    setNewValue("");
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
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative h-full flex flex-col overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-950/20">
        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
          <SettingsIcon className="w-6 h-6 text-indigo-500" />
          Cluster Control Plane
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest shadow-lg shadow-indigo-500/20"
        >
          {isAdding ? 'Close Registry' : 'Register New Secret'}
        </button>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-4">
        {/* Registry Form */}
        {isAdding && (
          <div className="p-6 bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-4 duration-300 mb-8">
            <h4 className="text-[10px] font-black uppercase text-indigo-500 mb-4 tracking-widest">Add New Enterprise Credential</h4>
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Configuration Key</label>
                  <input 
                    type="text"
                    placeholder="e.g. telegram_bot_token"
                    className="w-full bg-white dark:bg-slate-900 text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none transition-all font-mono"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Value / Secret</label>
                  <input 
                    type="text"
                    placeholder="Paste credential here..."
                    className="w-full bg-white dark:bg-slate-900 text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none transition-all font-mono"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
               </div>
               <button 
                 disabled={!newKey || !newValue}
                 onClick={() => handleSave(newKey, newValue)}
                 className="w-full py-3 bg-indigo-600 disabled:opacity-50 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
               >
                 Authorize & Persist to Cluster
               </button>
            </div>

            <div className="mt-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Suggested Integration Keys</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_KEYS.filter(s => !configs.find(c => c.key === s.key)).map(s => (
                  <button 
                    key={s.key}
                    onClick={() => { setNewKey(s.key); }}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-bold text-slate-600 dark:text-slate-400 hover:border-indigo-500 transition-all"
                  >
                    + {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {configs.length === 0 && !isAdding && (
           <div className="py-20 text-center grayscale opacity-40">
              <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-full inline-block mb-4">
                 <ShieldCheck className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No active secrets found in the cluster database.</p>
           </div>
        )}

        {configs.sort((a,b) => a.category.localeCompare(b.category)).map((cfg) => (
          <div key={cfg.key} className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 group hover:bg-white dark:hover:bg-slate-900 transition-all hover:shadow-lg border-l-4 border-l-transparent hover:border-l-indigo-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-[0.2em]">{cfg.key.replace(/_/g, ' ')}</span>
              <span className="text-[9px] px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{cfg.category}</span>
            </div>
            
            {editingKey === cfg.key ? (
              <div className="flex gap-2">
                <input 
                  type={(isSensitive(cfg.key) && !shownKeys.has(cfg.key)) ? "password" : "text"}
                  className="flex-1 bg-white dark:bg-slate-900 text-sm px-4 py-3 rounded-xl border-2 border-indigo-500 dark:border-indigo-500/50 focus:outline-none text-slate-900 dark:text-white font-mono"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <button onClick={() => setEditingKey(null)} className="px-4 py-2 text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
                <button onClick={() => handleSave(cfg.key, editValue)} className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all uppercase tracking-widest">
                   Update
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-hidden">
                  <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                    {(isSensitive(cfg.key) && !shownKeys.has(cfg.key)) ? "••••••••••••••••••••••••••••" : (cfg.value || "---")}
                  </span>
                  {isSensitive(cfg.key) && (
                    <button 
                      onClick={() => toggleVisibility(cfg.key)}
                      className="text-slate-400 hover:text-indigo-500 p-2 transition-colors bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                    >
                      {shownKeys.has(cfg.key) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => { setEditingKey(cfg.key); setEditValue(cfg.value); }}
                  className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl transition-all"
                >
                  Modify
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-8 bg-amber-50/50 dark:bg-amber-500/5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-4">
         <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-500" />
         </div>
         <p className="text-[10px] text-amber-700/80 dark:text-amber-500/70 leading-relaxed font-bold uppercase tracking-wide">
           Security Matrix Active: These configurations are securely encrypted and cached in the orchestrator memory layer. Modifying keys will trigger a cluster-wide cache invalidation.
         </p>
      </div>
    </div>
  );
}

