'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../../components/DashboardLayout';
import { fetchApi } from '../../../../lib/api';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  XCircle,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Store,
  Printer,
  Pizza,
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Optional Feature 3: Timeline Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Printable Invoice Modal
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetchApi('/orders/customer');
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      toast.error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this pending pizza order?')) return;

    setCancellingId(orderId);
    try {
      const res = await fetchApi(`/orders/${orderId}/cancel`, {
        method: 'PATCH',
      });

      if (res.success) {
        toast.success('Order cancelled successfully.');
        loadOrders();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <DashboardLayout requiredRole="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">My Orders</h1>
          <p className="text-xs text-muted-foreground">
            Track real-time order status, view delivery details, and cancel pending requests.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading your orders...</div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Item & Vendor Info */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={order.item?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                    alt={order.item?.itemName}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground">{order.item?.itemName}</h3>
                      <span className="font-black text-pizza-600 text-sm">৳{order.item?.price}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-pizza-600" />
                        <strong>Pizzeria:</strong> {order.vendor?.businessName || order.vendor?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-pizza-600" />
                        <strong>Delivery Date:</strong> {order.deliveryDate}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-pizza-600 shrink-0" />
                      <span>{order.deliveryAddress}</span>
                    </p>

                    <p className="text-[10px] text-muted-foreground">
                      Requested on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
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

                  <div className="flex items-center gap-2">
                    {/* View Invoice / Receipt */}
                    <button
                      onClick={() => setInvoiceOrder(order)}
                      className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition-colors text-foreground"
                      title="Print Official Order Receipt"
                    >
                      <Printer className="w-3.5 h-3.5 text-pizza-600" />
                      <span>Receipt</span>
                    </button>

                    {/* View Details / Timeline (Optional 3) */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-pizza-600" />
                      <span>Timeline</span>
                    </button>

                    {/* Cancel Pending Order */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="px-3.5 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 rounded-3xl border border-dashed border-border bg-card text-center space-y-4 max-w-md mx-auto">
            <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-bold text-base">No Orders Found</h3>
            <p className="text-xs text-muted-foreground">You haven't placed any pizza orders yet. Explore our fresh menu to order your first slice!</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pizza-600 text-white text-xs font-bold hover:bg-pizza-700"
            >
              <span>Explore Pizza Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Printable Official Invoice Modal */}
        {invoiceOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-pizza-100 dark:bg-pizza-900/50 text-pizza-600 rounded-xl">
                    <Pizza className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-foreground">PizzaHub Official Invoice</h3>
                    <p className="text-[11px] text-muted-foreground font-mono">Order #{invoiceOrder._id?.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-muted text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Pizzeria & Customer Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold">Pizzeria Vendor:</p>
                  <p className="font-bold text-foreground">{invoiceOrder.vendor?.businessName || invoiceOrder.vendor?.name}</p>
                  <p className="text-muted-foreground">{invoiceOrder.vendor?.email}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold">Delivery Address:</p>
                  <p className="font-bold text-foreground line-clamp-2">{invoiceOrder.deliveryAddress}</p>
                  <p className="text-muted-foreground">Delivery Date: {invoiceOrder.deliveryDate}</p>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="rounded-2xl border border-border overflow-hidden bg-muted/20">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground font-bold border-b border-border">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3">
                        <p className="font-bold text-foreground">{invoiceOrder.item?.itemName}</p>
                        <p className="text-[10px] text-muted-foreground">{invoiceOrder.item?.category} • {invoiceOrder.item?.location}</p>
                        {invoiceOrder.message && (
                          <p className="text-[10px] italic text-pizza-600 mt-0.5">Note: {invoiceOrder.message}</p>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold">1</td>
                      <td className="p-3 text-right font-black text-pizza-600">৳{invoiceOrder.item?.price}</td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t border-border bg-muted/40 font-bold text-xs">
                    <tr>
                      <td colSpan={2} className="p-3 text-right">Subtotal:</td>
                      <td className="p-3 text-right text-foreground">৳{invoiceOrder.item?.price}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="p-3 text-right text-muted-foreground">Doorstep Delivery Fee:</td>
                      <td className="p-3 text-right text-emerald-600">FREE</td>
                    </tr>
                    <tr className="border-t border-border font-black text-sm">
                      <td colSpan={2} className="p-3 text-right text-foreground">Total Amount:</td>
                      <td className="p-3 text-right text-pizza-600">৳{invoiceOrder.item?.price} BDT</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment & Order Status */}
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-muted/50 border border-border">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-bold text-foreground">Cash On Doorstep Delivery</span>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">Crafted with care for pizza lovers in Dhaka.</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInvoiceOrder(null)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-muted"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optional Feature 3: Order Status Timeline Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground">Order Status Timeline</h3>
                  <p className="text-[11px] text-muted-foreground">Tracking {selectedOrder.item?.itemName}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground font-bold">✕</button>
              </div>

              {/* Status Stepper */}
              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {selectedOrder.timeline && selectedOrder.timeline.length > 0 ? (
                  selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 text-xs">
                      <div className="w-6 h-6 rounded-full bg-pizza-600 text-white font-bold flex items-center justify-center shrink-0 z-10 text-[10px]">
                        ✓
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground">{step.title}</p>
                        <p className="text-muted-foreground text-[11px]">{step.description}</p>
                        <p className="text-[10px] text-pizza-600 font-medium">
                          {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative flex items-start gap-4 text-xs">
                    <div className="w-6 h-6 rounded-full bg-pizza-600 text-white font-bold flex items-center justify-center shrink-0 z-10 text-[10px]">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Order Placed</p>
                      <p className="text-muted-foreground text-[11px]">Your order was submitted to the pizzeria.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-pizza-600 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
