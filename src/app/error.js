'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('App Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 bg-destructive/10 text-destructive rounded-3xl mb-4">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Something Went Wrong!</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {error?.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pizza-600 text-white font-medium hover:bg-pizza-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-medium transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
