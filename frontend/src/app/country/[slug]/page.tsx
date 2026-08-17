import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CountryDetail } from '@/components/country/CountryDetail';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, countryCollectionJsonLd } from '@/lib/seo/jsonld';
import type { Article, Country, ProductListResponse } from '@/lib/types';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const country = await api<Country>(`/countries/${params.slug}`, { auth: false });
    const title = `Coffee from ${country.name} | iCoffeeHub.com`;
    const description = country.summary || `Explore coffee origins, farms and roasters from ${country.name}.`;
    return {
      title,
      description,
      openGraph: { title, description, locale: 'en_US', alternateLocale: ['es_ES', 'pt_PT', 'fr_FR', 'el_GR', 'bg_BG', 'ar_AR'] },
    };
  } catch {
    return { title: 'Coffee Origin | iCoffeeHub.com' };
  }
}

export default async function CountryDetailPage({ params }: { params: { slug: string } }) {
  let country: Country;
  try {
    country = await api<Country>(`/countries/${params.slug}`, { auth: false });
  } catch {
    notFound();
  }

  const [products, articles] = await Promise.all([
    api<ProductListResponse>(`/products?originCountry=${encodeURIComponent(country!.name)}&limit=8`, { auth: false }).catch(
      () => ({ items: [], total: 0, page: 1, limit: 8, pages: 0 }) as ProductListResponse,
    ),
    api<Article[]>(`/articles/country/${country!.slug}`, { auth: false }).catch(() => [] as Article[]),
  ]);

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Marketplace', url: '/marketplace' },
    { name: country!.name, url: `/country/${country!.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[countryCollectionJsonLd(country!), breadcrumb]} />
      <CountryDetail country={country!} products={products} articles={articles} />
    </>
  );
}
