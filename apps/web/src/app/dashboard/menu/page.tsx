'use client';

import React, { useState } from 'react';
import { useMockMenuQuery, queryClient } from '@/lib/mockMenuQuery';
import { useMenuStore, MenuItem } from '@/store/useMenuStore';
import AddProductModal from '@/components/admin/AddProductModal';
import { Plus } from 'lucide-react';

const categoryOrder: Record<string, number> = {
  'Starters': 0,
  'Main': 1,
  'Drinks': 2,
  'Desserts': 3,
};

const AdminMenuPage: React.FC = () => {
  const { data: items, isLoading, isError } = useMockMenuQuery();
  const { toggleAvailability } = useMenuStore();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handleToggleAvailability = (itemId: string) => {
    toggleAvailability(itemId);
    // Invalidate the query to refetch from store
    queryClient.invalidateQueries({ queryKey: ['menu'] });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Menu</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400">Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Menu</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          <p>Failed to load menu items. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Group items by category
  const groupedItems = items?.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>) || {};

  // Sort categories
  const sortedCategories = Object.keys(groupedItems).sort(
    (a, b) => (categoryOrder[a] ?? 99) - (categoryOrder[b] ?? 99)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Menu</h1>
            <p className="text-zinc-400">Manage restaurant menu items and availability.</p>
          </div>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>
      </div>

      {items && items.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">No menu items configured yet.</p>
          <p className="text-zinc-600 text-sm">Add menu items to your restaurant menu.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedCategories.map((category) => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{category}</h2>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedItems[category]?.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-5 transition-colors ${
                      item.availability === 'Available'
                        ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                        : 'bg-zinc-900/50 border-zinc-800/50 opacity-75'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-zinc-400 text-sm mt-1">
                          {item.availability === 'Available' ? '✓ Available' : '✗ Out of Stock'}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-teal-400">${item.price.toFixed(2)}</span>
                    </div>

                    {/* Availability Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${
                          item.availability === 'Available'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {item.availability}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                          item.availability === 'Available'
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {item.availability === 'Available' ? 'Stock Out' : 'Restock'}
                      </button>
                      <button className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
    </div>
  );
};

export default AdminMenuPage;
