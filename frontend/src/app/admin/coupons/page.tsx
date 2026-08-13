'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { Coupon } from '@/lib/types';

const EMPTY = { code: '', type: 'percent' as 'percent' | 'fixed', value: 10, minOrderAmount: 0, maxUses: '' };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState(EMPTY);

  function load() {
    api<Coupon[]>('/promotions/admin/all').then(setCoupons).catch(() => setCoupons([]));
  }

  useEffect(load, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api('/promotions/admin', {
      method: 'POST',
      body: { ...form, maxUses: form.maxUses ? Number(form.maxUses) : undefined },
    });
    setForm(EMPTY);
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    await api(`/promotions/admin/${id}/active`, { method: 'PATCH', body: { active: !active } });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Coupons &amp; Promotions</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {coupons.map((c) => (
            <div key={c._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-heading font-semibold text-espresso-800">{c.code}</p>
                <p className="text-xs text-espresso-400">
                  {c.type === 'percent' ? `${c.value}% off` : `${formatMoney(c.value)} off`}
                  {c.minOrderAmount > 0 && ` · min ${formatMoney(c.minOrderAmount)}`}
                  {' · '}used {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''}
                </p>
              </div>
              <button onClick={() => toggleActive(c._id, c.active)} className={`badge border ${c.active ? 'border-forest-300 bg-forest-50 text-forest-700' : 'border-espresso-200 bg-espresso-50 text-espresso-500'}`}>
                {c.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
          {coupons.length === 0 && <p className="text-sm text-espresso-500">No coupons yet.</p>}
        </div>

        <form onSubmit={onSubmit} className="card h-fit space-y-3 p-5">
          <h2 className="font-heading text-sm font-bold text-espresso-800">New coupon</h2>
          <div>
            <label className="label">Code</label>
            <input required className="input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}>
                <option value="percent">Percent off</option>
                <option value="fixed">Fixed amount off</option>
              </select>
            </div>
            <div>
              <label className="label">Value</label>
              <input type="number" className="input" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Min order</label>
              <input type="number" className="input" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Max uses</label>
              <input type="number" className="input" placeholder="unlimited" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Create coupon</button>
        </form>
      </div>
    </div>
  );
}
