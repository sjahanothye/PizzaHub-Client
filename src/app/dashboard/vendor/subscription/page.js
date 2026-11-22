'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { useAuth } from '../../../../context/AuthContext';
import { fetchApi } from '../../../../lib/api';
import { toast } from 'sonner';
import { Sparkles, Check, CheckCircle2, Crown, Zap, ShieldCheck } from 'lucide-react';

export default function VendorSubscriptionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const isPremium = user?.subscriptionPlan === 'premium';

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/subscription/create-checkout-session', {
        method: 'POST',
      });

      if (res.success && res.url) {
        toast.info('Redirecting to Stripe Checkout...');
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to start Stripe checkout session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="vendor">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">Restaurant Growth Plans</span>
          <h1 className="text-3xl font-black text-foreground">PizzaHub Vendor Subscriptions</h1>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Scale your local pizzeria with unlimited menu publication, verified partner badge, and featured placement.
          </p>
        </div>

        {/* Current status banner */}
        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between text-xs">
          <span>
            Current Status:{' '}
            <strong className="uppercase text-pizza-600 font-black">
              {isPremium ? '★ Premium Partner Plan' : 'Free Starter Plan'}
            </strong>
          </span>
          {isPremium && (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Active &amp; Verified
            </span>
          )}
        </div>

        {/* Pricing Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground uppercase">Starter</span>
                <h3 className="text-2xl font-black text-foreground">Free Plan</h3>
                <p className="text-xs text-muted-foreground">Great for new pizza shops testing the waters.</p>
              </div>

              <div className="pt-2">
                <span className="text-4xl font-black text-foreground">$0</span>
                <span className="text-xs text-muted-foreground"> / month forever</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-border text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Max <strong>3 active menu items</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic Vendor Dashboard &amp; stats</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Customer order management</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-2xl border border-border bg-muted/60 text-muted-foreground text-xs font-bold cursor-default"
            >
              {isPremium ? 'Included' : 'Currently Active'}
            </button>
          </div>

          {/* Premium Tier */}
          <div className="relative p-8 rounded-3xl bg-card border-2 border-pizza-500 shadow-2xl shadow-pizza-500/15 flex flex-col justify-between space-y-6">
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-pizza-600 text-white font-black text-[10px] uppercase tracking-wider shadow">
              Recommended
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-pizza-600 uppercase flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> High Performance
                </span>
                <h3 className="text-2xl font-black text-foreground">Premium Partner</h3>
                <p className="text-xs text-muted-foreground">Maximum visibility and unlimited catalog reach.</p>
              </div>

              <div className="pt-2">
                <span className="text-4xl font-black text-pizza-600">$19.99</span>
                <span className="text-xs text-muted-foreground"> / year access</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-border text-xs text-foreground font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-pizza-600 shrink-0" />
                  <span><strong>Unlimited active menu items</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-pizza-600 shrink-0" />
                  <span><strong>Verified Premium Vendor Badge</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-pizza-600 shrink-0" />
                  <span>Featured homepage placement &amp; ranking boost</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-pizza-600 shrink-0" />
                  <span>Priority customer support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isPremium || loading}
              className="w-full py-3.5 rounded-2xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-xl shadow-pizza-500/25 disabled:opacity-60 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isPremium ? 'Already Upgraded to Premium ✓' : loading ? 'Redirecting to Stripe...' : 'Upgrade to Premium Now'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
