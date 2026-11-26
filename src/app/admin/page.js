'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function AdminShortcutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user?.role === 'admin') {
        router.replace('/dashboard/admin');
      } else {
        router.replace('/sign-in?role=admin');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-pizza-500 border-t-transparent animate-spin mb-3" />
      <p className="text-xs text-muted-foreground font-semibold">Redirecting to Admin Portal...</p>
    </div>
  );
}
