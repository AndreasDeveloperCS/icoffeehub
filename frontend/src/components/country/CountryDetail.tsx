'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Article, Country, ProductListResponse } from '@/lib/types';

export function CountryDetail({
  country,
  products,
  articles,
}: {
  country: Country;
  products: ProductListResponse;
  articles: Article[];
}) {
  const { t } = useLanguage();

  return (
    <div>
      <section className="bg-gradient-to-br from-espresso-700 to-espresso-800 text-cream-50">
        <div className="container-page py-16">
          <span className="section-eyebrow text-gold-400">{country.region}</span>
          <h1 className="mt-1.5 font-heading text-4xl font-bold">{country.name}</h1>
          {country.summary && <p className="mt-3 max-w-2xl text-cream-200/85">{country.summary}</p>}
        </div>
      </section>

      <div className="container-page py-12">
        {products.items.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-espresso-800">{t('country.coffeeFrom', { country: country.name })}</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-espresso-800">{t('country.storiesAndGuides')}</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link key={a._id} href={`/encyclopedia/${a.slug}`} className="card p-5 hover:shadow-card-hover">
                  <h3 className="font-heading text-base font-semibold text-espresso-800">{a.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-espresso-500">{a.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {products.items.length === 0 && articles.length === 0 && (
          <p className="text-sm text-espresso-500">{t('country.noListings', { country: country.name })}</p>
        )}
      </div>
    </div>
  );
}
