'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../../components/DashboardLayout';
import { fetchApi } from '../../../../lib/api';
import { toast } from 'sonner';
import {
  UtensilsCrossed,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  Power,
  MapPin,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function MyMenuItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    loadMyItems();
  }, []);

  const loadMyItems = async () => {
    try {
      const res = await fetchApi('/menu/vendor/my-items');
      if (res.success && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      toast.error('Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'approved' ? 'inactive' : 'approved';
    try {
      const res = await fetchApi(`/menu/${item._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.success) {
        toast.success(`Item marked as ${nextStatus}!`);
        loadMyItems();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this menu item?')) return;
    try {
      const res = await fetchApi(`/menu/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        toast.success('Menu item deleted successfully.');
        loadMyItems();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete menu item.');
    }
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setEditName(item.itemName);
    setEditPrice(item.price);
    setEditCategory(item.category);
    setEditDescription(item.description);
    setEditLocation(item.location);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await fetchApi(`/menu/${currentItem._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          itemName: editName,
          price: editPrice,
          category: editCategory,
          description: editDescription,
          location: editLocation,
        }),
      });

      if (res.success) {
        toast.success('Menu item updated successfully!');
        setEditModalOpen(false);
        loadMyItems();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update menu item.');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <DashboardLayout requiredRole="vendor">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground">My Menu Items</h1>
            <p className="text-xs text-muted-foreground">
              Review, edit, delete, and manage availability of your submitted pizzas.
            </p>
          </div>
          <Link
            href="/dashboard/vendor/add-item"
            className="px-4 py-2.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md shadow-pizza-500/20 transition-all flex items-center gap-1.5 w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading your menu items...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-muted">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow ${
                          item.status === 'approved'
                            ? 'bg-emerald-500 text-white'
                            : item.status === 'pending'
                            ? 'bg-amber-500 text-black'
                            : item.status === 'rejected'
                            ? 'bg-destructive text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-foreground line-clamp-1">{item.itemName}</h3>
                      <span className="font-black text-pizza-600 text-base shrink-0">${item.price?.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border">
                      <span>{item.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-pizza-600" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-border pt-4">
                  {/* Availability Toggle */}
                  {item.status !== 'rejected' && (
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors ${
                        item.status === 'approved'
                          ? 'bg-muted text-foreground hover:bg-muted/80'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                      title="Toggle availability"
                    >
                      <Power className="w-3 h-3" />
                      <span>{item.status === 'approved' ? 'Active' : 'Inactive'}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-xl border border-border hover:bg-destructive/10 text-destructive"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 rounded-3xl border border-dashed border-border bg-card text-center space-y-4 max-w-md mx-auto">
            <UtensilsCrossed className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-bold text-base">No Menu Items Yet</h3>
            <p className="text-xs text-muted-foreground">Publish your first artisan pizza to start receiving customer orders.</p>
            <Link
              href="/dashboard/vendor/add-item"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pizza-600 text-white text-xs font-bold hover:bg-pizza-700"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add New Pizza
            </Link>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base">Edit Menu Item</h3>
                <button onClick={() => setEditModalOpen(false)} className="text-muted-foreground">✕</button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-pizza-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-pizza-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-pizza-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-pizza-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-5 py-2 rounded-xl bg-pizza-600 text-white font-bold disabled:opacity-50"
                  >
                    {savingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
