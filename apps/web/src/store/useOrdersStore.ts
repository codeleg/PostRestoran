import { create } from 'zustand';

export interface Order {
  id: string;
  status: 'Pending' | 'Preparing' | 'Completed' | 'Cancelled';
  date: string;
  total: number;
}

interface OrdersState {
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [
    { id: '1', status: 'Pending', date: '2026-02-07', total: 25.5 },
    { id: '2', status: 'Preparing', date: '2026-02-06', total: 15.0 },
    { id: '3', status: 'Completed', date: '2026-02-05', total: 30.0 },
  ],
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
      ),
    })),
}));