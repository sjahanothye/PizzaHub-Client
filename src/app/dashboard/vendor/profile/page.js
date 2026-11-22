'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'sonner';
import { User, Store, Mail, Camera, Save } from 'lucide-react';

export default function VendorProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [image, setImage] = useState(user?.image || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name,
        businessName,
        image,
      });
    } catch (err) {
      // toast in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="vendor">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Restaurant Profile Settings</h1>
          <p className="text-xs text-muted-foreground">
            Update your public pizzeria brand name, contact person name, and avatar image.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <img
                src={image || 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&q=80'}
                alt="Profile Preview"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-pizza-500 shadow"
              />
              <div>
                <p className="font-bold text-sm text-foreground">{user?.businessName || user?.name}</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Contact Person Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Pizzeria / Restaurant Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
