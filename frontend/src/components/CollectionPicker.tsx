'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { ProductCollection } from '@/lib/types';

export function CollectionPicker({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<ProductCollection[]>([]);

  useEffect(() => {
    if (!open || !user) return;
    api<ProductCollection[]>('/collections/mine').then(setCollections).catch(() => setCollections([]));
  }, [open, user]);

  if (!user) return null;

  async function toggle(id: string) {
    const updated = await api<ProductCollection>(`/collections/${id}/products/${productId}`, { method: 'POST' });
    setCollections((cs) => cs.map((c) => (c._id === id ? updated : c)));
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="text-sm font-semibold text-espresso-600 hover:text-espresso-900">
        {t('collectionPicker.saveToCollection')}
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-2 w-64 rounded-xl border border-espresso-100 bg-white p-3 shadow-card-hover" onMouseLeave={() => setOpen(false)}>
          {collections.length === 0 ? (
            <p className="text-xs text-espresso-500">
              {t('collectionPicker.noCollections')}{' '}
              <a href="/account/collections" className="underline">{t('collectionPicker.yourAccount')}</a>.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {collections.map((c) => (
                <li key={c._id}>
                  <label className="flex items-center gap-2 text-sm text-espresso-700">
                    <input type="checkbox" checked={c.productIds.includes(productId)} onChange={() => toggle(c._id)} />
                    {c.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
