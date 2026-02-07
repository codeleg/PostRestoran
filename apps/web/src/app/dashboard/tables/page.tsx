'use client';

import React from 'react';
import { useMockTablesQuery, queryClient } from '@/lib/mockTablesQuery';
import { useTablesStore } from '@/store/useTablesStore';

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

const AdminTablesPage: React.FC = () => {
  const { data: tables, isLoading, isError } = useMockTablesQuery();
  const { updateTableStatus } = useTablesStore();

  const handleStatusChange = (tableId: string, newStatus: 'Available' | 'Occupied' | 'Reserved') => {
    updateTableStatus(tableId, newStatus);
    // Invalidate the query to refetch from store
    queryClient.invalidateQueries({ queryKey: ['tables'] });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Tables</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400">Loading tables...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Tables</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          <p>Failed to load tables. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Tables</h1>
        <p className="text-zinc-400">Manage restaurant floor and seating capacity.</p>
      </div>

      {tables && tables.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">No tables configured yet.</p>
          <p className="text-zinc-600 text-sm">Add tables to your restaurant layout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables?.map((table) => (
            <div
              key={table.id}
              className={`rounded-xl border p-6 transition-colors ${statusBgColors[table.status]} border-zinc-700 hover:border-zinc-600`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Table {table.number}</p>
                  <h3 className="text-lg font-bold text-white mt-1">{table.area}</h3>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${statusColors[table.status]}`}
                >
                  {table.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Capacity</span>
                  <span className="text-white font-semibold">{table.capacity} Seats</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(table.id, 'Available')}
                  className="flex-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Free
                </button>
                <button
                  onClick={() => handleStatusChange(table.id, 'Occupied')}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Occupied
                </button>
                <button
                  onClick={() => handleStatusChange(table.id, 'Reserved')}
                  className="flex-1 px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Reserve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTablesPage;
