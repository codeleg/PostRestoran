'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, Square, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTablesQuery, useUpdateTableStatus, useDeleteTable } from '@/lib/api/useTablesQuery';
import { useToast } from '@/hooks/useToast';
import AddTableModal from '@/components/admin/AddTableModal';
import AddZoneModal from '@/components/admin/AddZoneModal';

const statusColors: Record<string, string> = {
  Available: 'bg-green-500',
  Occupied: 'bg-red-500',
  Reserved: 'bg-yellow-500',
};

const statusBgColors: Record<string, string> = {
  Available: 'bg-green-500/10',
  Occupied: 'bg-red-500/10',
  Reserved: 'bg-yellow-500/10',
};

interface Table {
  id: string;
  number: string | number;
  area: string;
  status: 'Available' | 'Occupied' | 'Reserved';
  capacity: number;
}

const AdminTablesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: tables, isLoading, isError } = useTablesQuery();
  const updateStatus = useUpdateTableStatus();
  const deleteTable = useDeleteTable();
  const toast = useToast();

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);

  const handleStatusChange = async (tableId: string, newStatus: 'Available' | 'Occupied' | 'Reserved') => {
    try {
      await updateStatus.mutateAsync({ tableId, status: newStatus });
      toast.success(t('tables.toast_update_success', 'Table status updated successfully.'));
    } catch (error) {
      toast.error(t('tables.toast_error', 'An error occurred during table operation.'));
    }
  };

  const handleDeleteTable = async (tableId: string, tableNumber: string) => {
    if (!window.confirm(t('tables.confirm_delete', `Are you sure you want to delete Table ${tableNumber}?`))) {
      return;
    }

    try {
      await deleteTable.mutateAsync(tableId);
      toast.success(t('tables.toast_delete_success', 'Table deleted successfully.'));
    } catch (error) {
      toast.error(t('tables.toast_error', 'An error occurred during table operation.'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('tables.title', 'Tables Management')}</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400">{t('tables.loading', 'Loading tables...')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('tables.title', 'Tables Management')}</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          <p>{t('tables.error', 'Failed to load tables. Please try again later.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{t('tables.title', 'Tables Management')}</h1>
            <p className="text-zinc-400 mt-1">{t('tables.desc', 'Manage restaurant floor and seating capacity.')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tables"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold text-sm uppercase tracking-wider transition-all active:scale-95 border border-zinc-700"
            >
              {t('tables.back_to_live', 'Live View')}
            </Link>
            <button
              onClick={() => setIsZoneModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-wider transition-all active:scale-95 border border-zinc-700"
            >
              <LayoutGrid size={18} />
              {t('tables.add_zone', 'Add Zone')}
            </button>
            <button
              onClick={() => setIsTableModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              <Square size={18} />
              {t('tables.add_table', 'Add Table')}
            </button>
          </div>
        </div>
      </div>

      {tables && tables.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">{t('tables.no_tables', 'No tables configured yet.')}</p>
          <p className="text-zinc-600 text-sm">{t('tables.no_tables_desc', 'Add tables to your restaurant layout.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables?.map((table: Table) => (
            <div
              key={table.id}
              className={`rounded-xl border p-6 transition-colors ${statusBgColors[table.status]} border-zinc-700 hover:border-zinc-600`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                    {t('common.table', 'Table')} {table.number}
                  </p>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {t(`tables.area_${table.area.toLowerCase().replace(' ', '_')}`, table.area)}
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${statusColors[table.status]}`}
                >
                  {t(`tables.status_${table.status.toLowerCase()}`, table.status)}
                </span>
                <button
                  onClick={() => handleDeleteTable(table.id, table.number.toString())}
                  className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                  title={t('common.delete', 'Delete')}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">{t('tables.capacity', 'Capacity')}</span>
                  <span className="text-white font-semibold">{table.capacity} {t('tables.seats', 'Seats')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(table.id, 'Available')}
                  className="flex-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {t('tables.action_free', 'Free')}
                </button>
                <button
                  onClick={() => handleStatusChange(table.id, 'Occupied')}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {t('tables.status_occupied', 'Occupied')}
                </button>
                <button
                  onClick={() => handleStatusChange(table.id, 'Reserved')}
                  className="flex-1 px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {t('tables.action_reserve', 'Reserve')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddTableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />
      <AddZoneModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
      />
    </div>
  );
};


export default AdminTablesPage;
