'use client';

import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function JournalPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const entries = [...(user?.tastingJournal ?? [])].reverse();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">{t('account.nav.journal')}</h1>
      <p className="mt-1 text-sm text-espresso-500">{t('journal.intro')}</p>

      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">{t('journal.empty')}</p>
      ) : (
        <div className="mt-5 space-y-3">
          {entries.map((e, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-espresso-400">{new Date(e.createdAt).toLocaleDateString()}</span>
                {typeof e.rating === 'number' && <span className="badge bg-gold-50 text-gold-700">{e.rating}/5</span>}
              </div>
              <p className="mt-2 text-sm text-espresso-700">{e.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
