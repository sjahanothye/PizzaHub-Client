'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function DashboardRootPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/sign-in');
      } else if (user?.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user?.role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/customer');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-pizza-500 border-t-transparent animate-spin mb-3" />
      <p className="text-xs text-muted-foreground font-semibold">Redirecting to your dashboard portal...</p>
    </div>
  );
}
