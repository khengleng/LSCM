"use client";

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export function useDashboardData() {
  const [stats, setStats] = useState<any>(null);
  const [configs, setConfigs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, cRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`),
        fetch(`${API_BASE}/admin/configs`),
        fetch(`${API_BASE}/admin/transactions`)
      ]);

      const [sData, cData, tData] = await Promise.all([
        sRes.json(),
        cRes.json(),
        tRes.json()
      ]);

      setStats(sData);
      setConfigs(cData);
      setTransactions(tData);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      fetchData(); // Refresh
    } catch (err) {
      alert('Failed to update config');
    }
  };

  return { stats, configs, transactions, loading, updateConfig, refresh: fetchData };
}
