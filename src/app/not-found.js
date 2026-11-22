'use client';

import Link from 'next/link';
import { Pizza, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 bg-pizza-100 dark:bg-pizza-950/60 text-pizza-600 rounded-3xl mb-6 shadow-xl shadow-pizza-500/10">
        <Pizza className="w-16 h-16 animate-bounce" />
      </div>
      <h1 className="text-6xl font-black text-pizza-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-4">Slice Not Found!</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Looks like someone ate the last slice of this page. Let's get you back to the fresh menu.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-pizza-600 hover:bg-pizza-700 text-white font-semibold shadow-lg shadow-pizza-500/20 transition-all hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
}
