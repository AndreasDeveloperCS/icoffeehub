'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Article } from '@/lib/types';

const TYPES = ['', 'encyclopedia', 'country', 'brew_guide', 'recipe', 'course', 'news'];

export function EncyclopediaList({ type, articles }: { type: string; articles: Article[] }) {
  const { t } = useLanguage();

  return (
    <div className="container-page py-10">
      <p className="section-eyebrow">{t('encyclopedia.eyebrow')}</p>
      <h1 className="mt-1.5 font-heading text-3xl font-bold text-espresso-800">{t('encyclopedia.title')}</h1>
      <p className="mt-2 max-w-xl text-sm text-espresso-500">{t('encyclopedia.subtitle')}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPES.map((value) => (
          <Link
            key={value}
            href={value ? `/encyclopedia?type=${value}` : '/encyclopedia'}
            className={`badge border ${type === value ? 'border-espresso-700 bg-espresso-700 text-cream-50' : 'border-espresso-200 bg-white text-espresso-600 hover:bg-espresso-50'}`}
          >
            {value ? t(`encyclopedia.types.${value}`) : t('encyclopedia.types.all')}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <p className="mt-10 text-sm text-espresso-500">{t('encyclopedia.empty')}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link key={a._id} href={`/encyclopedia/${a.slug}`} className="card flex flex-col p-5 hover:shadow-card-hover">
              <span className="section-eyebrow">{t(`encyclopedia.types.${a.type}`)}</span>
              <h2 className="mt-2 line-clamp-2 font-heading text-lg font-semibold text-espresso-800">{a.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-espresso-500">{a.summary}</p>
              <span className="mt-4 text-sm font-semibold text-espresso-700">{t('encyclopedia.readMore')} &rarr;</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
