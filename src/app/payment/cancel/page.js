'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md p-8 rounded-3xl bg-card border border-border shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">Payment Cancelled</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The checkout session was not completed. Your account remains on the Free tier and no charges were made.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/dashboard/vendor/subscription"
            className="w-full py-3 rounded-2xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-sm shadow-lg shadow-pizza-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Return to Subscription Page</span>
          </Link>
          <Link
            href="/dashboard/vendor"
            className="w-full py-3 rounded-2xl border border-border hover:bg-muted text-foreground font-semibold text-xs transition-colors"
          >
            Back to Vendor Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
