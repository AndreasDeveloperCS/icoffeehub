'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { SupportTicket } from '@/lib/types';

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reply, setReply] = useState<Record<string, string>>({});

  function load() {
    api<SupportTicket[]>('/tickets/mine').then(setTickets).catch(() => setTickets([]));
  }

  useEffect(load, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api('/tickets', { method: 'POST', body: form });
      setForm({ subject: '', message: '' });
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function sendReply(id: string) {
    const message = reply[id];
    if (!message) return;
    await api(`/tickets/${id}/reply`, { method: 'POST', body: { message } });
    setReply({ ...reply, [id]: '' });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Support</h1>
      <p className="mt-1 text-sm text-espresso-500">Questions about an order, a seller, or the platform? We&apos;re here to help.</p>

      <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-5">
        <h2 className="font-heading text-sm font-bold text-espresso-800">New ticket</h2>
        <input required className="input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <textarea required className="input min-h-[80px]" placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Sending…' : 'Submit ticket'}
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {tickets.map((t) => (
          <div key={t._id} className="card p-4">
            <div className="flex items-center justify-between">
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
              <div className="mt-3 flex gap-2 border-t border-espresso-100 pt-3">
                <input
                  className="input flex-1"
                  placeholder="Add a reply…"
                  value={reply[t._id] ?? ''}
                  onChange={(e) => setReply({ ...reply, [t._id]: e.target.value })}
                />
                <button onClick={() => sendReply(t._id)} className="btn-outline">Send</button>
              </div>
            )}
          </div>
        ))}
        {tickets.length === 0 && <p className="text-sm text-espresso-500">No support tickets yet.</p>}
      </div>
    </div>
  );
}
