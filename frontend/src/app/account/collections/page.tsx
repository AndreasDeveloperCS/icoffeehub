'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { ProductCollection } from '@/lib/types';

export default function CollectionsPage() {
  const { t } = useLanguage();
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [form, setForm] = useState({ name: '', description: '', isPublic: false });
  const [creating, setCreating] = useState(false);

  function load() {
    api<ProductCollection[]>('/collections/mine').then(setCollections).catch(() => setCollections([]));
  }

  useEffect(load, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await api('/collections', { method: 'POST', body: form });
      setForm({ name: '', description: '', isPublic: false });
      load();
    } finally {
      setCreating(false);
    }
  }

  async function remove(id: string) {
    await api(`/collections/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">{t('account.nav.collections')}</h1>
      <p className="mt-1 text-sm text-espresso-500">{t('collections.intro')}</p>

      <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-5">
        <h2 className="font-heading text-sm font-bold text-espresso-800">{t('collections.newCollection')}</h2>
        <input required className="input" placeholder={t('collections.namePlaceholder')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea className="input min-h-[60px]" placeholder={t('collections.descriptionPlaceholder')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-2 text-sm text-espresso-600">
          <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} />
          {t('collections.makeShareable')}
        </label>
        <button type="submit" disabled={creating} className="btn-primary">
          {creating ? t('collections.creating') : t('collections.createCollection')}
        </button>
      </form>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {collections.map((c) => (
          <div key={c._id} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="font-heading font-semibold text-espresso-800">{c.name}</p>
              {c.isPublic && <span className="badge bg-forest-50 text-forest-700">{t('collections.public')}</span>}
            </div>
            {c.description && <p className="mt-1 text-sm text-espresso-500">{c.description}</p>}
            <p className="mt-2 text-xs text-espresso-400">
              {c.productIds.length === 1
                ? t('collections.productCountOne', { count: c.productIds.length })
                : t('collections.productCountOther', { count: c.productIds.length })}
            </p>
            <button onClick={() => remove(c._id)} className="mt-3 text-xs text-red-600 hover:underline">{t('common.delete')}</button>
          </div>
        ))}
        {collections.length === 0 && <p className="text-sm text-espresso-500">{t('collections.empty')}</p>}
      </div>
    </div>
  );
}
