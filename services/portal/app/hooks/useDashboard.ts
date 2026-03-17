"use client";

import { useDashboard, getApiBase, getAdminToken } from '../context/DashboardContext';

export { getApiBase, getAdminToken };

export function useDashboardData() {
  const context = useDashboard();
  return {
    ...context,
    refresh: context.refresh
  };
}
