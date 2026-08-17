'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function JournalNote({ productId }: { productId: string }) {
  const { user, refresh } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(4);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  async function onSave() {
    setSaving(true);
    try {
      await api(`/users/me/journal/${productId}`, { method: 'POST', body: { note, rating } });
      await refresh();
      setSaved(true);
      setNote('');
      setOpen(false);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-espresso-600 hover:text-espresso-900">
        {saved ? t('journalNote.saved') : t('journalNote.addNote')}
      </button>
    );
  }

  return (
    <div className="card space-y-3 p-4">
      <textarea
        className="input min-h-[70px]"
        placeholder={t('journalNote.placeholder')}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-espresso-500">
          {t('journalNote.rating')}
          <select className="input w-auto py-1.5" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(false)} className="btn-outline">{t('common.cancel')}</button>
          <button type="button" onClick={onSave} disabled={saving || !note} className="btn-primary">
            {saving ? t('journalNote.saving') : t('journalNote.saveNote')}
          </button>
        </div>
      </div>
    </div>
  );
}
