import { QueryClient, useQuery } from '@tanstack/react-query';
import { useStaffStore, StaffMember } from '@/store/useStaffStore';

export const fetchMockStaff = async (): Promise<StaffMember[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current staff from store
      const staff = useStaffStore.getState().staff;
      resolve(staff);
    }, 1000);
  });
};

export const useMockStaffQuery = () => {
  return useQuery<StaffMember[]>({
    queryKey: ['staff'],
    queryFn: fetchMockStaff,
  });
};

export const queryClient = new QueryClient();
