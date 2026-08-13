'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ProductForm } from '@/components/ProductForm';
import type { Product } from '@/lib/types';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Product>(`/products/by-id/${params.id}`, { auth: false })
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-sm text-espresso-400">Loading…</p>;
  if (!product) return <p className="text-sm text-espresso-500">Product not found.</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Edit product</h1>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
