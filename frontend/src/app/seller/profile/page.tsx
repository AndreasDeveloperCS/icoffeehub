'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { formatLabel } from '@/lib/format';
import type { SellerCompany } from '@/lib/types';

const SELLER_TYPES = ['farm', 'roaster', 'importer_exporter', 'coffee_shop', 'equipment_vendor', 'course_provider'];

export default function SellerProfilePage() {
  const [company, setCompany] = useState<SellerCompany | null>(null);
  const [form, setForm] = useState({ companyName: '', sellerType: 'roaster', description: '', country: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api<SellerCompany>('/sellers/me').then((c) => {
      setCompany(c);
      setForm({ companyName: c.companyName, sellerType: c.sellerType, description: c.description ?? '', country: c.country ?? '' });
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await api<SellerCompany>('/sellers/me', { method: 'PATCH', body: form });
      setCompany(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  }

  if (!company) return <p className="text-sm text-espresso-400">Loading…</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Company Profile</h1>
      <div className="mt-2 flex items-center gap-2">
        <span className="badge bg-cream-200 text-espresso-700 capitalize">{company.status}</span>
        <span className="text-xs text-espresso-400">Public page: /sellers/{company.slug}</span>
      </div>

      <form onSubmit={onSubmit} className="card mt-6 max-w-xl space-y-4 p-6">
        <div>
          <label className="label">Company name</label>
          <input required className="input" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        </div>
        <div>
          <label className="label">Seller type</label>
          <select className="input" value={form.sellerType} onChange={(e) => setForm({ ...form, sellerType: e.target.value })}>
            {SELLER_TYPES.map((t) => (
              <option key={t} value={t}>{formatLabel(t)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Home country</label>
          <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. US" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
