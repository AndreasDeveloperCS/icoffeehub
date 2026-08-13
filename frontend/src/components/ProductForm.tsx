'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { formatLabel } from '@/lib/format';
import { FLAVOR_NOTES, PROCESSING_METHODS, ROAST_LEVELS } from '@/lib/coffee-options';
import type { Product, ProductVariant } from '@/lib/types';

interface FormState {
  name: string;
  category: string;
  description: string;
  originCountry: string;
  farmName: string;
  variety: string;
  altitudeMeters: string;
  roastLevel: string;
  processingMethod: string;
  flavorNotes: string[];
  variants: ProductVariant[];
}

const CATEGORIES = ['roasted_beans', 'green_beans', 'ground_coffee', 'equipment', 'subscription_box'];

function toFormState(p?: Product): FormState {
  return {
    name: p?.name ?? '',
    category: p?.category ?? 'roasted_beans',
    description: p?.description ?? '',
    originCountry: p?.originCountry ?? '',
    farmName: p?.farmName ?? '',
    variety: p?.variety ?? '',
    altitudeMeters: p?.altitudeMeters ? String(p.altitudeMeters) : '',
    roastLevel: p?.roastLevel ?? 'medium',
    processingMethod: p?.processingMethod ?? 'washed',
    flavorNotes: p?.flavorNotes ?? [],
    variants: p?.variants?.length
      ? p.variants
      : [{ sku: '', weightGrams: 250, price: 15, currency: 'USD', stock: 20 }],
  };
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(product));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateVariant(index: number, patch: Partial<ProductVariant>) {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));
  }

  function addVariant() {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { sku: '', weightGrams: 1000, price: 30, currency: 'USD', stock: 10 }],
    }));
  }

  function removeVariant(index: number) {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));
  }

  function toggleFlavor(note: string) {
    setForm((f) => ({
      ...f,
      flavorNotes: f.flavorNotes.includes(note) ? f.flavorNotes.filter((n) => n !== note) : [...f.flavorNotes, note],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        ...form,
        altitudeMeters: form.altitudeMeters ? Number(form.altitudeMeters) : undefined,
        variants: form.variants.map((v, i) => ({
          ...v,
          sku: v.sku || `${form.name.toLowerCase().replace(/\s+/g, '-')}-${i}`,
          weightGrams: Number(v.weightGrams),
          price: Number(v.price),
          stock: Number(v.stock),
        })),
      };
      if (product) {
        await api(`/products/${product._id}`, { method: 'PATCH', body: payload });
      } else {
        await api('/products', { method: 'POST', body: payload });
      }
      router.push('/seller/products');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save product.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="card space-y-4 p-6">
        <h2 className="font-heading text-sm font-bold text-espresso-800">Basics</h2>
        <div>
          <label className="label">Product name</label>
          <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{formatLabel(c)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Origin country</label>
            <input className="input" value={form.originCountry} onChange={(e) => setForm({ ...form, originCountry: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[90px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="font-heading text-sm font-bold text-espresso-800">Origin &amp; Roast</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Farm / producer</label>
            <input className="input" value={form.farmName} onChange={(e) => setForm({ ...form, farmName: e.target.value })} />
          </div>
          <div>
            <label className="label">Variety</label>
            <input className="input" value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} />
          </div>
          <div>
            <label className="label">Altitude (m)</label>
            <input type="number" className="input" value={form.altitudeMeters} onChange={(e) => setForm({ ...form, altitudeMeters: e.target.value })} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Roast level</label>
            <select className="input" value={form.roastLevel} onChange={(e) => setForm({ ...form, roastLevel: e.target.value })}>
              {ROAST_LEVELS.map((r) => (
                <option key={r} value={r}>{formatLabel(r)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Processing method</label>
            <select className="input" value={form.processingMethod} onChange={(e) => setForm({ ...form, processingMethod: e.target.value })}>
              {PROCESSING_METHODS.map((p) => (
                <option key={p} value={p}>{formatLabel(p)}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Flavor notes</label>
          <div className="flex flex-wrap gap-2">
            {FLAVOR_NOTES.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => toggleFlavor(f)}
                className={`badge border ${form.flavorNotes.includes(f) ? 'border-espresso-700 bg-espresso-700 text-cream-50' : 'border-espresso-200 bg-white text-espresso-600'}`}
              >
                {formatLabel(f)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold text-espresso-800">Bag sizes &amp; pricing</h2>
          <button type="button" onClick={addVariant} className="text-sm font-semibold text-espresso-600 hover:underline">
            + Add size
          </button>
        </div>
        <div className="space-y-3">
          {form.variants.map((v, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 rounded-lg border border-espresso-100 p-3 sm:grid-cols-5">
              <div>
                <label className="label">SKU</label>
                <input className="input" value={v.sku} onChange={(e) => updateVariant(i, { sku: e.target.value })} placeholder="auto" />
              </div>
              <div>
                <label className="label">Weight (g)</label>
                <input type="number" className="input" value={v.weightGrams} onChange={(e) => updateVariant(i, { weightGrams: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label">Price (USD)</label>
                <input type="number" step="0.01" className="input" value={v.price} onChange={(e) => updateVariant(i, { price: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label">Stock</label>
                <input type="number" className="input" value={v.stock} onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })} />
              </div>
              <div className="flex items-end">
                {form.variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="text-sm text-red-600 hover:underline">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? 'Saving…' : product ? 'Save changes' : 'Submit for review'}
      </button>
      <p className="text-xs text-espresso-400">
        New and edited products go through a quick moderation review before they appear in the marketplace.
      </p>
    </form>
  );
}
