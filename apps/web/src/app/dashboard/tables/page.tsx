'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, Square, Trash2, Users, Table as TableIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useZonesQuery, useUpdateTableStatus, useDeleteTable } from '@/lib/api/useTablesQuery';
import { useToast } from '@/hooks/useToast';
import AddTableModal from '@/components/admin/AddTableModal';
import AddZoneModal from '@/components/admin/AddZoneModal';
import { TableManagementDrawer } from '@/features/tables/components/table-management-drawer';
import { cn } from '@/lib/utils';

// Helper for status colors (matching Live View)
const getStatusColor = (status: string, type: 'bg' | 'text' | 'border' | 'shadow') => {
  const normalized = status.toUpperCase();
  switch (normalized) {
    case 'AVAILABLE':
    case 'OPEN':
      if (type === 'bg') return 'bg-emerald-500';
      if (type === 'text') return 'text-emerald-500';
      if (type === 'border') return 'border-emerald-500';
      if (type === 'shadow') return 'shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      return '';
    case 'OCCUPIED':
      if (type === 'bg') return 'bg-rose-500';
      if (type === 'text') return 'text-rose-500';
      if (type === 'border') return 'border-rose-500';
      if (type === 'shadow') return 'shadow-[0_0_8px_rgba(244,63,94,0.5)]';
      return '';
    case 'RESERVED':
      if (type === 'bg') return 'bg-amber-500';
      if (type === 'text') return 'text-amber-500';
      if (type === 'border') return 'border-amber-500';
      if (type === 'shadow') return 'shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      return '';
    default:
      if (type === 'bg') return 'bg-slate-500';
      if (type === 'text') return 'text-slate-500';
      if (type === 'border') return 'border-slate-500';
      if (type === 'shadow') return 'shadow-none';
      return '';
  }
};

const AdminTablesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: zones, isLoading, isError, refetch } = useZonesQuery();
  const deleteTable = useDeleteTable();
  const toast = useToast();

  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<{ id: string; name: string } | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);

  // Set initial active zone
  useEffect(() => {
    if (zones && zones.length > 0 && !activeZoneId) {
      setActiveZoneId(zones[0].id);
    }
  }, [zones, activeZoneId]);

  const handleDeleteTable = async (e: React.MouseEvent, tableId: string, tableNumber: string) => {
    e.stopPropagation(); // Prevent opening drawer
    if (!window.confirm(t('tables.confirm_delete', `Are you sure you want to delete Table ${tableNumber}?`))) {
      return;
    }

    try {
      await deleteTable.mutateAsync(tableId);
      toast.success(t('tables.toast_delete_success', 'Table deleted successfully.'));
      refetch(); // Refresh zones/tables
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

  const currentZone = zones?.find((z: any) => z.id === activeZoneId) || (zones && zones.length > 0 ? zones[0] : null);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

      {/* Zone Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {zones?.map((zone: any) => (
          <button
            key={zone.id}
            onClick={() => setActiveZoneId(zone.id)}
            className={cn(
              "h-10 px-6 rounded-lg font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-2",
              activeZoneId === zone.id
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
            )}
          >
            {t(`tables.area_${zone.name.toLowerCase().replace(' ', '_')}`, zone.name)}
            <span className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-black",
              activeZoneId === zone.id ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"
            )}>
              {zone.tables.length}
            </span>
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      {!currentZone || currentZone.tables.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">{t('tables.no_tables_in_zone', 'No tables in this zone.')}</p>
          <p className="text-zinc-600 text-sm">{t('tables.add_table_desc', 'Use the "Add Table" button to populate this zone.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentZone.tables.map((table: any) => {
            const statusColor = getStatusColor(table.status, 'text');
            const statusBorder = getStatusColor(table.status, 'border');
            const statusBg = getStatusColor(table.status, 'bg');
            const statusShadow = getStatusColor(table.status, 'shadow');

            return (
              <div
                key={table.id}
                onClick={() => setSelectedTable({ id: table.id, name: table.name })}
                className={cn(
                  "relative group rounded-xl border-2 p-5 flex flex-col justify-between h-40 transition-all cursor-pointer hover:scale-[1.02] bg-slate-900",
                  table.status === 'AVAILABLE' ? "border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/5" :
                    table.status === 'OCCUPIED' ? "border-rose-500/20 hover:border-rose-500 hover:bg-rose-500/5" :
                      table.status === 'RESERVED' ? "border-amber-500/20 hover:border-amber-500 hover:bg-amber-500/5" :
                        "border-zinc-800"
                )}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black text-white">{table.name}</h3>
                  <div className={cn("w-2.5 h-2.5 rounded-full", statusBg, statusShadow)} />
                </div>

                {/* Info */}
                <div className="flex items-center gap-2 text-zinc-500">
                  <Users size={14} />
                  <span className="text-xs font-bold">{table.capacity} Seats</span>
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center justify-between mt-auto pt-4">
                  <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-950", statusColor)}>
                    {table.status}
                  </span>

                  <button
                    onClick={(e) => handleDeleteTable(e, table.id, table.name)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 hover:text-red-500 text-zinc-600 transition-colors"
                    title={t('common.delete', 'Delete') as string}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals & Drawers */}
      <AddTableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />
      <AddZoneModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
      />

      {selectedTable && (
        <TableManagementDrawer
          isOpen={!!selectedTable}
          onClose={() => {
            setSelectedTable(null);
            refetch();
          }}
          tableId={selectedTable.id}
          tableName={selectedTable.name}
        />
      )}
    </div>
  );
};

export default AdminTablesPage;
