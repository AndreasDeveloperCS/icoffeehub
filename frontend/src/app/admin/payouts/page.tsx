'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { SellerCompany, SellerPayout } from '@/lib/types';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<SellerPayout[]>([]);
  const [sellers, setSellers] = useState<SellerCompany[]>([]);
  const [form, setForm] = useState({ sellerId: '', periodStart: '', periodEnd: '' });
  const [generating, setGenerating] = useState(false);

  function load() {
    api<SellerPayout[]>('/payouts/admin/all').then(setPayouts).catch(() => setPayouts([]));
  }

  useEffect(() => {
    load();
    api<SellerCompany[]>('/sellers', { auth: false }).then(setSellers).catch(() => setSellers([]));
  }, []);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    try {
      await api('/payouts/admin/generate', { method: 'POST', body: form });
      load();
    } finally {
      setGenerating(false);
    }
  }

  async function markPaid(id: string) {
    await api(`/payouts/admin/${id}/paid`, { method: 'PATCH' });
    load();
  }

  const sellerName = (id: string) => sellers.find((s) => s._id === id)?.companyName ?? id.slice(-6);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Seller Payouts</h1>

      <form onSubmit={generate} className="card mt-6 flex flex-wrap items-end gap-3 p-5">
        <div>
          <label className="label">Seller</label>
          <select required className="input" value={form.sellerId} onChange={(e) => setForm({ ...form, sellerId: e.target.value })}>
            <option value="">Select seller</option>
            {sellers.map((s) => (
              <option key={s._id} value={s._id}>{s.companyName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Period start</label>
          <input required type="date" className="input" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} />
        </div>
        <div>
          <label className="label">Period end</label>
          <input required type="date" className="input" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} />
        </div>
        <button type="submit" disabled={generating} className="btn-primary">
          {generating ? 'Generating…' : 'Generate payout'}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {payouts.map((p) => (
          <div key={p._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold text-espresso-800">{sellerName(p.sellerId)}</p>
              <p className="text-xs text-espresso-400">
                {new Date(p.periodStart).toLocaleDateString()} – {new Date(p.periodEnd).toLocaleDateString()} · Gross {formatMoney(p.grossSales)} · Net {formatMoney(p.netPayout)}
              </p>
            </div>
            {p.status === 'paid' ? (
              <span className="badge bg-forest-50 text-forest-700">Paid</span>
            ) : (
              <button onClick={() => markPaid(p._id)} className="btn-primary">Mark paid</button>
            )}
          </div>
        ))}
        {payouts.length === 0 && <p className="text-sm text-espresso-500">No payouts generated yet.</p>}
      </div>
    </div>
  );
}
