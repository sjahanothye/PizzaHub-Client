'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Pizza, Mail, Lock, User, Store, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
  const { register, googleLogin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' or 'vendor' only
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);

  // Password rules validation helper
  const isLengthValid = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLengthValid || !hasUppercase || !hasLowercase) {
      toast.error('Password must be at least 6 characters, with 1 uppercase and 1 lowercase letter.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        image: image.trim() || undefined,
        role,
        businessName: role === 'vendor' ? businessName : undefined,
      });
    } catch (err) {
      // toast shown in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await googleLogin({
        email: `google.${Date.now()}@example.com`,
        name: 'Google Foodie',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role,
      });
    } catch (err) {
      // handled
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex p-3 bg-pizza-100 dark:bg-pizza-900/50 text-pizza-600 rounded-2xl shadow-sm mb-2">
            <Pizza className="w-8 h-8" />
          </Link>
          <h1 className="text-2xl font-black text-foreground">Create Your PizzaHub Account</h1>
          <p className="text-xs text-muted-foreground">
            Sign up as a pizza customer or register your pizzeria restaurant as a vendor.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2">Select Account Role *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    role === 'customer'
                      ? 'border-pizza-600 bg-pizza-50/60 dark:bg-pizza-950/40 text-pizza-700 dark:text-pizza-300 ring-2 ring-pizza-500/20'
                      : 'border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-pizza-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Customer</p>
                    <p className="text-[10px] text-muted-foreground">Order pizzas &amp; track</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    role === 'vendor'
                      ? 'border-pizza-600 bg-pizza-50/60 dark:bg-pizza-950/40 text-pizza-700 dark:text-pizza-300 ring-2 ring-pizza-500/20'
                      : 'border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Store className="w-5 h-5 text-pizza-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Restaurant Vendor</p>
                    <p className="text-[10px] text-muted-foreground">Publish pizzas &amp; sell</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-pizza-600" /> Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marco Rossi"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />
            </div>

            {/* Business Name if Vendor */}
            {role === 'vendor' && (
              <div>
                <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-pizza-600" /> Restaurant / Pizzeria Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Bella Napoli Artisan Pizzeria"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-pizza-600" /> Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marco@bellapizza.com"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-pizza-600" /> Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />

              {/* Password Rules Indicators */}
              <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                <span className={isLengthValid ? 'text-basil-600 font-bold' : 'text-muted-foreground'}>
                  {isLengthValid ? '✓' : '○'} Min 6 chars
                </span>
                <span className={hasUppercase ? 'text-basil-600 font-bold' : 'text-muted-foreground'}>
                  {hasUppercase ? '✓' : '○'} One uppercase
                </span>
                <span className={hasLowercase ? 'text-basil-600 font-bold' : 'text-muted-foreground'}>
                  {hasLowercase ? '✓' : '○'} One lowercase
                </span>
              </div>
            </div>

            {/* Profile Image URL (optional) */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Profile Image URL (Optional)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-sm shadow-lg shadow-pizza-500/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Or quick register with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2.5 rounded-xl border border-border hover:bg-muted font-semibold text-xs text-foreground flex items-center justify-center gap-2.5 transition-colors"
          >
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-bold text-pizza-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
