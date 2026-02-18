import { create } from 'zustand';
import { UserRole, UserStatus, ShiftType } from '@postrestoran/shared';

export interface StaffMember {
  id: string;
  fullName: string;
  role: UserRole;
  shift: ShiftType;
  status: UserStatus;
}

interface StaffState {
  staff: StaffMember[];
  updateStaffStatus: (id: string, status: UserStatus) => void;
  updateStaffShift: (id: string, shift: ShiftType) => void;
}

export const useStaffStore = create<StaffState>((set) => ({
  staff: [
    { id: '1', fullName: 'John Martinez', role: UserRole.MANAGER, shift: ShiftType.FULL_DAY, status: UserStatus.ACTIVE },
    { id: '2', fullName: 'Sarah Chen', role: UserRole.WAITER, shift: ShiftType.MORNING, status: UserStatus.ACTIVE },
    { id: '3', fullName: 'Mike Johnson', role: UserRole.KITCHEN, shift: ShiftType.MORNING, status: UserStatus.ACTIVE },
    { id: '4', fullName: 'Emma Wilson', role: UserRole.WAITER, shift: ShiftType.EVENING, status: UserStatus.ACTIVE },
    { id: '5', fullName: 'David Lee', role: UserRole.KITCHEN, shift: ShiftType.EVENING, status: UserStatus.OFF_DUTY },
    { id: '6', fullName: 'Lisa Garcia', role: UserRole.CASHIER, shift: ShiftType.FULL_DAY, status: UserStatus.ACTIVE },
    { id: '7', fullName: 'James Brown', role: UserRole.WAITER, shift: ShiftType.FULL_DAY, status: UserStatus.OFF_DUTY },
    { id: '8', fullName: 'Rachel Taylor', role: UserRole.MANAGER, shift: ShiftType.MORNING, status: UserStatus.ACTIVE },
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
