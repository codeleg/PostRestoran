'use client';

import { useTranslation } from 'react-i18next';
import { useOrdersQuery, useUpdateOrderStatus } from '@/lib/api/useOrdersQuery';
import { OrderStatus } from '@/lib/types';

const statusColors: Record<string, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-500',
  [OrderStatus.PREPARING]: 'bg-blue-500',
  [OrderStatus.COMPLETED]: 'bg-green-500',
  [OrderStatus.CANCELLED]: 'bg-red-500',
  // Map READY to same color as Completed if needed, or add specific color
  [OrderStatus.READY]: 'bg-green-500',
};

interface Order {
  id: string;
  status: OrderStatus;
  date: string;
  total: number;
}

const AdminOrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: orders, isLoading, isError } = useOrdersQuery();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    console.log(`[AdminOrdersPage] Button Clicked: Order=${orderId}, NewStatus=${newStatus}`);
    updateStatus.mutate({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('orders.title', 'Orders Management')}</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400">{t('orders.loading', 'Loading orders...')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('orders.title', 'Orders Management')}</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          <p>{t('orders.error', 'Failed to load orders. Please try again later.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('orders.title', 'Orders Management')}</h1>
        <p className="text-zinc-400">{t('orders.desc', 'Manage and track all customer orders.')}</p>
      </div>

      {orders && orders.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">{t('orders.no_orders', 'No orders available yet.')}</p>
          <p className="text-zinc-600 text-sm">{t('orders.no_orders_desc', 'Orders will appear here once customers place them.')}</p>
        </div>
      ) : (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">{t('orders.order_id', 'Order ID')}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">{t('common.status', 'Status')}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">{t('common.date', 'Date')}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">{t('common.total', 'Total')}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-100">{t('common.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders?.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">{order.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${statusColors[order.status]}`}
                      >
                        {t(`orders.status_${order.status.toLowerCase()}`, order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">${Number(order.total).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleStatusChange(order.id, OrderStatus.PREPARING)}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {t('orders.mark_preparing', 'Mark Preparing')}
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, OrderStatus.COMPLETED)}
                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {t('orders.mark_completed', 'Mark Completed')}
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
