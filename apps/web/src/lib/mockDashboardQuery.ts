import { QueryClient, useQuery } from '@tanstack/react-query';
import { useDashboardStore } from '@/store/useDashboardStore';

export const fetchMockDashboardStats = async () => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current stats from store
      const stats = useDashboardStore.getState().stats;
      resolve(stats);
    }, 800); // Slightly faster than other queries for snappier UX
  });
};

export const useMockDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchMockDashboardStats,
  });
};

export const queryClient = new QueryClient();
