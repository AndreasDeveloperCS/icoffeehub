'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { Order, Product, SellerCompany } from '@/lib/types';

export default function SellerDashboardPage() {
  const [company, setCompany] = useState<SellerCompany | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<SellerCompany>('/sellers/me').catch(() => null),
      api<Product[]>('/products/mine').catch(() => []),
      api<Order[]>('/orders/seller/mine').catch(() => []),
    ]).then(([c, p, o]) => {
      setCompany(c);
      setProducts(p);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-sm text-espresso-400">Loading…</p>;

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.variants.some((v) => v.stock <= 5));
  const pendingReview = products.filter((p) => p.status === 'pending_review');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-espresso-800">
          {company?.companyName ?? 'Your storefront'}
        </h1>
        {company?.status === 'pending' && (
          <div className="mt-3 rounded-lg border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-espresso-700">
            Your seller account is <strong>pending admin review</strong>. You can prepare products now, but they
            won&apos;t be publicly listed until your company profile is approved.
          </div>
        )}
        {company?.status === 'rejected' && (
          <div className="mt-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            Your seller application was not approved. Please review your{' '}
            <Link href="/seller/profile" className="underline">company profile</Link> and contact support.
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Products" value={products.length} />
        <StatCard label="Orders" value={orders.length} />
        <StatCard label="Revenue" value={formatMoney(revenue)} />
        <StatCard label="Low stock" value={lowStock.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-espresso-800">Products pending review</h2>
            <Link href="/seller/products" className="text-xs font-semibold text-espresso-600 hover:underline">View all</Link>
          </div>
          {pendingReview.length === 0 ? (
            <p className="mt-3 text-sm text-espresso-500">Nothing awaiting review.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {pendingReview.map((p) => (
                <li key={p._id} className="text-sm text-espresso-600">{p.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-espresso-800">Recent orders</h2>
            <Link href="/seller/orders" className="text-xs font-semibold text-espresso-600 hover:underline">View all</Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-espresso-500">No orders yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {orders.slice(0, 5).map((o) => (
                <li key={o._id} className="flex justify-between text-sm text-espresso-600">
                  <span>#{o._id.slice(-6).toUpperCase()}</span>
                  <span>{formatMoney(o.total, o.currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Link href="/seller/products/new" className="btn-primary inline-flex">+ Add a product</Link>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-espresso-400">{label}</p>
      <p className="mt-1.5 font-heading text-2xl font-bold text-espresso-800">{value}</p>
    </div>
  );
}
