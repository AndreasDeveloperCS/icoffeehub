'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { ReturnRequest } from '@/lib/types';

export default function SellerReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[] | null>(null);

  function load() {
    api<ReturnRequest[]>('/returns/seller/mine').then(setReturns).catch(() => setReturns([]));
  }

  useEffect(load, []);

  async function setStatus(id: string, status: string) {
    await api(`/returns/${id}/status`, { method: 'PATCH', body: { status } });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Return Requests</h1>

      {!returns ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : returns.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">No return requests.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {returns.map((r) => (
            <div key={r._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-espresso-800">{r.sku}</p>
                <p className="text-xs text-espresso-400">{r.reason}</p>
                {r.refundAmount && <p className="text-xs text-espresso-500">Refund: {formatMoney(r.refundAmount)}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="badge bg-gold-50 text-gold-700 capitalize">{r.status}</span>
                {r.status === 'requested' && (
                  <>
                    <button onClick={() => setStatus(r._id, 'rejected')} className="btn-outline">Reject</button>
                    <button onClick={() => setStatus(r._id, 'approved')} className="btn-primary">Approve</button>
                  </>
                )}
                {r.status === 'approved' && (
                  <button onClick={() => setStatus(r._id, 'refunded')} className="btn-primary">Mark refunded</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
