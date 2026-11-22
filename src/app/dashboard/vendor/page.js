'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { fetchApi } from '../../../lib/api';
import {
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function VendorOverviewPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [itemsRes, ordersRes] = await Promise.all([
          fetchApi('/menu/vendor/my-items'),
          fetchApi('/orders/vendor'),
        ]);

        if (itemsRes.success) setItems(itemsRes.items || []);
        if (ordersRes.success) setOrders(ordersRes.orders || []);
      } catch (err) {
        console.warn('Vendor overview data fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalItems = items.length;
  const activeItems = items.filter((i) => ['approved', 'pending'].includes(i.status)).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;
  const isPremium = user?.subscriptionPlan === 'premium';

  // Chart data
  const chartData = [
    { name: 'Active Items', count: activeItems },
    { name: 'Pending Orders', count: pendingOrders },
    { name: 'Accepted Orders', count: acceptedOrders },
    { name: 'Total Orders', count: orders.length },
  ];

  return (
    <DashboardLayout requiredRole="vendor">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pizza-600 to-tomato-600 text-white shadow-xl shadow-pizza-500/15">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-pizza-100">Restaurant Partner Portal</span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {user?.businessName || user?.name}! 🍕
            </h1>
            <p className="text-xs text-pizza-100 max-w-lg">
              Manage your pizza recipes, accept incoming orders, and track your restaurant performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/vendor/add-item"
              className="px-4 py-2.5 rounded-xl bg-white text-pizza-700 hover:bg-pizza-50 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Pizza</span>
            </Link>
          </div>
        </div>

        {/* Free plan notice if limit reached */}
        {!isPremium && activeItems >= 3 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
              <span>
                You have reached your <strong>Free Tier limit (3 active items)</strong>. Upgrade to Premium for unlimited active menu items!
              </span>
            </div>
            <Link
              href="/dashboard/vendor/subscription"
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-black text-xs shrink-0 hover:bg-amber-400"
            >
              Upgrade Now
            </Link>
          </div>
        )}

        {/* 5 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2.5 bg-pizza-100 dark:bg-pizza-950/60 text-pizza-600 w-fit rounded-xl">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Menu Items</p>
            <p className="text-2xl font-black text-foreground">{totalItems}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 w-fit rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Active Menu Items</p>
            <p className="text-2xl font-black text-foreground">{activeItems}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 text-amber-600 w-fit rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Pending Orders</p>
            <p className="text-2xl font-black text-amber-600">{pendingOrders}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 w-fit rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Accepted Orders</p>
            <p className="text-2xl font-black text-foreground">{acceptedOrders}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950/60 text-purple-600 w-fit rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Current Plan</p>
            <p className="text-lg font-black uppercase text-pizza-600">
              {isPremium ? '★ Premium' : 'Free (3 Max)'}
            </p>
          </div>
        </div>

        {/* Chart & Recent Incoming Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chart */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pizza-600" />
                <span>Restaurant Activity Overview</span>
              </h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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

          {/* Quick Recent Orders */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-foreground">Recent Customer Orders</h2>
              <Link
                href="/dashboard/vendor/orders"
                className="text-xs font-bold text-pizza-600 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div key={order._id} className="p-3 rounded-2xl bg-muted/60 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-foreground truncate max-w-[150px]">{order.item?.itemName}</p>
                    <p className="text-muted-foreground text-[10px]">Date: {order.deliveryDate}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'pending'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : order.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">No customer orders yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
