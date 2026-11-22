'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { fetchApi } from '../../../../lib/api';
import { toast } from 'sonner';
import {
  Users,
  Search,
  ShieldCheck,
  Store,
  User,
  ShieldAlert,
  Lock,
  Unlock,
} from 'lucide-react';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (roleFilter !== 'All') params.append('role', roleFilter);

      const res = await fetchApi(`/admin/users?${params.toString()}`);
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleToggleBlock = async (userId) => {
    setProcessingId(userId);
    try {
      const res = await fetchApi(`/admin/users/${userId}/block`, {
        method: 'PATCH',
      });
      if (res.success) {
        toast.success(res.message);
        loadUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update user block status.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Manage Platform Users</h1>
          <p className="text-xs text-muted-foreground">
            Search, filter, inspect, and toggle block/unblock status for vendors and customers.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="p-4 rounded-3xl bg-card border border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or pizzeria..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-input bg-background text-xs focus:ring-2 focus:ring-pizza-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-pizza-600 text-white text-[10px] font-bold"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['All', 'vendor', 'customer', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  roleFilter === role
                    ? 'bg-pizza-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-bold border-b border-border">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Pizzeria (Vendor)</th>
                  <th className="p-4">Subscription</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-foreground">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-bold capitalize">
                        {u.role === 'admin' ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-pizza-600" />
                        ) : u.role === 'vendor' ? (
                          <Store className="w-3.5 h-3.5 text-orange-500" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-blue-500" />
                        )}
                        <span>{u.role}</span>
                      </span>
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {u.businessName || '—'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.subscriptionPlan === 'premium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {u.subscriptionPlan || 'free'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isBlocked
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {u.role !== 'admin' ? (
                        <button
                          onClick={() => handleToggleBlock(u._id)}
                          disabled={processingId === u._id}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-1 ml-auto transition-all ${
                            u.isBlocked
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-destructive/10 hover:bg-destructive hover:text-white text-destructive border border-destructive/20'
                          }`}
                        >
                          {u.isBlocked ? (
                            <>
                              <Unlock className="w-3 h-3" /> Unblock
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" /> Block User
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">Admin Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
