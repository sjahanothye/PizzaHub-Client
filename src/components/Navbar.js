'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';
import {
  Pizza,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  ChevronDown,
  ShieldCheck,
  Store,
  ShoppingBag,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin, isVendor, isCustomer } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const getDashboardPath = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isVendor) return '/dashboard/vendor';
    return '/dashboard/customer';
  };

  const getProfilePath = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isVendor) return '/dashboard/vendor/profile';
    return '/dashboard/customer/profile';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-pizza-600 dark:text-pizza-500">
          <div className="p-1.5 bg-pizza-100 dark:bg-pizza-900/50 text-pizza-600 rounded-xl shadow-sm">
            <Pizza className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-pizza-600 to-tomato-500 bg-clip-text text-transparent">
            PizzaHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
          <Link
            href="/"
            className={`transition-colors hover:text-pizza-600 ${
              pathname === '/' ? 'text-pizza-600 font-semibold' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className={`transition-colors hover:text-pizza-600 ${
              pathname.startsWith('/menu') ? 'text-pizza-600 font-semibold' : 'text-muted-foreground'
            }`}
          >
            Browse Menu
          </Link>

          {isAuthenticated && (
            <Link
              href={getDashboardPath()}
              className={`transition-colors hover:text-pizza-600 flex items-center gap-1.5 ${
                pathname.startsWith('/dashboard') ? 'text-pizza-600 font-semibold' : 'text-muted-foreground'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {isAdmin ? 'Admin Panel' : isVendor ? 'Vendor Portal' : 'My Dashboard'}
            </Link>
          )}

          {isCustomer && (
            <Link
              href="/dashboard/customer/favorites"
              className={`transition-colors hover:text-pizza-600 flex items-center gap-1 ${
                pathname.includes('favorites') ? 'text-pizza-600 font-semibold' : 'text-muted-foreground'
              }`}
            >
              <Heart className="w-4 h-4 text-tomato-500" />
              Wishlist
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            <Sun className="h-4 w-4 dark:hidden text-amber-500" />
            <Moon className="h-4 w-4 hidden dark:block text-pizza-400" />
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-border hover:bg-muted transition-colors"
              >
                <img
                  src={user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-pizza-500"
                />
                <div className="text-left leading-tight hidden lg:block">
                  <p className="text-xs font-bold text-foreground truncate max-w-[110px]">{user?.name}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-pizza-600 dark:text-pizza-400">
                    {user?.role}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-4 py-2.5 border-b border-border">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pizza-100 text-pizza-700 dark:bg-pizza-900/60 dark:text-pizza-300">
                      {user?.role === 'admin' ? (
                        <>
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </>
                      ) : user?.role === 'vendor' ? (
                        <>
                          <Store className="w-3 h-3" /> Vendor
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" /> Customer
                        </>
                      )}
                    </span>
                  </div>

                  <Link
                    href={getDashboardPath()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-pizza-600" />
                    Dashboard
                  </Link>

                  <Link
                    href={getProfilePath()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    Profile Settings
                  </Link>

                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-semibold rounded-xl text-foreground hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white shadow-md shadow-pizza-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted shrink-0"
            title="Toggle Theme"
          >
            <Sun className="h-4 w-4 dark:hidden text-amber-500" />
            <Moon className="h-4 w-4 hidden dark:block text-pizza-400" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium hover:text-pizza-600"
          >
            Home
          </Link>
          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium hover:text-pizza-600"
          >
            Browse Menu
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-pizza-600"
              >
                Dashboard ({user?.role})
              </Link>
              <Link
                href={getProfilePath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium hover:text-pizza-600"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left py-2 text-sm font-medium text-destructive"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium rounded-xl border border-border"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium rounded-xl bg-pizza-600 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
