"use client";

import React, { useState, useEffect } from "react";
import "./globals.css";
import { 
  Cpu, 
  LayoutDashboard, 
  Users as UsersIcon, 
  Target, 
  CreditCard as PaymentIcon, 
  MousePointer2, 
  Settings, 
  RefreshCcw 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardProvider, useDashboard, getApiBase } from "./context/DashboardContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DashboardProvider>
          <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </DashboardProvider>
      </body>
    </html>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { refresh, loading, searchTerm, setSearchTerm } = useDashboard();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [resolvedApiUrl, setResolvedApiUrl] = useState('');

  useEffect(() => {
    setResolvedApiUrl(getApiBase());
  }, []);

  const pathDisplay = pathname === '/' ? 'System Overview' : pathname.replace('/', '').replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Persistent Sidebar */}
      <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[70] flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-slate-900 dark:bg-indigo-600 rounded-lg shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">Lifestyle Machine</h1>
            <p className="text-[10px] text-slate-500 font-medium">Ops Dashboard v1.2.0</p>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          <NavButton href="/" active={pathname === '/'} icon={LayoutDashboard} label="Control Center" />
          <NavButton href="/users" active={pathname === '/users'} icon={UsersIcon} label="User Management" />
          <NavButton href="/retargeting" active={pathname === '/retargeting'} icon={Target} label="Retargeting Hub" />
          <NavButton href="/ledger" active={pathname === '/ledger'} icon={PaymentIcon} label="Financial Ledger" />
          <NavButton href="/journeys" active={pathname === '/journeys'} icon={MousePointer2} label="Journey Trace" />
          <NavButton href="/settings" active={pathname === '/settings'} icon={Settings} label="System Config" />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
           <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
             <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
               <span>Network Node</span>
               <span className="text-emerald-500">Online</span>
             </div>
             <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
               <div className="h-full w-full bg-emerald-500 animate-pulse" />
             </div>
             <p className="text-[9px] text-slate-400 mt-2 font-mono truncate">{resolvedApiUrl.replace('https://', '')}</p>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-3 min-w-[150px]">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500">
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 truncate">
                {pathDisplay}
              </h2>
            </div>

            <div className="hidden md:flex flex-1 max-w-md relative group">
              <input 
                type="text"
                placeholder="Search global operations..."
                className="w-full bg-slate-100 dark:bg-slate-800/50 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 ring-indigo-500/10 rounded-xl px-10 py-2.5 text-xs font-medium transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <HeaderAction icon={RefreshCcw} title="Manual Refresh" onClick={refresh} loading={loading} />
            <HeaderAction icon={Settings} title="Developer Overrides" onClick={() => {
                const url = prompt('Enter Gateway URL:', localStorage.getItem('LSCM_API_OVERRIDE') || '');
                if (url) localStorage.setItem('LSCM_API_OVERRIDE', url.trim());
                window.location.reload();
            }} />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
            <div className="flex items-center gap-3 pl-1">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-black uppercase leading-none">Admin</p>
                <p className="text-[8px] text-emerald-500 font-bold tracking-widest mt-0.5 uppercase">Superuser</p>
              </div>
              <div className="h-9 w-9 bg-slate-900 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xs ring-4 ring-black/5 dark:ring-indigo-500/10 shadow-lg">AD</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

       {/* Mobile Navigator */}
       {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-white dark:bg-slate-900" onClick={e => e.stopPropagation()}>
             <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold uppercase text-xs">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>✕</button>
             </div>
             <div className="p-4 space-y-2">
                <MobileLink href="/" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileLink href="/users" icon={UsersIcon} label="Users" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileLink href="/ledger" icon={PaymentIcon} label="Financials" onClick={() => setIsMobileMenuOpen(false)} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({ href, active, icon: Icon, label }: any) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}>
        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
        {label}
      </div>
    </Link>
  );
}

function MobileLink({ href, icon: Icon, label, onClick }: any) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-sm">
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

function HeaderAction({ icon: Icon, title, onClick, loading }: any) {
  return (
    <button onClick={onClick} className={`p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 ${loading ? 'animate-spin' : ''}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}
