'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ShoppingBag,
  Sparkles,
  Users,
  CreditCard,
  Settings,
  Heart,
  LogOut,
  Menu,
  X,
  Pizza,
  ShieldCheck,
  Store,
  User,
  ChevronRight,
  AlertOctagon,
} from 'lucide-react';

export default function DashboardLayout({ children, requiredRole }) {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(`/sign-in?redirect=${pathname}`);
      } else if (requiredRole && user?.role !== requiredRole) {
        // Enforce role separation: cannot open another role's dashboard by changing URL
        if (user?.role === 'admin') router.push('/dashboard/admin');
        else if (user?.role === 'vendor') router.push('/dashboard/vendor');
        else router.push('/dashboard/customer');
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-pizza-500 border-t-transparent animate-spin mb-3" />
        <p className="text-xs text-muted-foreground font-semibold">Verifying secure dashboard session...</p>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  // Define sidebar links based on role
  let links = [];

  if (user?.role === 'admin') {
    links = [
      { href: '/dashboard/admin', label: 'Platform Overview', icon: LayoutDashboard },
      { href: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
      { href: '/dashboard/admin/menu-items', label: 'Manage Menu Items', icon: UtensilsCrossed },
      { href: '/dashboard/admin/transactions', label: 'Transactions', icon: CreditCard },
    ];
  } else if (user?.role === 'vendor') {
    links = [
      { href: '/dashboard/vendor', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/vendor/menu', label: 'My Menu Items', icon: UtensilsCrossed },
      { href: '/dashboard/vendor/add-item', label: 'Add Menu Item', icon: PlusCircle },
      { href: '/dashboard/vendor/orders', label: 'Customer Orders', icon: ShoppingBag },
      { href: '/dashboard/vendor/subscription', label: 'Subscription Plan', icon: Sparkles },
      { href: '/dashboard/vendor/profile', label: 'Profile Settings', icon: Settings },
    ];
  } else {
    // Customer
    links = [
      { href: '/dashboard/customer', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/customer/orders', label: 'My Orders', icon: ShoppingBag },
      { href: '/dashboard/customer/favorites', label: 'Wishlist & Favorites', icon: Heart },
      { href: '/dashboard/customer/profile', label: 'Profile Settings', icon: Settings },
    ];
  }

  return (
    <div className="min-h-[90vh] bg-background flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Pizza className="w-5 h-5 text-pizza-600" />
          <span className="font-bold text-sm capitalize">{user?.role} Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-muted text-foreground"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 border-r border-border bg-card p-5 shrink-0 space-y-6 flex flex-col justify-between`}
      >
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="p-3.5 rounded-2xl bg-muted/60 border border-border flex items-center gap-3">
            <img
              src={user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-pizza-500"
            />
            <div className="overflow-hidden leading-tight">
              <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-pizza-600 dark:text-pizza-400 uppercase tracking-wider">
                {user?.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </>
                ) : user?.role === 'vendor' ? (
                  <>
                    <Store className="w-3 h-3" /> {user?.subscriptionPlan === 'premium' ? '★ Premium' : 'Free Vendor'}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3" /> Customer
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-pizza-600 text-white shadow-md shadow-pizza-500/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-border space-y-2">
          <Link
            href="/menu"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Pizza className="w-4 h-4" />
            <span>Browse Menu</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {user?.isBlocked && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold mb-6 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 shrink-0" />
            <span>Notice: Your account is currently suspended. Protected features are disabled.</span>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
