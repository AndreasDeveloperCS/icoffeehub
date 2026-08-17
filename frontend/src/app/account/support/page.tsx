'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { SupportTicket } from '@/lib/types';

export default function SupportPage() {
  const { t } = useLanguage();
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
      <h1 className="font-heading text-2xl font-bold text-espresso-800">{t('account.nav.support')}</h1>
      <p className="mt-1 text-sm text-espresso-500">{t('support.intro')}</p>

      <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-5">
        <h2 className="font-heading text-sm font-bold text-espresso-800">{t('support.newTicket')}</h2>
        <input required className="input" placeholder={t('support.subject')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <textarea required className="input min-h-[80px]" placeholder={t('support.howCanWeHelp')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? t('support.sending') : t('support.submitTicket')}
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {tickets.map((tk) => (
          <div key={tk._id} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-espresso-800">{tk.subject}</p>
              <span className={`badge capitalize ${tk.status === 'open' ? 'bg-gold-50 text-gold-700' : 'bg-espresso-50 text-espresso-500'}`}>{tk.status}</span>
            </div>
            <p className="mt-1 text-sm text-espresso-600">{tk.message}</p>
            {tk.replies.length > 0 && (
              <div className="mt-2 space-y-1.5 border-t border-espresso-100 pt-2">
                {tk.replies.map((r, i) => (
                  <p key={i} className="text-xs text-espresso-500">
                    <span className="font-semibold capitalize text-espresso-700">{r.authorRole}: </span>
                    {r.message}
                  </p>
                ))}
              </div>
            )}
            {tk.status === 'open' && (
              <div className="mt-3 flex gap-2 border-t border-espresso-100 pt-3">
                <input
                  className="input flex-1"
                  placeholder={t('support.addReply')}
                  value={reply[tk._id] ?? ''}
                  onChange={(e) => setReply({ ...reply, [tk._id]: e.target.value })}
                />
                <button onClick={() => sendReply(tk._id)} className="btn-outline">{t('aiChat.send')}</button>
              </div>
            )}
          </div>
        ))}
        {tickets.length === 0 && <p className="text-sm text-espresso-500">{t('support.empty')}</p>}
      </div>
    </div>
  );
}
