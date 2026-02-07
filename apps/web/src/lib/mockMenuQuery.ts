import { QueryClient, useQuery } from '@tanstack/react-query';
import { useMenuStore } from '@/store/useMenuStore';

export const fetchMockMenuItems = async () => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current menu items from store
      const items = useMenuStore.getState().items;
      resolve(items);
    }, 1000);
  });
};

export const useMockMenuQuery = () => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: fetchMockMenuItems,
  });
};

export const queryClient = new QueryClient();
