import { QueryClient, useQuery } from '@tanstack/react-query';
import { useTablesStore, Table } from '@/store/useTablesStore';

export const fetchMockTables = async (): Promise<Table[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current tables from store
      const tables = useTablesStore.getState().tables;
      resolve(tables);
    }, 1000);
  });
};

export const useMockTablesQuery = () => {
  return useQuery<Table[]>({
    queryKey: ['tables'],
    queryFn: fetchMockTables,
  });
};

export const queryClient = new QueryClient();
