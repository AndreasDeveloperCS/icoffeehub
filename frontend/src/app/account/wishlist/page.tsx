'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/types';

export default function WishlistPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all(user.wishlist.map((id) => api<Product>(`/products/by-id/${id}`, { auth: false }).catch(() => null)))
      .then((results) => setProducts(results.filter(Boolean) as Product[]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Wishlist</h1>

      {loading ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">
          Nothing saved yet. Save a coffee from its product page to see it here.{' '}
          <Link href="/marketplace" className="font-semibold underline">Browse the marketplace</Link>
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
