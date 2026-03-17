"use client";

import { useState, useEffect } from 'react';

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('LSCM_API_OVERRIDE');
    if (override) return override;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
};

const API_BASE = getApiBase();
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'lifestyle-machine-ultra-secret-2026';

if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && API_BASE.includes('localhost')) {
  console.warn('⚠️ CONFIGURATION ERROR: The portal is running in production but attempting to connect to localhost. Use the API settings in the header to fix this.');
}

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
      
      const responses = await Promise.all(
        endpoints.map(e => fetch(`${API_BASE}/admin/${e}`, {
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
      await fetch(`${API_BASE}/admin/configs`, {
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
      await fetch(`${API_BASE}/admin/users/adjust-credits`, {
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
