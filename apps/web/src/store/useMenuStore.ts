import { create } from 'zustand';

export interface MenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Main' | 'Drinks' | 'Desserts';
  price: number;
  availability: 'Available' | 'Out of Stock';
  image?: string;
  inventory?: {
    quantity: number;
  };
  isActive?: boolean;
}

interface MenuState {
  items: MenuItem[];
  toggleAvailability: (id: string) => void;
  addMenuItem: (name: string, category: MenuItem['category'], price: number, availability: MenuItem['availability']) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  items: [
    { id: '1', name: 'Caesar Salad', category: 'Starters', price: 8.5, availability: 'Available', isActive: true, inventory: { quantity: 10 } },
    { id: '2', name: 'Garlic Bread', category: 'Starters', price: 5.0, availability: 'Available', isActive: true, inventory: { quantity: 15 } },
    { id: '3', name: 'Pasta Carbonara', category: 'Main', price: 14.5, availability: 'Available', isActive: true, inventory: { quantity: 8 } },
    { id: '4', name: 'Grilled Salmon', category: 'Main', price: 18.0, availability: 'Out of Stock', isActive: false, inventory: { quantity: 0 } },
    { id: '5', name: 'Beef Burger', category: 'Main', price: 12.5, availability: 'Available', isActive: true, inventory: { quantity: 12 } },
    { id: '6', name: 'Iced Tea', category: 'Drinks', price: 3.5, availability: 'Available', isActive: true, inventory: { quantity: 50 } },
    { id: '7', name: 'Espresso', category: 'Drinks', price: 4.0, availability: 'Available', isActive: true, inventory: { quantity: 40 } },
    { id: '8', name: 'Orange Juice', category: 'Drinks', price: 3.0, availability: 'Available', isActive: true, inventory: { quantity: 30 } },
    { id: '9', name: 'Chocolate Cake', category: 'Desserts', price: 7.5, availability: 'Available', isActive: true, inventory: { quantity: 5 } },
    { id: '10', name: 'Cheesecake', category: 'Desserts', price: 8.0, availability: 'Out of Stock', isActive: false, inventory: { quantity: 0 } },
  ],
  toggleAvailability: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
            ...item,
            isActive: !item.isActive,
            availability: !item.isActive ? 'Available' : 'Out of Stock',
          }
          : item
      ),
    })),
  addMenuItem: (name, category, price, availability) =>
    set((state) => {
      const newId = (Math.max(...state.items.map((i) => parseInt(i.id))) + 1).toString();
      return {
        items: [
          ...state.items,
          {
            id: newId,
            name,
            category,
            price,
            availability,
          },
        ],
      };
    }),
}));
