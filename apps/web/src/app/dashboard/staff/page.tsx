'use client';

import React from 'react';
import { useMockStaffQuery, queryClient } from '@/lib/mockStaffQuery';
import { useStaffStore } from '@/store/useStaffStore';

const roleColors: Record<string, string> = {
  'Waiter': 'bg-blue-500',
  'Chef': 'bg-orange-500',
  'Cashier': 'bg-purple-500',
  'Manager': 'bg-red-500',
};

const statusColors: Record<string, string> = {
  'Active': 'bg-green-500',
  'Off-duty': 'bg-gray-500',
};

const shiftOptions = ['Morning', 'Evening', 'Full Day'] as const;

const AdminStaffPage: React.FC = () => {
  const { data: staff, isLoading, isError } = useMockStaffQuery();
  const { updateStaffStatus, updateStaffShift } = useStaffStore();

  const handleStatusChange = (staffId: string) => {
    const member = staff?.find((s) => s.id === staffId);
    if (member) {
      updateStaffStatus(
        staffId,
        member.status === 'Active' ? 'Off-duty' : 'Active'
      );
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  };

  const handleShiftChange = (staffId: string, newShift: 'Morning' | 'Evening' | 'Full Day') => {
    updateStaffShift(staffId, newShift);
    queryClient.invalidateQueries({ queryKey: ['staff'] });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Staff</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400">Loading staff members...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Staff</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          <p>Failed to load staff. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Staff</h1>
        <p className="text-zinc-400">Manage staff members and their shifts.</p>
      </div>

      {staff && staff.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">No staff members found.</p>
          <p className="text-zinc-600 text-sm">Add staff members to your team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff?.map((member) => (
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
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${roleColors[member.role]}`}
                >
                  {member.role}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${statusColors[member.status]}`}
                >
                  {member.status}
                </span>
              </div>

              {/* Shift Info */}
              <div className="mb-5 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Current Shift</p>
                <p className="text-white font-semibold">{member.shift}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Status Toggle */}
                <button
                  onClick={() => handleStatusChange(member.id)}
                  className={`w-full px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                    member.status === 'Active'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {member.status === 'Active' ? 'Set Off-duty' : 'Set Active'}
                </button>

                {/* Shift Selector */}
                <div className="flex gap-1">
                  {shiftOptions.map((shift) => (
                    <button
                      key={shift}
                      onClick={() => handleShiftChange(member.id, shift)}
                      className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                        member.shift === shift
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {shift === 'Full Day' ? 'Full' : shift.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStaffPage;
