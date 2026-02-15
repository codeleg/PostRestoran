
'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardQuery } from '@/lib/api/useDashboardQuery';
import { useTranslation } from 'react-i18next';
import {
    ShoppingBag,
    Armchair,
    DollarSign,
    Users,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';

const AdminDashboardPage = () => {
    const { t } = useTranslation();
    const { data: stats, isLoading, isError } = useDashboardQuery();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white">{t('dashboard.title', 'Dashboard Overview')}</h1>
                    <p className="text-zinc-400">{t('dashboard.loading', 'Loading dashboard metrics...')}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-40 rounded-xl bg-zinc-900 border border-zinc-800 p-6 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white">{t('dashboard.title', 'Dashboard Overview')}</h1>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
                    <p>{t('dashboard.error', 'Failed to load dashboard metrics. Please try again later.')}</p>
                </div>
            </div>
        );
    }

    const kpis = [
        {
            label: t('dashboard.active_orders', 'Active Orders'),
            value: stats?.totalOrdersToday || 0,
            change: '+12%',
            icon: ShoppingBag,
            href: '/dashboard/orders',
            color: 'from-blue-500 to-blue-600',
        },
        {
            label: t('dashboard.available_tables', 'Available Tables'),
            value: stats?.activeTablesCount || 0,
            change: t('tables.status_occupied', 'Occupied'),
            icon: Armchair,
            href: '/dashboard/tables',
            color: 'from-emerald-500 to-emerald-600',
        },
        {
            label: t('dashboard.total_revenue', 'Total Revenue'),
            value: `$${Number(stats?.revenueToday || 0).toFixed(2)}`,
            change: '+8%',
            icon: DollarSign,
            href: '/dashboard/menu',
            color: 'from-amber-500 to-amber-600',
        },
        {
            label: t('dashboard.active_staff', 'Active Staff'),
            value: stats?.staffOnDuty || 0,
            change: t('staff.status_active', 'Active'),
            icon: Users,
            href: '/dashboard/staff',
            color: 'from-rose-500 to-rose-600',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">{t('dashboard.title', 'Dashboard Overview')}</h1>
                <p className="text-zinc-400">{t('dashboard.welcome', 'Welcome back to the command center.')}</p>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <Link
                            key={kpi.label}
                            href={kpi.href}
                            className="group relative rounded-xl bg-zinc-900 border border-zinc-800 p-6 hover:border-zinc-700 transition-all duration-300 overflow-hidden"
                        >
                            {/* Background Gradient Accent */}
                            <div
                                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${kpi.color}`}
                            />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                {/* Top Section */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                                            {kpi.label}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color}`}
                                    >
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                </div>

                                {/* Value */}
                                <div className="mb-4">
                                    <div className="text-3xl font-bold text-white">
                                        {kpi.value}
                                    </div>
                                    <p className="text-zinc-500 text-xs mt-1 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3 text-teal-400" />
                                        {kpi.change}
                                    </p>
                                </div>

                                {/* Action */}
                                <div className="pt-2 border-t border-zinc-800/50 flex items-center justify-between">
                                    <span className="text-xs text-zinc-500 font-medium">{t('common.view_details', 'View Details')}</span>
                                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">{t('dashboard.quick_actions', 'Quick Actions')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link
                        href="/dashboard/orders"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('nav.orders', 'Orders')}</span>
                    </Link>
                    <Link
                        href="/dashboard/tables"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <Armchair className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('nav.tables', 'Tables')}</span>
                    </Link>
                    <Link
                        href="/dashboard/menu"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('nav.menu', 'Menu')}</span>
                    </Link>
                    <Link
                        href="/dashboard/staff"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('nav.staff', 'Staff')}</span>
                    </Link>
                    <Link
                        href="/dashboard/inventory"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-sm font-medium">Stock</span>
                    </Link>
                    <Link
                        href="/dashboard/reports"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">Reports</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default AdminDashboardPage;
