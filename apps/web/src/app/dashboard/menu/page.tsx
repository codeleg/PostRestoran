'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useMenuQuery, useToggleAvailability, type MenuItem } from '@/lib/api/useMenuQuery';
import AddProductModal from '@/components/admin/AddProductModal';
import AddStockModal from '@/components/admin/AddStockModal';
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
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);

  const handleToggleAvailability = (itemId: string) => {
    toggleAvailability.mutate(itemId);
  };

  const handleRestock = (item: MenuItem) => {
    setSelectedProduct(item);
    setIsAddStockOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedProduct(item);
    setIsAddProductOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsAddProductOpen(true);
  }

  // Helper to determine status display
  const getStatusDisplay = (item: MenuItem) => {
    const stockQty = item.inventory?.quantity ?? 0;

    // Critical: If stock is <= 0, it is Out of Stock regardless of Active status
    if (stockQty <= 0) {
      return {
        text: t('menu.stock_out', 'Out of Stock'),
        color: 'bg-red-500',
        textColor: 'text-red-500',
        icon: '✗'
      };
    }

    // If stock > 0 but Inactive, it is "Hidden" or "Unavailable"
    if (!item.isActive) {
      return {
        text: t('menu.unavailable', 'Unavailable'),
        color: 'bg-zinc-500',
        textColor: 'text-zinc-500',
        icon: '○'
      };
    }

    // Default: Available
    return {
      text: t('tables.status_available', 'Available'),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500', // for text display
      icon: '✓'
    };
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
            onClick={handleAddProduct}
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
                {groupedItems[category]?.map((item: MenuItem) => {
                  const status = getStatusDisplay(item);
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-5 transition-colors ${item.isActive && (item.inventory?.quantity ?? 0) > 0
                        ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                        : 'bg-zinc-900/50 border-zinc-800/50 opacity-75'
                        }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <p className={`text-sm mt-1 flex items-center gap-2 ${status.textColor || 'text-zinc-400'}`}>
                            <span>{status.icon} {status.text}</span>
                            {item.inventory && (
                              <span className="text-xs text-zinc-500">
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
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => item.isActive ? handleToggleAvailability(item.id) : handleRestock(item)}
                          className={`flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${item.isActive
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                        >
                          {item.isActive ? t('menu.stock_out', 'Stock Out') : t('menu.restock', 'Restock')}
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                        >
                          {t('common.edit', 'Edit')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal (Add & Edit) */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        product={selectedProduct}
      />

      {/* Add Stock Modal */}
      {selectedProduct && isAddStockOpen && (
        <AddStockModal
          isOpen={isAddStockOpen}
          onClose={() => {
            setIsAddStockOpen(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          currentStock={selectedProduct.inventory?.quantity || 0}
        />
      )}
    </div>
  );
};


export default AdminMenuPage;
