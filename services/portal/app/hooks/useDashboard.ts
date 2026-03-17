"use client";

import { useState, useEffect } from 'react';

const PRODUCTION_GATEWAY = 'https://gateway-production-81e8.up.railway.app/api/v1';
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'lifestyle-machine-ultra-secret-2026';

/**
 * Returns the correct API base URL at call-time (NOT frozen at module load).
 * Priority order:
 *   1. localStorage override (set via the ⚙ Settings button in the header)
 *   2. NEXT_PUBLIC_API_URL env var (if it's not a localhost address)
 *   3. Known production gateway when running on a non-localhost hostname
 *   4. Localhost fallback (dev only)
 */
export const getApiBase = (): string => {
  if (typeof window === 'undefined') {
    // SSR context — return env var or a safe placeholder (won't be used for actual fetches)
    return process.env.NEXT_PUBLIC_API_URL || PRODUCTION_GATEWAY;
  }

  // 1. Explicit runtime override
  const override = localStorage.getItem('LSCM_API_OVERRIDE');
  if (override && override.trim()) return override.trim();

  // 2. Env var — only trust it if it's not pointing at localhost
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  // 3. Production hostname detected — use the known gateway
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    if (envUrl && !envUrl.includes('localhost')) return envUrl;
    console.warn('⚠️ CONFIGURATION ERROR: The portal is running in production but NEXT_PUBLIC_API_URL points to localhost. Falling back to the production gateway. Use the ⚙ Settings button in the header to override.');
    return PRODUCTION_GATEWAY;
  }

  // 4. Dev localhost fallback
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
      const responses = await Promise.all(
        endpoints.map(e => fetch(`${apiBase}/admin/${e}`, {
          headers: { 'x-admin-token': ADMIN_TOKEN }
        }))
      );

      const data = await Promise.all(responses.map(r => r.json()));

      setStats(data[0]);
      setConfigs(data[1]);
      setTransactions(data[2]);
      setRevenueData(data[3]);
      setUsers(data[4]);
      setUsageStats(data[5]);
      setJourneys(data[6]);
      setRetargetingData(data[7]);
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
          'x-admin-token': ADMIN_TOKEN
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
          'x-admin-token': ADMIN_TOKEN
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
