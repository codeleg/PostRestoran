import { QueryClient, useQuery } from '@tanstack/react-query';
import { useMenuStore, MenuItem } from '@/store/useMenuStore';

export const fetchMockMenuItems = async (): Promise<MenuItem[]> => {
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
  return useQuery<MenuItem[]>({
    queryKey: ['menu'],
    queryFn: fetchMockMenuItems,
  });
};

export const queryClient = new QueryClient();
