'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useMenuQuery, useToggleAvailability, type MenuItem } from '@/lib/api/useMenuQuery';
import AddProductModal from '@/components/admin/AddProductModal';
import { Plus, ShoppingBag } from 'lucide-react';

const categoryOrder: Record<string, number> = {
  'Starters': 0,
  'Main': 1,
  'Pizza': 2,
  'Food': 3,
  'Drinks': 4,
  'Beverage': 5,
  'Dessert': 6,
  'Desserts': 6,
};

const AdminMenuPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: items, isLoading, isError } = useMenuQuery();
  const toggleAvailability = useToggleAvailability();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handleToggleAvailability = (itemId: string) => {
    toggleAvailability.mutate(itemId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('menu.title', 'Menu Management')}</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400">{t('menu.loading', 'Loading menu items...')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('menu.title', 'Menu Management')}</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          <p>{t('menu.error', 'Failed to load menu items. Please try again later.')}</p>
        </div>
      </div>
    );
  }

  const menuItems = (items as unknown as MenuItem[]) || [];

  // Group items by category
  const groupedItems = menuItems.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
    const categoryName = item.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Sort categories
  const sortedCategories = Object.keys(groupedItems).sort(
    (a, b) => (categoryOrder[a] ?? 99) - (categoryOrder[b] ?? 99)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t('menu.title', 'Menu Management')}</h1>
            <p className="text-zinc-400">{t('menu.no_items_desc', 'Manage restaurant menu items and availability.')}</p>
          </div>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            {t('menu.add_product', 'Add Product')}
          </button>
          <Link
            href="/dashboard/inventory"
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors border border-zinc-700"
          >
            <ShoppingBag className="h-5 w-5" />
            Stock Management
          </Link>
        </div>
      </div>

      {menuItems.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">{t('menu.no_items', 'No menu items configured yet.')}</p>
          <p className="text-zinc-600 text-sm">{t('menu.no_items_desc', 'Add menu items to your restaurant menu.')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedCategories.map((category) => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">
                  {t(`category.${category.toLowerCase().replace(' ', '_')}`, category)}
                </h2>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedItems[category]?.map((item: MenuItem) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-5 transition-colors ${item.isActive
                      ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      : 'bg-zinc-900/50 border-zinc-800/50 opacity-75'
                      }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-zinc-400 text-sm mt-1">
                          {item.isActive
                            ? `✓ ${t('tables.status_available', 'Available')}`
                            : `✗ ${t('menu.stock_out', 'Out of Stock')}`}
                          {item.inventory && (
                            <span className="ml-2 text-xs text-zinc-500">
                              ({item.inventory.quantity} in stock)
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-teal-400">${Number(item.price).toFixed(2)}</span>
                    </div>

                    {/* Availability Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${item.isActive
                          ? 'bg-emerald-500' // Changed to emerald for consistency
                          : 'bg-red-500'
                          }`}
                      >
                        {item.isActive ? t('tables.status_available', 'Available') : t('menu.stock_out', 'Out of Stock')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${item.isActive
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                      >
                        {item.isActive ? t('menu.stock_out', 'Stock Out') : t('menu.restock', 'Restock')}
                      </button>
                      <button className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                        {t('common.edit', 'Edit')}
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
