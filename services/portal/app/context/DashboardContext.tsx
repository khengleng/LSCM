"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const PRODUCTION_GATEWAY = 'https://gateway-production.up.railway.app/api/v1';

export const getAdminToken = (): string => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('LSCM_ADMIN_TOKEN_OVERRIDE');
    if (override && override.trim()) return override.trim();
  }
  return process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'lifestyle-machine-ultra-secret-2026';
};

export const getApiBase = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || PRODUCTION_GATEWAY;
  }

  const override = localStorage.getItem('LSCM_API_OVERRIDE');
  if (override && override.trim()) return override.trim();

  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return PRODUCTION_GATEWAY;
  }

  return 'http://localhost:3000/api/v1';
};

export interface AuditEvent {
  id: string;
  type: 'payment' | 'user' | 'config' | 'voice' | 'alert';
  message: string;
  timestamp: Date;
  severity: 'info' | 'success' | 'warning' | 'error';
}

interface DashboardContextType {
  stats: any;
  configs: any[];
  transactions: any[];
  revenueData: any[];
  users: any[];
  usageStats: any[];
  journeys: any[];
  retargetingData: any;
  health: any;
  events: AuditEvent[];
  loading: boolean;
  
  // Search/Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredUsers: any[];
  filteredTransactions: any[];
  
  // Actions
  updateConfig: (key: string, value: string) => Promise<void>;
  approveTransaction: (txId: string) => Promise<void>;
  adjustCredits: (userId: string, adjustment: number) => Promise<void>;
  bulkGiftCredits: (userIds: string[], amount: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<any>(null);
  const [configs, setConfigs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [usageStats, setUsageStats] = useState<any[]>([]);
  const [journeys, setJourneys] = useState<any[]>([]);
  const [retargetingData, setRetargetingData] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const addEvent = (event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newEvent: AuditEvent = {
      ...event,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date()
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  };

  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const apiBase = getApiBase();
      const adminToken = getAdminToken();
      
      const response = await fetch(`${apiBase}/admin/dashboard-blob`, {
        headers: { 'x-admin-token': adminToken }
      });

      if (!response.ok) return;

      const data = await response.json();
      
      if (data) {
        // Detect changes for Audit Log
        if (users.length > 0 && data.users.length > users.length) {
          addEvent({ type: 'user', message: `New User onboarded: ${data.users[0].name || 'Anonymous'}`, severity: 'success' });
        }
        if (transactions.length > 0 && data.transactions.length > transactions.length) {
          const newTx = data.transactions[0];
          if (newTx.status === 'success') {
            addEvent({ type: 'payment', message: `Payment Received: $${newTx.amount} from ${newTx.user_name || 'User'}`, severity: 'success' });
          }
        }

        setStats(data.stats || {});
        setConfigs(Array.isArray(data.configs) ? data.configs : []);
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
        setRevenueData(Array.isArray(data.revenueData) ? data.revenueData : []);
        setUsers(Array.isArray(data.users) ? data.users : []);
        setUsageStats(Array.isArray(data.usageStats) ? data.usageStats : []);
        setJourneys(Array.isArray(data.journeys) ? data.journeys : []);
        setRetargetingData(data.retargetingData || {});
        setHealth(data.health || null);
      }
    } catch (err) {
      console.error('Failed to fetch unified dashboard data', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 60000);
    return () => clearInterval(interval);
  }, []);

  // Performance optimized filtering
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const s = searchTerm.toLowerCase();
    return users.filter(u => 
      String(u.name || '').toLowerCase().includes(s) || 
      String(u.id || '').toLowerCase().includes(s) ||
      String(u.email || '').toLowerCase().includes(s)
    );
  }, [users, searchTerm]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    const s = searchTerm.toLowerCase();
    return transactions.filter(t => 
      String(t.user_name || '').toLowerCase().includes(s) || 
      String(t.id || '').toLowerCase().includes(s) ||
      String(t.status || '').toLowerCase().includes(s)
    );
  }, [transactions, searchTerm]);

  const updateConfig = async (key: string, value: string) => {
    try {
      addEvent({ type: 'config', message: `Updating configuration: ${key}`, severity: 'info' });
      await fetch(`${getApiBase()}/admin/configs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': getAdminToken()
        },
        body: JSON.stringify({ key, value })
      });
      fetchData();
      addEvent({ type: 'config', message: `Config ${key} optimized successfully`, severity: 'success' });
    } catch (err) {
      addEvent({ type: 'alert', message: `Failed to update ${key}`, severity: 'error' });
    }
  };

  const approveTransaction = async (transactionId: string) => {
    try {
      addEvent({ type: 'payment', message: `Force approving transaction ${transactionId.substring(0,8)}`, severity: 'warning' });
      const resp = await fetch(`${getApiBase()}/admin/transactions/approve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': getAdminToken()
        },
        body: JSON.stringify({ transactionId })
      });
      if (!resp.ok) throw new Error('Failed to approve');
      fetchData();
      addEvent({ type: 'payment', message: `Transaction verified and credited manually`, severity: 'success' });
    } catch (err) {
      addEvent({ type: 'alert', message: `Manual approval failed`, severity: 'error' });
    }
  };

  const adjustCredits = async (userId: string, adjustment: number) => {
    try {
      await fetch(`${getApiBase()}/admin/users/adjust-credits`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': getAdminToken()
        },
        body: JSON.stringify({ userId, adjustment })
      });
      fetchData();
      addEvent({ 
        type: 'user', 
        message: `${adjustment > 0 ? 'Gifted' : 'Drained'} ${Math.abs(adjustment)} credits for user ${userId.substring(0, 8)}`, 
        severity: adjustment > 0 ? 'success' : 'warning' 
      });
    } catch (err) {
      alert('Failed to adjust credits');
    }
  };

  const bulkGiftCredits = async (userIds: string[], amount: number) => {
    addEvent({ type: 'user', message: `Initiating bulk gift of ${amount} credits to ${userIds.length} users`, severity: 'info' });
    for (const id of userIds) {
      await adjustCredits(id, amount);
    }
    addEvent({ type: 'user', message: `Bulk operation complete for ${userIds.length} users`, severity: 'success' });
  };

  return (
    <DashboardContext.Provider value={{
      stats, configs, transactions, revenueData, users, usageStats, journeys, retargetingData, health, events, loading,
      searchTerm, setSearchTerm, filteredUsers, filteredTransactions,
      updateConfig, approveTransaction, adjustCredits, bulkGiftCredits, refresh: () => fetchData(true)
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
