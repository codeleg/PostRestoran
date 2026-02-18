import { create } from 'zustand';

export interface Table {
  id: string;
  name: string;
  number: number;
  capacity: number;
  status: 'Available' | 'Occupied' | 'Reserved';
  area: string;
}

interface TablesState {
  tables: Table[];
  updateTableStatus: (id: string, status: Table['status']) => void;
}

export const useTablesStore = create<TablesState>((set) => ({
  tables: [
    { id: '1', name: 'T1', number: 1, capacity: 2, status: 'Available', area: 'Indoor' },
    { id: '2', name: 'T2', number: 2, capacity: 4, status: 'Occupied', area: 'Indoor' },
    { id: '3', name: 'T3', number: 3, capacity: 6, status: 'Reserved', area: 'Outdoor' },
    { id: '4', name: 'T4', number: 4, capacity: 4, status: 'Available', area: 'Indoor' },
    { id: '5', name: 'T5', number: 5, capacity: 8, status: 'Occupied', area: 'Outdoor' },
  ],
  updateTableStatus: (id, status) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === id ? { ...table, status } : table
      ),
    })),
}));
