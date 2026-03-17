"use client";

import { useState, useEffect } from 'react';

const PRODUCTION_GATEWAY = 'https://gateway-production.up.railway.app/api/v1';
export const getAdminToken = (): string => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('LSCM_ADMIN_TOKEN_OVERRIDE');
    if (override && override.trim()) return override.trim();
  }
  return process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'lifestyle-machine-ultra-secret-2026';
};

/**
 * Returns the correct API base URL at call-time (NOT frozen at module load).
 */
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

export function useDashboardData() {
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
      const endpoints = [
        'stats',
        'configs',
        'transactions',
        'revenue-chart',
        'users',
        'usage-stats',
        'journeys',
        'retargeting'
      ];
      
      const apiBase = getApiBase();
      const adminToken = getAdminToken();
      const responses = await Promise.all(
        endpoints.map(e => fetch(`${apiBase}/admin/${e}`, {
          headers: { 'x-admin-token': adminToken }
        }))
      );

      const data = await Promise.all(responses.map(async (r, i) => {
        if (!r.ok) {
          console.warn(`[API] Endpoint /admin/${endpoints[i]} failed with status ${r.status}`);
          return [1, 2, 3, 4, 5, 6].includes(i) ? [] : null;
        }
        try { return await r.json(); } catch(e) { return null; }
      }));

      setStats(data[0] || {});
      setConfigs(Array.isArray(data[1]) ? data[1] : []);
      setTransactions(Array.isArray(data[2]) ? data[2] : []);
      setRevenueData(Array.isArray(data[3]) ? data[3] : []);
      setUsers(Array.isArray(data[4]) ? data[4] : []);
      setUsageStats(Array.isArray(data[5]) ? data[5] : []);
      setJourneys(Array.isArray(data[6]) ? data[6] : []);
      setRetargetingData(data[7] || {});
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
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
      fetchData(); // Refresh
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
      fetchData(); // Refresh
    } catch (err) {
      alert('Failed to adjust credits');
    }
  };

  return { 
    stats, 
    configs, 
    transactions, 
    revenueData, 
    users, 
    usageStats, 
    journeys, 
    retargetingData,
    loading, 
    updateConfig, 
    adjustCredits,
    refresh: fetchData 
  };
}
