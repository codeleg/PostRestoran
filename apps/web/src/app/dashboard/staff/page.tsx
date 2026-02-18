'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStaffQuery, useUpdateStaffStatus, useUpdateStaffShift, StaffMember } from '@/lib/api/useStaffQuery';
import { UserRole, UserStatus, ShiftType } from '@postrestoran/shared';
import { useToast } from '@/hooks/useToast';
import { Plus } from 'lucide-react';
import AddStaffModal from '@/components/admin/AddStaffModal';

const roleColors: Record<string, string> = {
  [UserRole.WAITER]: 'bg-blue-500',
  [UserRole.KITCHEN]: 'bg-orange-500',
  [UserRole.CASHIER]: 'bg-purple-500',
  [UserRole.MANAGER]: 'bg-red-500',
  [UserRole.OWNER]: 'bg-zinc-700',
};

const statusColors: Record<string, string> = {
  [UserStatus.ACTIVE]: 'bg-green-500',
  [UserStatus.OFF_DUTY]: 'bg-gray-500',
};

const shiftOptions = [ShiftType.MORNING, ShiftType.EVENING, ShiftType.FULL_DAY] as const;

const AdminStaffPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: staff, isLoading, isError } = useStaffQuery();
  const updateStatus = useUpdateStaffStatus();
  const updateShift = useUpdateStaffShift();
  const toast = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleStatusChange = async (staffId: string) => {
    const member = staff?.find((s: StaffMember) => s.id === staffId);
    if (member) {
      const newStatus = member.status === UserStatus.ACTIVE ? UserStatus.OFF_DUTY : UserStatus.ACTIVE;
      try {
        await updateStatus.mutateAsync({ staffId, status: newStatus });
        toast.success(t('staff.toast_update_success', 'Staff information updated successfully.'));
      } catch (error) {
        toast.error(t('staff.toast_error', 'An error occurred during staff operation.'));
      }
    }
  };

  const handleShiftChange = async (staffId: string, newShift: ShiftType) => {
    try {
      await updateShift.mutateAsync({ staffId, shift: newShift });
      toast.success(t('staff.toast_update_success', 'Staff information updated successfully.'));
    } catch (error) {
      toast.error(t('staff.toast_error', 'An error occurred during staff operation.'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('staff.title', 'Staff Management')}</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400">{t('staff.loading', 'Loading staff members...')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('staff.title', 'Staff Management')}</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          <p>{t('staff.error', 'Failed to load staff. Please try again later.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{t('staff.title', 'Staff Management')}</h1>
            <p className="text-zinc-400 mt-1">{t('staff.desc', 'Manage staff members and their shifts.')}</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} />
            {t('staff.add_staff', 'Add New Staff')}
          </button>
        </div>
      </div>

      {staff && staff.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">{t('staff.no_staff', 'No staff members found.')}</p>
          <p className="text-zinc-600 text-sm">{t('staff.no_staff_desc', 'Add staff members to your team.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff?.map((member: StaffMember) => (
            <div
              key={member.id}
              className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 hover:border-zinc-700 transition-colors"
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{member.fullName}</h3>
                <p className="text-zinc-400 text-sm mt-1">ID: {member.id}</p>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${roleColors[member.role] || 'bg-zinc-600'}`}
                >
                  {t(`staff.role_${member.role.toLowerCase()}`, member.role)}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${statusColors[member.status]}`}
                >
                  {member.status === UserStatus.ACTIVE ? t('staff.status_active', 'Active') : t('staff.status_off_duty', 'Off-duty')}
                </span>
              </div>

              {/* Shift Info */}
              <div className="mb-5 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">{t('staff.current_shift', 'Current Shift')}</p>
                <p className="text-white font-semibold">{t(`staff.shift_${member.shift.toLowerCase().replace(' ', '_')}`, member.shift)}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Status Toggle */}
                <button
                  onClick={() => handleStatusChange(member.id)}
                  className={`w-full px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${member.status === UserStatus.ACTIVE
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {member.status === UserStatus.ACTIVE ? t('staff.set_off_duty', 'Set Off-duty') : t('staff.set_active', 'Set Active')}
                </button>

                {/* Shift Selector */}
                <div className="flex gap-1">
                  {shiftOptions.map((shift) => (
                    <button
                      key={shift}
                      onClick={() => handleShiftChange(member.id, shift)}
                      className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${member.shift === shift
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                        }`}
                    >
                      {shift === ShiftType.FULL_DAY ? t('staff.shift_full', 'Full') : t(`staff.shift_${shift.toLowerCase()}`, shift.slice(0, 3))}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default AdminStaffPage;
