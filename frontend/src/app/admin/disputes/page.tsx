'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Dispute } from '@/lib/types';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[] | null>(null);
  const [resolution, setResolution] = useState<Record<string, string>>({});

  function load() {
    api<Dispute[]>('/admin/disputes').then(setDisputes).catch(() => setDisputes([]));
  }

  useEffect(load, []);

  async function resolve(id: string, status: 'resolved' | 'rejected') {
    await api(`/admin/disputes/${id}`, { method: 'PATCH', body: { status, resolution: resolution[id] } });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Disputes</h1>

      {!disputes ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : disputes.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">No disputes filed.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {disputes.map((d) => (
            <div key={d._id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-espresso-800">Order #{d.orderId.slice(-6).toUpperCase()}</p>
                <span className={`badge capitalize ${d.status === 'open' ? 'bg-gold-50 text-gold-700' : d.status === 'resolved' ? 'bg-forest-50 text-forest-700' : 'bg-red-50 text-red-700'}`}>{d.status}</span>
              </div>
              <p className="mt-1 text-sm text-espresso-600">{d.reason}</p>
              {d.description && <p className="mt-1 text-sm text-espresso-500">{d.description}</p>}
              {d.status === 'open' && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-espresso-100 pt-3">
                  <input
                    className="input flex-1"
                    placeholder="Resolution note"
                    value={resolution[d._id] ?? ''}
                    onChange={(e) => setResolution({ ...resolution, [d._id]: e.target.value })}
                  />
                  <button onClick={() => resolve(d._id, 'rejected')} className="btn-outline">Reject</button>
                  <button onClick={() => resolve(d._id, 'resolved')} className="btn-primary">Resolve</button>
                </div>
              )}
              {d.resolution && <p className="mt-2 text-xs text-espresso-500">Resolution: {d.resolution}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
