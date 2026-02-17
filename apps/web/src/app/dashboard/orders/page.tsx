'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrdersQuery, useUpdateOrderStatus, type DashboardOrder } from '@/lib/api/useOrdersQuery';
import { OrderStatus } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  [OrderStatus.PENDING]: 'bg-amber-500',
  [OrderStatus.PREPARING]: 'bg-blue-500',
  [OrderStatus.READY]: 'bg-emerald-500',
  [OrderStatus.COMPLETED]: 'bg-zinc-500',
  [OrderStatus.CANCELLED]: 'bg-red-500',
};

const AdminOrdersPage = () => {
  const { t } = useTranslation();
  const { data: orders, isLoading, isError } = useOrdersQuery();
  const updateStatus = useUpdateOrderStatus();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus.mutate({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-8">
        <h1 className="text-3xl font-black tracking-tight text-white">{t('orders.title', 'Orders Management')}</h1>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-zinc-950 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-white">{t('orders.title', 'Orders Management')}</h1>
        <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">{t('orders.desc', 'Manage and track all customer orders.')}</p>
      </div>

      {orders && orders.length === 0 ? (
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 font-bold uppercase tracking-widest mb-2">{t('orders.no_orders', 'No orders available yet.')}</p>
          <p className="text-zinc-600 text-sm">{t('orders.no_orders_desc', 'Orders will appear here once customers place them.')}</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('orders.order_id', 'Order #')}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('orders.table', 'Table')}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('common.status', 'Status')}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('common.time', 'Time')}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('common.total', 'Total')}</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('common.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders?.map((order: DashboardOrder) => (
                  <React.Fragment key={order.id}>
                    <tr
                      className={cn(
                        "hover:bg-zinc-800/50 transition-colors cursor-pointer group",
                        expandedOrder === order.id && "bg-zinc-800/30"
                      )}
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <td className="px-6 py-5 text-sm font-black text-white">{order.orderNumber}</td>
                      <td className="px-6 py-5 text-sm font-bold text-zinc-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          {order.tableName}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest",
                            statusColors[order.status] || 'bg-zinc-700'
                          )}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-500 font-medium tabular-nums">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-white tabular-nums">${Number(order.total).toFixed(2)}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                          {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                            <button
                              onClick={() => handleStatusChange(order.id, OrderStatus.CANCELLED)}
                              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              {t('orders.cancel', 'Cancel')}
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            {expandedOrder === order.id ? t('common.hide', 'Hide') : t('common.details', 'Details')}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr className="bg-zinc-900/50">
                        <td colSpan={6} className="px-8 py-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{item.quantity}x</span>
                                </div>
                                <p className="font-bold text-zinc-100">{item.name}</p>
                                {item.modifiers.length > 0 && (
                                  <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">{item.modifiers.join(', ')}</p>
                                )}
                                {item.note && (
                                  <div className="mt-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                    <p className="text-[10px] text-yellow-500 font-black uppercase italic">Note: {item.note}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
