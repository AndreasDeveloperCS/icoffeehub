import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { ProductDetail } from '@/components/product/ProductDetail';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo/jsonld';
import type { Product, Review } from '@/lib/types';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const product = await api<Product>(`/products/${params.slug}`, { auth: false });
    const title = product.seoTitle || `${product.name} | iCoffeeHub.com`;
    const description =
      product.seoDescription ||
      product.description ||
      `${product.name}${product.originCountry ? ` from ${product.originCountry}` : ''} — shop on iCoffeeHub.com.`;
    return {
      title,
      description,
      openGraph: { title, description, locale: 'en_US', alternateLocale: ['es_ES', 'pt_PT', 'fr_FR', 'el_GR', 'bg_BG', 'ar_AR'] },
    };
  } catch {
    return { title: 'Product | iCoffeeHub.com' };
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product: Product;
  try {
    product = await api<Product>(`/products/${params.slug}`, { auth: false });
  } catch {
    notFound();
  }

  const reviews = await api<Review[]>(`/products/${product!._id}/reviews`, { auth: false }).catch(() => []);

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Marketplace', url: '/marketplace' },
    ...(product!.originCountry ? [{ name: product!.originCountry, url: `/marketplace?originCountry=${product!.originCountry}` }] : []),
    { name: product!.name, url: `/product/${product!.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[productJsonLd(product!, reviews), breadcrumb]} />
      <ProductDetail product={product!} reviews={reviews} />
    </>
  );
}
