'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { fetchApi } from '../../../../lib/api';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  MessageSquare,
  User,
} from 'lucide-react';

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetchApi('/orders/vendor');
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      toast.error('Failed to load customer orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setProcessingId(orderId);
    try {
      const res = await fetchApi(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.success) {
        toast.success(`Order marked as ${newStatus}!`);
        loadOrders();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout requiredRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Customer Orders</h1>
          <p className="text-xs text-muted-foreground">
            Review incoming pizza orders from customers and accept or reject them. Only pending orders can be modified.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Item & Customer Info */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={order.item?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                    alt={order.item?.itemName}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground">{order.item?.itemName}</h3>
                      <span className="font-black text-pizza-600 text-sm">${order.item?.price?.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-pizza-600" />
                        <strong>Customer:</strong> {order.customer?.name} ({order.customer?.email})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-pizza-600" />
                        <strong>Delivery:</strong> {order.deliveryDate}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-pizza-600 shrink-0" />
                      <span>{order.deliveryAddress}</span>
                    </p>

                    {order.message && (
                      <p className="text-xs text-pizza-700 dark:text-pizza-300 italic bg-pizza-50 dark:bg-pizza-950/40 px-3 py-1 rounded-xl w-fit">
                        "{order.message}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
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

                  {order.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'accepted')}
                        disabled={processingId === order._id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'rejected')}
                        disabled={processingId === order._id}
                        className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 rounded-3xl border border-dashed border-border bg-card text-center space-y-3 max-w-md mx-auto">
            <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-bold text-base">No Customer Orders Yet</h3>
            <p className="text-xs text-muted-foreground">When customers order from your menu, they will appear here in real-time.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
