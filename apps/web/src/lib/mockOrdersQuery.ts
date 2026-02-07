import { QueryClient, useQuery } from '@tanstack/react-query';
import { useOrdersStore } from '@/store/useOrdersStore';

export const fetchMockOrders = async () => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current orders from store
      const orders = useOrdersStore.getState().orders;
      resolve(orders);
    }, 1000);
  });
};

export const useMockOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchMockOrders,
  });
};

export const queryClient = new QueryClient();