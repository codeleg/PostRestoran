import { create } from 'zustand';

export interface DashboardStats {
  totalOrdersToday: number;
  activeTablesCount: number;
  revenueToday: number;
  staffOnDuty: number;
  lastUpdated: string;
}

interface DashboardState {
  stats: DashboardStats;
}

const generateDashboardStats = (): DashboardStats => {
  return {
    totalOrdersToday: 24,
    activeTablesCount: 7,
    revenueToday: 1245.50,
    staffOnDuty: 6,
    lastUpdated: new Date().toISOString(),
  };
};

export const useDashboardStore = create<DashboardState>(() => ({
  stats: generateDashboardStats(),
}));
