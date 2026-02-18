import { QueryClient, useQuery } from '@tanstack/react-query';
import { useOrdersStore, Order } from '@/store/useOrdersStore';

export const fetchMockOrders = async (): Promise<Order[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current orders from store
      const orders = useOrdersStore.getState().orders;
      resolve(orders);
    }, 1200);
  });
};

export const useMockOrdersQuery = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: fetchMockOrders,
  });
};

export const queryClient = new QueryClient();