import type { Article, Country, Product, Review } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

type JsonLdObject = Record<string, unknown>;

export function breadcrumbJsonLd(items: { name: string; url: string }[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function productJsonLd(product: Product, reviews: Review[]): JsonLdObject {
  const prices = product.variants.map((v) => v.price);
  const currency = product.variants[0]?.currency ?? 'USD';

  const offer =
    product.variants.length > 1
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: currency,
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: product.variants.length,
          availability: product.variants.some((v) => v.stock > 0)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        }
      : {
          '@type': 'Offer',
          priceCurrency: currency,
          price: prices[0] ?? 0,
          availability:
            (product.variants[0]?.stock ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: `${SITE_URL}/product/${product.slug}`,
        };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.seoDescription,
    image: product.photos,
    sku: product.variants[0]?.sku,
    brand: product.sellerName ? { '@type': 'Brand', name: product.sellerName } : undefined,
    offers: offer,
    ...(product.ratingCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ratingAverage,
            reviewCount: product.ratingCount,
          },
        }
      : {}),
    ...(reviews.length > 0
      ? {
          review: reviews.slice(0, 10).map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.userName },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.body,
            datePublished: r.createdAt,
          })),
        }
      : {}),
  };
}

export function articleJsonLd(article: Article): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary || article.seoDescription,
    image: article.heroImageUrl ? [article.heroImageUrl] : undefined,
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: 'iCoffeeHub.com' },
    publisher: { '@type': 'Organization', name: 'iCoffeeHub.com' },
    mainEntityOfPage: `${SITE_URL}/encyclopedia/${article.slug}`,
  };
}

export function countryCollectionJsonLd(country: Country): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Coffee from ${country.name}`,
    description: country.summary,
    url: `${SITE_URL}/country/${country.slug}`,
  };
}
