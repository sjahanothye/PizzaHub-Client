'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { fetchApi } from '../../../../lib/api';
import { toast } from 'sonner';
import { CreditCard, DollarSign, Calendar, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetchApi('/subscription/transactions');
        if (res.success && res.transactions) {
          setTransactions(res.transactions);
        }
      } catch (err) {
        toast.error('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const totalAmount = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground">Platform Transactions</h1>
            <p className="text-xs text-muted-foreground">
              Audit log of all vendor Stripe premium subscription payments. Records are immutable and read-only.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-pizza-600" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Platform Revenue</p>
              <p className="text-lg font-black text-foreground">${totalAmount.toFixed(2)} USD</p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-bold border-b border-border">
                <tr>
                  <th className="p-4">Vendor Restaurant</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Stripe Session ID</th>
                  <th className="p-4 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-foreground">
                          {tx.vendor?.businessName || tx.vendor?.name || 'Artisan Pizzeria'}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{tx.vendor?.email}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        {tx.plan}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-foreground">
                      ${tx.amount?.toFixed(2)} {tx.currency || 'USD'}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold uppercase text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{tx.status}</span>
                      </span>
                    </td>

                    <td className="p-4 font-mono text-[10px] text-muted-foreground truncate max-w-[180px]">
                      {tx.stripeSessionId}
                    </td>

                    <td className="p-4 text-right text-muted-foreground text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No platform subscription transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
