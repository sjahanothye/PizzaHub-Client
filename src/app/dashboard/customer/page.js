'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { fetchApi } from '../../../lib/api';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Heart,
  Pizza,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function CustomerOverviewPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersRes, favRes] = await Promise.all([
          fetchApi('/orders/customer'),
          fetchApi('/favorites'),
        ]);

        if (ordersRes.success) setOrders(ordersRes.orders || []);
        if (favRes.success) setFavorites(favRes.items || []);
      } catch (err) {
        console.warn('Customer data fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;
  const rejectedOrders = orders.filter((o) => o.status === 'rejected').length;

  const chartData = [
    { name: 'Pending', count: pendingOrders },
    { name: 'Accepted', count: acceptedOrders },
    { name: 'Rejected', count: rejectedOrders },
    { name: 'Total', count: totalOrders },
  ];

  return (
    <DashboardLayout requiredRole="customer">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pizza-600 to-amber-600 text-white shadow-xl shadow-pizza-500/15">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-pizza-100">Customer Foodie Portal</span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {user?.name}! 🍕
            </h1>
            <p className="text-xs text-pizza-100 max-w-lg">
              Track your pending pizza deliveries, browse favorites, and discover hot new artisan recipes.
            </p>
          </div>
          <Link
            href="/menu"
            className="px-4 py-2.5 rounded-xl bg-white text-pizza-700 hover:bg-pizza-50 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <Pizza className="w-4 h-4" />
            <span>Order Another Pizza</span>
          </Link>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2.5 bg-pizza-100 dark:bg-pizza-950/60 text-pizza-600 w-fit rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Orders Placed</p>
            <p className="text-2xl font-black text-foreground">{totalOrders}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 text-amber-600 w-fit rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Pending Orders</p>
            <p className="text-2xl font-black text-amber-600">{pendingOrders}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 w-fit rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Accepted &amp; Baking</p>
            <p className="text-2xl font-black text-emerald-600">{acceptedOrders}</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <div className="p-2.5 bg-destructive/10 text-destructive w-fit rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Rejected / Cancelled</p>
            <p className="text-2xl font-black text-destructive">{rejectedOrders}</p>
          </div>
        </div>

        {/* Chart + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <h2 className="font-bold text-base text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pizza-600" />
              <span>My Pizza Activity</span>
            </h2>
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

          <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-foreground">Recent Orders</h2>
              <Link
                href="/dashboard/customer/orders"
                className="text-xs font-bold text-pizza-600 hover:underline flex items-center gap-1"
              >
                All Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div key={order._id} className="p-3.5 rounded-2xl bg-muted/60 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-foreground">{order.item?.itemName}</p>
                    <p className="text-muted-foreground text-[10px]">Delivery: {order.deliveryDate}</p>
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
                <p className="text-xs text-muted-foreground text-center py-6">No orders yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
