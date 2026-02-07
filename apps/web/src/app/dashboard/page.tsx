
'use client';

import React from 'react';
import Link from 'next/link';
import { useMockDashboardQuery } from '@/lib/mockDashboardQuery';
import {
    ShoppingBag,
    Armchair,
    DollarSign,
    Users,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';

const AdminDashboardPage = () => {
    const { data: stats, isLoading, isError } = useMockDashboardQuery();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                    <p className="text-zinc-400">Loading dashboard metrics...</p>
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
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
                    <p>Failed to load dashboard metrics. Please try again later.</p>
                </div>
            </div>
        );
    }

    const kpis = [
        {
            label: 'Total Orders',
            value: stats?.totalOrdersToday || 0,
            change: '+12%',
            icon: ShoppingBag,
            href: '/dashboard/orders',
            color: 'from-blue-500 to-blue-600',
        },
        {
            label: 'Active Tables',
            value: stats?.activeTablesCount || 0,
            change: 'Occupied',
            icon: Armchair,
            href: '/dashboard/tables',
            color: 'from-emerald-500 to-emerald-600',
        },
        {
            label: 'Revenue Today',
            value: `$${stats?.revenueToday?.toFixed(2) || '0.00'}`,
            change: '+8%',
            icon: DollarSign,
            href: '/dashboard/menu',
            color: 'from-amber-500 to-amber-600',
        },
        {
            label: 'Staff On Duty',
            value: stats?.staffOnDuty || 0,
            change: 'Active',
            icon: Users,
            href: '/dashboard/staff',
            color: 'from-rose-500 to-rose-600',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                <p className="text-zinc-400">Welcome back to the command center.</p>
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
                                    <span className="text-xs text-zinc-500 font-medium">View Details</span>
                                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Quick Access</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link
                        href="/dashboard/orders"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-sm font-medium">Orders</span>
                    </Link>
                    <Link
                        href="/dashboard/tables"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <Armchair className="h-4 w-4" />
                        <span className="text-sm font-medium">Tables</span>
                    </Link>
                    <Link
                        href="/dashboard/menu"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">Menu</span>
                    </Link>
                    <Link
                        href="/dashboard/staff"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">Staff</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
