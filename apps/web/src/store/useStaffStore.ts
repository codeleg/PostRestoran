import { create } from 'zustand';

export interface Staff {
  id: string;
  fullName: string;
  role: 'Waiter' | 'Chef' | 'Cashier' | 'Manager';
  shift: 'Morning' | 'Evening' | 'Full Day';
  status: 'Active' | 'Off-duty';
}

interface StaffState {
  staff: Staff[];
  updateStaffStatus: (id: string, status: Staff['status']) => void;
  updateStaffShift: (id: string, shift: Staff['shift']) => void;
}

export const useStaffStore = create<StaffState>((set) => ({
  staff: [
    { id: '1', fullName: 'John Martinez', role: 'Manager', shift: 'Full Day', status: 'Active' },
    { id: '2', fullName: 'Sarah Chen', role: 'Waiter', shift: 'Morning', status: 'Active' },
    { id: '3', fullName: 'Mike Johnson', role: 'Chef', shift: 'Morning', status: 'Active' },
    { id: '4', fullName: 'Emma Wilson', role: 'Waiter', shift: 'Evening', status: 'Active' },
    { id: '5', fullName: 'David Lee', role: 'Chef', shift: 'Evening', status: 'Off-duty' },
    { id: '6', fullName: 'Lisa Garcia', role: 'Cashier', shift: 'Full Day', status: 'Active' },
    { id: '7', fullName: 'James Brown', role: 'Waiter', shift: 'Full Day', status: 'Off-duty' },
    { id: '8', fullName: 'Rachel Taylor', role: 'Manager', shift: 'Morning', status: 'Active' },
  ],
  updateStaffStatus: (id, status) =>
    set((state) => ({
      staff: state.staff.map((member) =>
        member.id === id ? { ...member, status } : member
      ),
    })),
  updateStaffShift: (id, shift) =>
    set((state) => ({
      staff: state.staff.map((member) =>
        member.id === id ? { ...member, shift } : member
      ),
    })),
}));
