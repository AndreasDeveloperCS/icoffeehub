'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatLabel, formatMoney, lowestPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);

  function load() {
    api<Product[]>('/admin/products/pending').then(setProducts).catch(() => setProducts([]));
  }

  useEffect(load, []);

  async function setStatus(id: string, status: 'active' | 'rejected') {
    await api(`/admin/products/${id}/status`, { method: 'PATCH', body: { status } });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Product Moderation</h1>

      {!products ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">No products awaiting review.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {products.map((p) => (
            <div key={p._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-espresso-800">{p.name}</p>
                <p className="text-xs text-espresso-400">
                  {p.originCountry} · {formatLabel(p.roastLevel)} · {formatMoney(lowestPrice(p.variants))}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStatus(p._id, 'rejected')} className="btn-outline">Reject</button>
                <button onClick={() => setStatus(p._id, 'active')} className="btn-primary">Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
