'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';
import { fetchApi } from '../../../lib/api';
import {
  Users,
  Store,
  ShoppingBag,
  UtensilsCrossed,
  Clock,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchApi('/admin/stats');
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.warn('Admin stats fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const barData = [
    { name: 'Vendors', count: stats?.totalVendors || 0 },
    { name: 'Customers', count: stats?.totalCustomers || 0 },
    { name: 'Approved Pizzas', count: stats?.approvedMenuItems || 0 },
    { name: 'Pending Approvals', count: stats?.pendingMenuItems || 0 },
    { name: 'Total Orders', count: stats?.totalOrders || 0 },
  ];

  const pieData = [
    { name: 'Vendors', value: stats?.totalVendors || 0, color: '#ea580c' },
    { name: 'Customers', value: stats?.totalCustomers || 0, color: '#f97316' },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pizza-700 via-tomato-600 to-amber-600 text-white shadow-xl shadow-pizza-500/15">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-pizza-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Platform Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">Administrator Overview</h1>
            <p className="text-xs text-pizza-100 max-w-xl">
              Monitor registered restaurants, review submitted menu items, manage platform users, and track subscription revenues.
            </p>
          </div>
        </div>

        {/* 6 Stats Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2 bg-pizza-100 dark:bg-pizza-950/60 text-pizza-600 w-fit rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Total Registered</p>
            <p className="text-2xl font-black text-foreground">{stats?.totalUsers || 0}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/60 text-orange-600 w-fit rounded-xl">
              <Store className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Total Vendors</p>
            <p className="text-2xl font-black text-foreground">{stats?.totalVendors || 0}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 w-fit rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Total Customers</p>
            <p className="text-2xl font-black text-foreground">{stats?.totalCustomers || 0}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 w-fit rounded-xl">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Total Menu Items</p>
            <p className="text-2xl font-black text-foreground">{stats?.totalMenuItems || 0}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 w-fit rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Pending Approvals</p>
            <p className="text-2xl font-black text-amber-600">{stats?.pendingMenuItems || 0}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 w-fit rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Platform Revenue</p>
            <p className="text-xl font-black text-pizza-600">৳{stats?.totalRevenue?.toLocaleString() || '0'}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <h2 className="font-bold text-base text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pizza-600" />
              <span>Platform Statistics Distribution</span>
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#ea580c" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <h2 className="font-bold text-base text-foreground">User Demographic</h2>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around text-xs border-t border-border pt-3">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-3 h-3 rounded-full bg-pizza-600" /> Vendors: {stats?.totalVendors}
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-3 h-3 rounded-full bg-pizza-500" /> Customers: {stats?.totalCustomers}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/admin/menu-items"
            className="p-6 rounded-3xl bg-card border border-border hover:border-pizza-500 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-sm text-foreground group-hover:text-pizza-600">Review Pending Pizzas</p>
              <p className="text-xs text-muted-foreground">{stats?.pendingMenuItems || 0} items awaiting review</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-pizza-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="p-6 rounded-3xl bg-card border border-border hover:border-pizza-500 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-sm text-foreground group-hover:text-pizza-600">Manage Platform Users</p>
              <p className="text-xs text-muted-foreground">{stats?.totalUsers || 0} registered accounts</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-pizza-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard/admin/transactions"
            className="p-6 rounded-3xl bg-card border border-border hover:border-pizza-500 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-sm text-foreground group-hover:text-pizza-600">View Stripe Transactions</p>
              <p className="text-xs text-muted-foreground">{stats?.totalTransactions || 0} logged payments</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-pizza-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
