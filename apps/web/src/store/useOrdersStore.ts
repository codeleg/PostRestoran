import { create } from 'zustand';
import { OrderStatus } from '@/lib/types';

export interface OrderItem {
  name: string;
  quantity: number;
  modifiers: string[];
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableName: string;
  status: OrderStatus;
  date: string; // Keep for compatibility if needed
  createdAt: string;
  total: number;
  items: OrderItem[];
}

interface OrdersState {
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [
    {
      id: '1',
      orderNumber: 'ORD-001',
      tableName: 'Table 1',
      status: OrderStatus.PENDING,
      date: '2026-02-07',
      createdAt: new Date().toISOString(),
      total: 25.5,
      items: [
        { name: 'Burger', quantity: 1, modifiers: ['No Onions'], note: 'Extra spicy' }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      tableName: 'Table 4',
      status: OrderStatus.PREPARING,
      date: '2026-02-06',
      createdAt: new Date().toISOString(),
      total: 15.0,
      items: [
        { name: 'Pizza', quantity: 1, modifiers: [], note: '' }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      tableName: 'Table 2',
      status: OrderStatus.COMPLETED,
      date: '2026-02-05',
      createdAt: new Date().toISOString(),
      total: 30.0,
      items: [
        { name: 'Pasta', quantity: 2, modifiers: [], note: '' }
      ]
    },
  ],
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
      ),
    })),
}));