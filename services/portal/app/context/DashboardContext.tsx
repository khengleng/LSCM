"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface DashboardContextType {
  stats: any;
  configs: any[];
  transactions: any[];
  revenueData: any[];
  users: any[];
  usageStats: any[];
  journeys: any[];
  retargetingData: any;
  loading: boolean;
  updateConfig: (key: string, value: string) => Promise<void>;
  adjustCredits: (userId: string, adjustment: number) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiBase = getApiBase();
      const adminToken = getAdminToken();
      
      const response = await fetch(`${apiBase}/admin/dashboard-blob`, {
        headers: { 'x-admin-token': adminToken }
      });

      if (!response.ok) return;

      const data = await response.json();
      
      if (data) {
        setStats(data.stats || {});
        setConfigs(Array.isArray(data.configs) ? data.configs : []);
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
        setRevenueData(Array.isArray(data.revenueData) ? data.revenueData : []);
        setUsers(Array.isArray(data.users) ? data.users : []);
        setUsageStats(Array.isArray(data.usageStats) ? data.usageStats : []);
        setJourneys(Array.isArray(data.journeys) ? data.journeys : []);
        setRetargetingData(data.retargetingData || {});
      }
    } catch (err) {
      console.error('Failed to fetch unified dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateConfig = async (key: string, value: string) => {
    try {
      await fetch(`${getApiBase()}/admin/configs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': getAdminToken()
        },
        body: JSON.stringify({ key, value })
      });
      fetchData();
    } catch (err) {
      alert('Failed to update config');
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
    } catch (err) {
      alert('Failed to adjust credits');
    }
  };

  return (
    <DashboardContext.Provider value={{
      stats, configs, transactions, revenueData, users, usageStats, journeys, retargetingData, loading, updateConfig, adjustCredits, refresh: fetchData
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
