'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatLabel } from '@/lib/format';
import type { SellerCompany } from '@/lib/types';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerCompany[] | null>(null);

  function load() {
    api<SellerCompany[]>('/admin/sellers/pending').then(setSellers).catch(() => setSellers([]));
  }

  useEffect(load, []);

  async function setStatus(id: string, status: 'approved' | 'rejected') {
    await api(`/admin/sellers/${id}/status`, { method: 'PATCH', body: { status } });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Seller Approvals</h1>

      {!sellers ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : sellers.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">No sellers awaiting review.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {sellers.map((s) => (
            <div key={s._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-espresso-800">{s.companyName}</p>
                <p className="text-xs text-espresso-400">{formatLabel(s.sellerType)} · {s.country}</p>
                {s.description && <p className="mt-1 max-w-md text-sm text-espresso-500">{s.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStatus(s._id, 'rejected')} className="btn-outline">Reject</button>
                <button onClick={() => setStatus(s._id, 'approved')} className="btn-primary">Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
