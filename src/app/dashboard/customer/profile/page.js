'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'sonner';
import { User, Mail, Save } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name,
        image,
      });
    } catch (err) {
      // toast in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="customer">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Customer Profile Settings</h1>
          <p className="text-xs text-muted-foreground">
            Update your full name and profile avatar image.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <img
                src={image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt="Profile Preview"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-pizza-500 shadow"
              />
              <div>
                <p className="font-bold text-sm text-foreground">{user?.name}</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <label className="block font-bold text-foreground mb-1">Email Address (Read Only)</label>
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
                <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
