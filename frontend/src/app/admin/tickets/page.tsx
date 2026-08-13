'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { SupportTicket } from '@/lib/types';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [reply, setReply] = useState<Record<string, string>>({});

  function load() {
    api<SupportTicket[]>('/admin/tickets').then(setTickets).catch(() => setTickets([]));
  }

  useEffect(load, []);

  async function sendReply(id: string, close: boolean) {
    const message = reply[id];
    if (!message) return;
    await api(`/admin/tickets/${id}/reply`, { method: 'POST', body: { message, close } });
    setReply({ ...reply, [id]: '' });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Support Tickets</h1>

      {!tickets ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : tickets.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">No support tickets.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {tickets.map((t) => (
            <div key={t._id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-espresso-800">{t.subject}</p>
                <span className={`badge capitalize ${t.status === 'open' ? 'bg-gold-50 text-gold-700' : 'bg-espresso-50 text-espresso-500'}`}>{t.status}</span>
              </div>
              <p className="mt-1 text-sm text-espresso-600">{t.message}</p>
              {t.replies.length > 0 && (
                <div className="mt-2 space-y-1.5 border-t border-espresso-100 pt-2">
                  {t.replies.map((r, i) => (
                    <p key={i} className="text-xs text-espresso-500">
                      <span className="font-semibold capitalize text-espresso-700">{r.authorRole}: </span>
                      {r.message}
                    </p>
                  ))}
                </div>
              )}
              {t.status === 'open' && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-espresso-100 pt-3">
                  <input
                    className="input flex-1"
                    placeholder="Reply…"
                    value={reply[t._id] ?? ''}
                    onChange={(e) => setReply({ ...reply, [t._id]: e.target.value })}
                  />
                  <button onClick={() => sendReply(t._id, false)} className="btn-outline">Reply</button>
                  <button onClick={() => sendReply(t._id, true)} className="btn-primary">Reply &amp; close</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
