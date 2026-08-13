'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';

interface DashboardStats {
  sellersTotal: number;
  sellersPending: number;
  productsActive: number;
  ordersTotal: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api<DashboardStats>('/admin/dashboard').then(setStats);
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Platform Overview</h1>

      {!stats ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Approved sellers" value={stats.sellersTotal} />
          <StatCard label="Pending sellers" value={stats.sellersPending} accent />
          <StatCard label="Active products" value={stats.productsActive} />
          <StatCard label="Orders" value={stats.ordersTotal} />
          <StatCard label="Revenue" value={formatMoney(stats.revenue)} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`card p-5 ${accent ? 'border-gold-300 bg-gold-50' : ''}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-espresso-400">{label}</p>
      <p className="mt-1.5 font-heading text-2xl font-bold text-espresso-800">{value}</p>
    </div>
  );
}
