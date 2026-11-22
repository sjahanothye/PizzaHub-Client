'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { fetchApi } from '../../../../lib/api';
import { toast } from 'sonner';
import {
  UtensilsCrossed,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function ManageMenuItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadMenuItems();
  }, [statusFilter]);

  const loadMenuItems = async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const res = await fetchApi(`/admin/menu-items?${params.toString()}`);
      if (res.success && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      toast.error('Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMenuItems();
  };

  const handleReview = async (id, status) => {
    setProcessingId(id);
    try {
      const res = await fetchApi(`/admin/menu-items/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (res.success) {
        toast.success(res.message);
        loadMenuItems();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update review decision.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item from the platform?')) return;
    try {
      const res = await fetchApi(`/menu/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        toast.success('Item deleted successfully.');
        loadMenuItems();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete item.');
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Manage Menu Items</h1>
          <p className="text-xs text-muted-foreground">
            Review submitted artisan pizzas, approve or reject pending items, and manage platform catalog availability.
          </p>
        </div>

        {/* Filter bar */}
        <div className="p-4 rounded-3xl bg-card border border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pizza name or location..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-input bg-background text-xs focus:ring-2 focus:ring-pizza-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-pizza-600 text-white text-[10px] font-bold"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'pending', 'approved', 'rejected', 'inactive'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-pizza-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="p-5 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                  alt={item.itemName}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{item.itemName}</h3>
                    <span className="font-black text-pizza-600 text-sm">${item.price?.toFixed(2)}</span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="font-semibold text-foreground">Category: {item.category}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pizza-600" /> {item.location}
                    </span>
                    <span>By: <strong>{item.vendor?.businessName || item.vendor?.name}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status and Admin Actions */}
              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    item.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : item.status === 'pending'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : item.status === 'rejected'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {item.status}
                </span>

                {item.status === 'pending' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReview(item._id, 'approved')}
                      disabled={processingId === item._id}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReview(item._id, 'rejected')}
                      disabled={processingId === item._id}
                      className="px-3.5 py-1.5 rounded-xl bg-destructive hover:bg-destructive/90 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}

                {item.status !== 'pending' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        handleReview(item._id, item.status === 'approved' ? 'inactive' : 'approved')
                      }
                      className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                    >
                      {item.status === 'approved' ? 'Set Inactive' : 'Set Approved'}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-xl border border-border hover:bg-destructive/10 text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center py-12 text-xs text-muted-foreground">No menu items found matching query.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
