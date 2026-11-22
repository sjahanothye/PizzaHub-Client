'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, setAuthToken, getAuthToken } from '../lib/api';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetchApi('/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setAuthToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Auth token validation note:', err.message);
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}! 🍕`);

        // Redirect according to role
        if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (res.user.role === 'vendor') {
          router.push('/dashboard/vendor');
        } else {
          router.push('/dashboard/customer');
        }
        return res;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to sign in. Please verify credentials.');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        setUser(res.user);
        toast.success('Registration successful! Welcome to PizzaHub 🎉');

        if (res.user.role === 'vendor') {
          router.push('/dashboard/vendor');
        } else {
          router.push('/dashboard/customer');
        }
        return res;
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      throw err;
    }
  };

  const googleLogin = async (googleData) => {
    try {
      const res = await fetchApi('/auth/google', {
        method: 'POST',
        body: JSON.stringify(googleData),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        setUser(res.user);
        toast.success(`Signed in with Google as ${res.user.name}!`);

        if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (res.user.role === 'vendor') {
          router.push('/dashboard/vendor');
        } else {
          router.push('/dashboard/customer');
        }
        return res;
      }
    } catch (err) {
      toast.error(err.message || 'Google authentication failed.');
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    toast.info('Signed out successfully.');
    router.push('/sign-in');
  };

  const updateProfile = async (data) => {
    try {
      const res = await fetchApi('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (res.success && res.user) {
        setUser(res.user);
        toast.success('Profile updated successfully!');
      }
      return res;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isVendor: user?.role === 'vendor',
        isCustomer: user?.role === 'customer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
