'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Article } from '@/lib/types';

export function ArticleDetail({ article }: { article: Article }) {
  const { t } = useLanguage();
  const paragraphs = (article.body ?? '').split(/\n+/).filter(Boolean);
  const typeLabel = t(`encyclopedia.types.${article.type}`);

  return (
    <article className="container-page max-w-3xl py-10">
      <nav className="mb-6 text-xs text-espresso-400">
        <Link href="/encyclopedia" className="hover:text-espresso-700">{t('encyclopedia.eyebrow')}</Link> / {typeLabel}
      </nav>

      <span className="section-eyebrow">{typeLabel}</span>
      <h1 className="mt-1.5 font-heading text-3xl font-bold text-espresso-800 sm:text-4xl">{article.title}</h1>
      {article.summary && <p className="mt-4 text-lg leading-relaxed text-espresso-500">{article.summary}</p>}

      <div className="mt-8 h-56 rounded-xl2 bg-gradient-to-br from-espresso-500 to-espresso-700 sm:h-72" />

      <div className="prose prose-espresso mt-8 space-y-4">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-espresso-700">{p}</p>
          ))
        ) : (
          <p className="text-base text-espresso-500">{t('encyclopedia.bodyComingSoon')}</p>
        )}
      </div>

      {article.countrySlug && (
        <Link href={`/country/${article.countrySlug}`} className="btn-outline mt-10 inline-flex">
          {t('encyclopedia.exploreOrigin')} &rarr;
        </Link>
      )}
    </article>
  );
}
