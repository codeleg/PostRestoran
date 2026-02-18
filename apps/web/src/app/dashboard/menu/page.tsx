'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useMenuQuery, useToggleAvailability, useCategoriesQuery, type MenuItem, type Category } from '@/lib/api/useMenuQuery';
import AddProductModal from '@/components/admin/AddProductModal';
import AddStockModal from '@/components/admin/AddStockModal';
import CategoryManagementModal from '@/components/admin/CategoryManagementModal';
import { Plus, ShoppingBag, FolderTree, Sparkles, Pencil, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryOrder: Record<string, number> = {
  'Starters': 0,
  'Main': 1,
  'Pizza': 2,
  'Food': 3,
  'Drinks': 4,
  'Beverage': 5,
  'Dessert': 6,
  'Desserts': 6,
  'Uncategorized': 99,
};

const AdminMenuPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: items, isLoading: isItemsLoading } = useMenuQuery();
  const { data: categories, isLoading: isCategoriesLoading } = useCategoriesQuery();
  const toggleAvailability = useToggleAvailability();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    const stockQty = Number(item.inventory?.quantity ?? 0);

    // 1. Critical: If stock is 0 or less, it is physically Out of Stock
    if (stockQty <= 0) {
      return {
        text: t('menu.status_out_of_stock', 'Out of Stock'),
        color: 'bg-red-500',
        textColor: 'text-red-500',
        icon: '✗'
      };
    }

    // 2. If stock exists but it was manually deactivated
    if (!item.isActive) {
      return {
        text: t('menu.status_disabled', 'Disabled / Passive'),
        color: 'bg-zinc-500',
        textColor: 'text-zinc-500',
        icon: '○'
      };
    }

    // 3. Default: Available & Active
    return {
      text: t('menu.status_available', 'Available'),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      icon: '✓'
    };
  };

  // Scroll helper for horizontal lists
  const scrollContainer = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isItemsLoading || isCategoriesLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('menu.title', 'Menu Management')}</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400">{t('menu.loading', 'Loading menu items...')}</p>
        </div>
      </div>
    );
  }

  const menuItems = (items as unknown as MenuItem[]) || [];

  // Reusable Menu Card Component
  const MenuCard = ({ item }: { item: MenuItem }) => {
    const status = getStatusDisplay(item);
    return (
      <div
        className={cn(
          "min-w-[320px] snap-start rounded-2xl border p-5 transition-all bg-zinc-900 flex flex-col justify-between",
          item.isActive && (item.inventory?.quantity ?? 0) > 0
            ? "border-zinc-800 hover:border-emerald-500/50"
            : "border-zinc-800/50 opacity-75"
        )}
      >
        <div className="flex gap-4 mb-4">
          <div className="relative w-20 h-20 rounded-xl bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800">
            {item.image ? (
              <img
                src={`http://localhost:3001${item.image}`}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-800">
                <Sparkles size={24} strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-white line-clamp-2">{item.name}</h3>
              <span className="text-base font-black text-emerald-400 tabular-nums">₺{Number(item.price).toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1",
                status.color.replace('500', '500/10'),
                status.textColor
              )}>
                <span>{status.icon}</span>
                <span className="uppercase tracking-widest">{status.text}</span>
              </span>
              {item.inventory && (
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-800">
                  {item.inventory.quantity} {t('common.unit', 'ADET')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="flex-1 h-10 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
          >
            <Pencil size={14} />
            {t('common.edit', 'Edit')}
          </button>

          <button
            onClick={() => handleToggleAvailability(item.id)}
            disabled={!item.isActive && Number(item.inventory?.quantity ?? 0) <= 0}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 border",
              item.isActive
                ? "bg-zinc-800 text-emerald-500 border-zinc-700 hover:bg-zinc-700"
                : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 disabled:opacity-30 disabled:grayscale"
            )}
            title={!item.isActive && Number(item.inventory?.quantity ?? 0) <= 0 ? t('menu.cannot_activate_no_stock', 'Cannot activate without stock') : (item.isActive ? t('menu.deactivate', 'Deactivate') : t('menu.activate', 'Activate'))}
          >
            {item.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>
    );
  };

  // Group items by category (using category list as source)
  const groupedItems: Record<string, MenuItem[]> = {};

  // Initialize from categories list to ensure empty categories are visible
  categories?.forEach((cat: Category) => {
    groupedItems[cat.name] = [];
  });

  // Add Uncategorized bucket
  groupedItems['Uncategorized'] = [];

  // Sorting alphabetically by name for stability
  const sortedMenuItems = [...menuItems].sort((a, b) => a.name.localeCompare(b.name));

  sortedMenuItems.forEach((item: MenuItem) => {
    const categoryName = item.category || 'Uncategorized';
    if (!groupedItems[categoryName]) {
      // Handle the case where a product has a category that isn't in our list (shouldn't happen with our delete logic, but good for safety)
      groupedItems['Uncategorized'].push(item);
    } else {
      groupedItems[categoryName].push(item);
    }
  });

  // Sort categories: Categories from list first, then Uncategorized if it has items
  const sortedCategories = [
    ...(categories?.map((c: Category) => c.name) || [])
  ];

  if (groupedItems['Uncategorized'].length > 0) {
    sortedCategories.push('Uncategorized');
  }

  return (
    <div className="space-y-8 min-h-screen">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t('menu.title', 'Menu Management')}</h1>
            <p className="text-zinc-400">{t('menu.no_items_desc', 'Manage restaurant menu items and availability.')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-medium transition-all border border-zinc-700 active:scale-95"
            >
              <FolderTree className="h-5 w-5" />
              {t('menu.manage_categories', 'Manage Categories')}
            </button>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all active:scale-95"
            >
              <Plus className="h-5 w-5" />
              {t('menu.add_product', 'Add Product')}
            </button>
            <Link
              href="/dashboard/inventory"
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-all border border-zinc-700 active:scale-95"
            >
              <ShoppingBag className="h-5 w-5" />
              Stock Management
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Category Navigation */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-zinc-800 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "h-9 px-4 rounded-lg font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all",
            selectedCategory === null
              ? "bg-white text-black"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
          )}
        >
          {t('common.all', 'All Items')}
        </button>
        {sortedCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "h-9 px-4 rounded-lg font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all border",
              selectedCategory === category
                ? "bg-emerald-500 border-emerald-500 text-slate-950"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"
            )}
          >
            {category === 'Uncategorized' ? t('category.uncategorized', 'Uncategorized') : t(`category.${category.toLowerCase().replace(' ', '_')}`, category)}
          </button>
        ))}
      </div>

      {menuItems.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 mb-2">{t('menu.no_items', 'No menu items configured yet.')}</p>
          <p className="text-zinc-600 text-sm">{t('menu.no_items_desc', 'Add menu items to your restaurant menu.')}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sortedCategories
            .filter(category => !selectedCategory || category === selectedCategory)
            .map((category) => {
              const containerId = `scroll-${category.toLowerCase().replace(/\s+/g, '-')}`;
              const items = groupedItems[category] || [];

              return (
                <div key={category} id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`} className="space-y-4">
                  {/* Content Area: Carousel (All) or Grid (Filtered) */}
                  {!selectedCategory ? (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">
                            {category === 'Uncategorized' ? t('category.uncategorized', 'Uncategorized') : t(`category.${category.toLowerCase().replace(' ', '_')}`, category)}
                          </h2>
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[10px] font-bold">
                            {items.length} {t('common.items', 'ITEMS')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => scrollContainer(containerId, 'left')}
                            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 text-zinc-400 transition-all"
                          >
                            <span className="text-lg">←</span>
                          </button>
                          <button
                            onClick={() => scrollContainer(containerId, 'right')}
                            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 text-zinc-400 transition-all"
                          >
                            <span className="text-lg">→</span>
                          </button>
                        </div>
                      </div>

                      <div
                        id={containerId}
                        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4"
                      >
                        {items.length > 0 ? (
                          items.map((item: MenuItem) => (
                            <MenuCard
                              key={item.id}
                              item={item}
                            />
                          ))
                        ) : (
                          <div className="w-full h-[140px] rounded-2xl border border-dashed border-zinc-800 flex items-center justify-center bg-zinc-900/50">
                            <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">
                              {t('menu.no_items_in_category', 'No items in this category')}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {items.length > 0 ? (
                        items.map((item: MenuItem) => (
                          <MenuCard
                            key={item.id}
                            item={item}
                          />
                        ))
                      ) : (
                        <div className="col-span-full h-[200px] rounded-2xl border border-dashed border-zinc-800 flex items-center justify-center bg-zinc-900/50">
                          <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">
                            {t('menu.no_items_in_category', 'No items in this category')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};


export default AdminMenuPage;
