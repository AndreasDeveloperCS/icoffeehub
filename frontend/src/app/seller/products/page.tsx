'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatLabel, formatMoney, lowestPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-forest-50 text-forest-700',
  pending_review: 'bg-gold-50 text-gold-700',
  rejected: 'bg-red-50 text-red-700',
  draft: 'bg-espresso-50 text-espresso-600',
  archived: 'bg-espresso-50 text-espresso-400',
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    api<Product[]>('/products/mine').then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-espresso-800">Products</h1>
        <Link href="/seller/products/new" className="btn-primary">+ Add product</Link>
      </div>

      {!products ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">You haven&apos;t listed any products yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl2 border border-espresso-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-100 text-xs uppercase tracking-wide text-espresso-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-espresso-100">
                  <td className="px-4 py-3 font-medium text-espresso-800">{p.name}</td>
                  <td className="px-4 py-3 text-espresso-600">{formatMoney(lowestPrice(p.variants))}</td>
                  <td className="px-4 py-3 text-espresso-600">{p.variants.reduce((s, v) => s + v.stock, 0)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_STYLES[p.status] ?? ''}`}>{formatLabel(p.status)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/seller/products/${p._id}/edit`} className="text-sm font-semibold text-espresso-600 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
