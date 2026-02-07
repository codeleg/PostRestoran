'use client';

import React from 'react';
import { useMockOrdersQuery, queryClient } from '@/lib/mockOrdersQuery';
import { useOrdersStore } from '@/store/useOrdersStore';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500',
  Preparing: 'bg-blue-500',
  Completed: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

const AdminOrdersPage: React.FC = () => {
  const { data: orders, isLoading, isError } = useMockOrdersQuery();
  const { updateOrderStatus } = useOrdersStore();

  const handleStatusChange = (orderId: string, newStatus: 'Pending' | 'Preparing' | 'Completed' | 'Cancelled') => {
    updateOrderStatus(orderId, newStatus);
    // Invalidate the query to refetch from store
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Orders</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Orders</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          <p>Failed to load orders. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Orders</h1>
        <p className="text-zinc-400">Manage and track all customer orders.</p>
      </div>

      {orders && orders.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">No orders available yet.</p>
          <p className="text-zinc-600 text-sm">Orders will appear here once customers place them.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">{order.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleStatusChange(order.id, 'Preparing')}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Mark Preparing
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, 'Completed')}
                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Mark Completed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
