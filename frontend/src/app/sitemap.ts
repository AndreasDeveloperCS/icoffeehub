import type { MetadataRoute } from 'next';
import { api } from '@/lib/api';
import type { Article, Country, ProductListResponse } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

// Doc 09 targets 100,000+ indexed pages long-term (one per product, article and
// country). This generates real entries for everything currently published;
// as the catalog grows, swap the single fetch below for paginated batches.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, countries, products] = await Promise.all([
    safe(api<Article[]>('/articles', { auth: false }), []),
    safe(api<Country[]>('/countries', { auth: false }), []),
    safe(api<ProductListResponse>('/products?limit=48', { auth: false }), { items: [], total: 0, page: 1, limit: 48, pages: 0 }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/marketplace`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/encyclopedia`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/ai-assistant`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/encyclopedia/${a.slug}`,
    lastModified: a.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const countryPages: MetadataRoute.Sitemap = countries.map((c) => ({
    url: `${SITE_URL}/country/${c.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = products.items.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...countryPages, ...productPages];
}
