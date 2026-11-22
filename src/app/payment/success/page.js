'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { CheckCircle2, Sparkles, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    async function verify() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetchApi('/subscription/verify-session', {
          method: 'POST',
          body: JSON.stringify({ sessionId }),
        });

        if (res.success && res.transaction) {
          setTransaction(res.transaction);
          toast.success('Your Premium Subscription has been verified! 🌟');
        }
      } catch (err) {
        console.warn('Verification note:', err.message);
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [sessionId]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md p-8 rounded-3xl bg-card border border-border shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Premium Activated
          </span>
          <h1 className="text-2xl font-black text-foreground">Payment Successful!</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Thank you for upgrading! Your pizzeria is now upgraded to the PizzaHub Premium Partner tier with unlimited menu publishing and featured placement.
          </p>
        </div>

        {transaction && (
          <div className="p-4 rounded-2xl bg-muted/60 border border-border text-left space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-bold uppercase text-foreground">{transaction.plan} Tier</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold text-foreground">${transaction.amount?.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-bold text-emerald-600 uppercase">Paid &amp; Confirmed</span>
            </div>
            <div className="flex justify-between truncate">
              <span className="text-muted-foreground">Session ID:</span>
              <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[170px]">
                {transaction.stripeSessionId}
              </span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Link
            href="/dashboard/vendor"
            className="w-full py-3 rounded-2xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-sm shadow-lg shadow-pizza-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Vendor Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-xs text-muted-foreground">Verifying payment...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
