import { create } from 'zustand';

export interface MenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Main' | 'Drinks' | 'Desserts';
  price: number;
  availability: 'Available' | 'Out of Stock';
  imageUrl?: string;
}

interface MenuState {
  items: MenuItem[];
  toggleAvailability: (id: string) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  items: [
    { id: '1', name: 'Caesar Salad', category: 'Starters', price: 8.5, availability: 'Available' },
    { id: '2', name: 'Garlic Bread', category: 'Starters', price: 5.0, availability: 'Available' },
    { id: '3', name: 'Pasta Carbonara', category: 'Main', price: 14.5, availability: 'Available' },
    { id: '4', name: 'Grilled Salmon', category: 'Main', price: 18.0, availability: 'Out of Stock' },
    { id: '5', name: 'Beef Burger', category: 'Main', price: 12.5, availability: 'Available' },
    { id: '6', name: 'Iced Tea', category: 'Drinks', price: 3.5, availability: 'Available' },
    { id: '7', name: 'Espresso', category: 'Drinks', price: 4.0, availability: 'Available' },
    { id: '8', name: 'Orange Juice', category: 'Drinks', price: 3.0, availability: 'Available' },
    { id: '9', name: 'Chocolate Cake', category: 'Desserts', price: 7.5, availability: 'Available' },
    { id: '10', name: 'Cheesecake', category: 'Desserts', price: 8.0, availability: 'Out of Stock' },
  ],
  toggleAvailability: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              availability: item.availability === 'Available' ? 'Out of Stock' : 'Available',
            }
          : item
      ),
    })),
}));
