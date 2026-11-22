'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../../components/DashboardLayout';
import { fetchApi } from '../../../../lib/api';
import { toast } from 'sonner';
import { Heart, Trash2, ArrowRight, Pizza, ChevronRight } from 'lucide-react';

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await fetchApi('/favorites');
      if (res.success && res.items) {
        setFavorites(res.items);
      }
    } catch (err) {
      toast.error('Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const res = await fetchApi('/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({ itemId }),
      });
      if (res.success) {
        toast.success('Removed from wishlist.');
        loadFavorites();
      }
    } catch (err) {
      toast.error('Failed to update wishlist.');
    }
  };

  return (
    <DashboardLayout requiredRole="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Wishlist &amp; Favorite Pizzas</h1>
          <p className="text-xs text-muted-foreground">
            Save your favorite artisan pizzas for lightning-fast re-ordering anytime.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading wishlist...</div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
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
                    <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-pizza-600 shadow">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-foreground line-clamp-1">{item.itemName}</h3>
                      <span className="font-black text-pizza-600 text-base shrink-0">৳{item.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-border pt-4">
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 rounded-xl border border-border hover:bg-destructive/10 text-destructive text-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href={`/menu/${item._id}`}
                    className="px-4 py-2 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all hover:scale-105"
                  >
                    <span>Order Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 rounded-3xl border border-dashed border-border bg-card text-center space-y-4 max-w-md mx-auto">
            <Heart className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-bold text-base">Your Wishlist is Empty</h3>
            <p className="text-xs text-muted-foreground">Click the heart icon on any pizza in our catalog to save it here.</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pizza-600 text-white text-xs font-bold hover:bg-pizza-700"
            >
              <Pizza className="w-3.5 h-3.5" /> Browse Pizzas
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
