import Link from 'next/link';
import { api } from '@/lib/api';
import { ProductCard, BeanIcon } from '@/components/ProductCard';
import { Hero, TrustStrip, AiTeaser, SellerCta, Section } from '@/components/home/HomeSections';
import type { Article, Country, Product } from '@/lib/types';

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [featured, countries, articles] = await Promise.all([
    safe(api<Product[]>('/products/featured', { auth: false }), []),
    safe(api<Country[]>('/countries?originOnly=true', { auth: false }), []),
    safe(api<Article[]>('/articles', { auth: false }), []),
  ]);

  return (
    <div>
      <Hero />
      <TrustStrip />

      {countries.length > 0 && (
        <Section eyebrowKey="home.originSection.eyebrow" titleKey="home.originSection.title">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {countries.slice(0, 12).map((c) => (
              <Link
                key={c._id}
                href={`/country/${c.slug}`}
                className="card group flex flex-col items-center gap-2 px-3 py-6 text-center hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso-50 text-espresso-600 group-hover:bg-gold-100 group-hover:text-gold-700">
                  <BeanIcon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-espresso-800">{c.name}</span>
                <span className="text-xs text-espresso-400">{c.region}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {featured.length > 0 && (
        <Section
          eyebrowKey="home.featuredSection.eyebrow"
          titleKey="home.featuredSection.title"
          action={{ href: '/marketplace', labelKey: 'home.featuredSection.action' }}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Section>
      )}

      <AiTeaser />

      {articles.length > 0 && (
        <Section
          eyebrowKey="home.learnSection.eyebrow"
          titleKey="home.learnSection.title"
          action={{ href: '/encyclopedia', labelKey: 'home.learnSection.action' }}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 4).map((a) => (
              <Link key={a._id} href={`/encyclopedia/${a.slug}`} className="card flex flex-col p-5 hover:shadow-card-hover">
                <span className="section-eyebrow">{a.type.replace('_', ' ')}</span>
                <h3 className="mt-2 line-clamp-2 font-heading text-base font-semibold text-espresso-800">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-espresso-500">{a.summary}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <SellerCta />
    </div>
  );
}
