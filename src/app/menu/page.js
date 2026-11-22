'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import {
  Search,
  ArrowUpDown,
  MapPin,
  Sparkles,
  ChevronRight,
  Pizza,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

const LOCATIONS = [
  'All',
  'New York',
  'Brooklyn',
  'Manhattan',
  'Queens',
  'Chicago',
  'Little Italy',
];

function BrowseMenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    loadItems();
  }, [selectedCategory, selectedLocation, sortBy]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedLocation !== 'All') params.append('location', selectedLocation);

      if (sortBy === 'price-asc') {
        params.append('sortBy', 'price');
        params.append('order', 'asc');
      } else if (sortBy === 'price-desc') {
        params.append('sortBy', 'price');
        params.append('order', 'desc');
      }

      const res = await fetchApi(`/menu?${params.toString()}`);
      if (res.success && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.warn('Error fetching menu items:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadItems();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSortBy('default');
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">Fresh Wood-Fired Catalog</span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">Explore Our Artisanal Menu</h1>
        <p className="text-sm text-muted-foreground">
          Discover handcrafted pizzas, specialty doughs, crispy sides, and sweet desserts made with love.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pizza name, ingredients, or flavor..."
              className="w-full pl-11 pr-24 py-3 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Challenge 1: Sort by Price dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-2xl border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pizza-500 cursor-pointer"
              >
                <option value="default">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative w-full md:w-40">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-2xl border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pizza-500 cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-pizza-600 text-white shadow-md shadow-pizza-500/20'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}

          {(selectedCategory !== 'All' || selectedLocation !== 'All' || sortBy !== 'default' || search) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 flex items-center gap-1 shrink-0 ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Menu Items */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="group rounded-3xl border border-border bg-card overflow-hidden hover:shadow-xl hover:shadow-pizza-500/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-pizza-600 shadow">
                    {item.category}
                  </div>
                  {item.vendor?.subscriptionPlan === 'premium' && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-black px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" /> Premium
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-lg text-foreground group-hover:text-pizza-600 transition-colors line-clamp-1">
                      {item.itemName}
                    </h2>
                    <span className="text-xl font-black text-pizza-600 shrink-0">
                      ${item.price?.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-pizza-600 shrink-0" />
                      <span className="truncate max-w-[130px]">{item.location}</span>
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[120px]">
                      By {item.vendor?.businessName || item.vendor?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <Link
                  href={`/menu/${item._id}`}
                  className="w-full py-2.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-pizza-500/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>View Details &amp; Order</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-3xl border border-dashed border-border bg-card text-center space-y-4 max-w-md mx-auto">
          <div className="p-4 bg-pizza-100 dark:bg-pizza-900/50 text-pizza-600 w-fit mx-auto rounded-2xl">
            <Pizza className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold">No Menu Items Found</h3>
          <p className="text-xs text-muted-foreground">
            We couldn't find any pizza matching your current filter criteria. Try adjusting your search keyword or category.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2 rounded-xl bg-pizza-600 text-white text-xs font-semibold hover:bg-pizza-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrowseMenuPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading menu...</div>}>
      <BrowseMenuContent />
    </Suspense>
  );
}
