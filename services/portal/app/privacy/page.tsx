"use client";

import React from 'react';
import { ShieldCheck, Eye, Database, Share2, Lock, Clock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 18, 2026";

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-[10px] font-black text-white px-2 py-0.5 rounded-full tracking-widest uppercase">Compliance Documentation</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">v1.2.0</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-emerald-500" />
            Privacy Policy
          </h1>
          <p className="text-slate-500 font-medium italic text-sm tracking-tight border-l-2 border-emerald-500/20 pl-4 max-w-2xl">
            How we collect, protect, and process your data to provide AI lifestyle insights while respecting your digital privacy.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Updated</p>
          <p className="text-sm font-black text-slate-900 dark:text-white">{lastUpdated}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Navigation / TOC */}
        <div className="md:col-span-4 space-y-4">
          <div className="sticky top-24 space-y-1 bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 px-2">Privacy Sections</h3>
             <QuickLink icon={Eye} label="Data Collection" targetId="collection" active />
             <QuickLink icon={Database} label="Usage & Storage" targetId="usage" />
             <QuickLink icon={Lock} label="Image Processing" targetId="images" />
             <QuickLink icon={Share2} label="Third Parties" targetId="sharing" />
             <QuickLink icon={Clock} label="Data Retention" targetId="retention" />
          </div>
        </div>

        {/* Content Section */}
        <div className="md:col-span-8 space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          
          <section id="collection" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              1. Information We Collect
            </h2>
            <p>
              We collect information to provide a better experience to our users. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Voice Data:</strong> Temporary audio recordings for transcription purposes.</li>
              <li><strong>Image Data:</strong> Photos of palms or faces for lifestyle analysis.</li>
              <li><strong>Profile Info:</strong> Birth dates and times provided for astrological calculations.</li>
              <li><strong>Device Info:</strong> Technical data related to your platform (Wing App, Messenger, or Telegram).</li>
            </ul>
          </section>

          <section id="usage" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              2. How We Use Information
            </h2>
            <p>
              We use the collected information solely to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Generate AI-driven insights and lifestyle reports.</li>
              <li>Convert your voice queries into text and audio responses.</li>
              <li>Process payments and manage your subscription state.</li>
              <li>Improve the accuracy of our AI models through anonymized data analysis.</li>
            </ul>
          </section>

          <section id="images" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              3. Image and Biometric Safety
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
               <p className="text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                 We do not use facial recognition for identification. Face and palm images are processed to extract features for lifestyle analysis only. Once analysis is complete, original images are deleted from active processing buffers.
               </p>
            </div>
          </section>

          <section id="sharing" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              4. Data Sharing and Third Parties
            </h2>
            <p>
              We do not sell your personal data. We share data only with:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Wing Bank:</strong> To facilitate secure payments and account verification.</li>
              <li><strong>AI Providers:</strong> (e.g., Google Cloud, OpenAI) For STT, TTS, and insight generation. Data is shared anonymously.</li>
              <li><strong>Social Platforms:</strong> (Facebook, Telegram) Only to deliver messages back to you as requested.</li>
            </ul>
          </section>

          <section id="retention" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              5. Data Retention
            </h2>
            <p>
              We retain personal data only for as long as necessary to provide our services and comply with legal obligations. Transaction records are kept for a minimum of 7 years in accordance with financial regulations.
            </p>
          </section>

          <div className="pt-10 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
            &copy; 2026 Lifestyle Machine Data Ethics Board. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon: Icon, label, targetId, active = false }: any) {
  return (
    <a 
      href={`#${targetId}`}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
        active 
        ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
      {label}
    </a>
  );
}
