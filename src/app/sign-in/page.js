'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Pizza, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Store, User } from 'lucide-react';
import { toast } from 'sonner';

function SignInContent() {
  const { login, googleLogin } = useAuth();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roleParam === 'admin') {
      setEmail('admin@pizzahub.com');
      setPassword('Admin123!');
    } else if (roleParam === 'vendor') {
      setEmail('bellapizza@pizzahub.com');
      setPassword('Vendor123!');
    } else if (roleParam === 'customer') {
      setEmail('john@example.com');
      setPassword('Customer123!');
    }
  }, [roleParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      // toast shown in context
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (targetRole) => {
    if (targetRole === 'admin') {
      setEmail('admin@pizzahub.com');
      setPassword('Admin123!');
      toast.info('Loaded Administrator credentials');
    } else if (targetRole === 'vendor') {
      setEmail('bellapizza@pizzahub.com');
      setPassword('Vendor123!');
      toast.info('Loaded Vendor credentials');
    } else {
      setEmail('john@example.com');
      setPassword('Customer123!');
      toast.info('Loaded Customer credentials');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await googleLogin({
        email: 'google.user@example.com',
        name: 'Google User',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'customer',
      });
    } catch (err) {
      // handled
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex p-3 bg-pizza-100 dark:bg-pizza-900/50 text-pizza-600 rounded-2xl shadow-sm mb-2">
            <Pizza className="w-8 h-8" />
          </Link>
          <h1 className="text-2xl font-black text-foreground">Sign In to PizzaHub</h1>
          <p className="text-xs text-muted-foreground">
            Enter your credentials to manage your pizza orders, restaurant, or platform.
          </p>
        </div>

        {/* Quick Demo Fill Buttons for Recruiter Testing */}
        <div className="p-4 rounded-2xl border border-dashed border-pizza-300 dark:border-pizza-800 bg-pizza-50/50 dark:bg-pizza-950/20 space-y-2">
          <p className="text-[11px] font-bold text-center text-pizza-700 dark:text-pizza-300 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pizza-600" /> 1-Click Role Testing Quick Fill:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 rounded-xl bg-card border border-border hover:border-pizza-500 text-[10px] font-bold shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-pizza-600" /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('vendor')}
              className="py-1.5 px-2 rounded-xl bg-card border border-border hover:border-pizza-500 text-[10px] font-bold shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-1"
            >
              <Store className="w-3 h-3 text-pizza-600" /> Vendor
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className="py-1.5 px-2 rounded-xl bg-card border border-border hover:border-pizza-500 text-[10px] font-bold shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-1"
            >
              <User className="w-3 h-3 text-pizza-600" /> Customer
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-pizza-600" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-pizza-600" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-pizza-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-sm shadow-lg shadow-pizza-500/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Or continue with
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
          Don't have an account yet?{' '}
          <Link href="/sign-up" className="font-bold text-pizza-600 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-xs text-muted-foreground">Loading sign in...</div>}>
      <SignInContent />
    </Suspense>
  );
}
