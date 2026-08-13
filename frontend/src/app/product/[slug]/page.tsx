import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { formatLabel } from '@/lib/format';
import { ProductActions } from '@/components/ProductActions';
import { JournalNote } from '@/components/JournalNote';
import { CollectionPicker } from '@/components/CollectionPicker';
import { ReviewSection } from '@/components/ReviewSection';
import { StarRating } from '@/components/StarRating';
import { BeanIcon } from '@/components/ProductCard';
import type { Product, Review } from '@/lib/types';

const ROAST_GRADIENTS: Record<string, string> = {
  light: 'from-[#D9B48C] to-[#F5E3C6]',
  medium_light: 'from-[#C69C6D] to-[#EAD2A6]',
  medium: 'from-[#8F5C3E] to-[#C69C6D]',
  medium_dark: 'from-[#5D3A2E] to-[#8F5C3E]',
  dark: 'from-[#2A1712] to-[#5D3A2E]',
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const product = await api<Product>(`/products/${params.slug}`, { auth: false });
    const title = product.seoTitle || `${product.name} | iCoffeeHub.com`;
    const description =
      product.seoDescription ||
      product.description ||
      `${product.name}${product.originCountry ? ` from ${product.originCountry}` : ''} — shop on iCoffeeHub.com.`;
    return { title, description, openGraph: { title, description } };
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

  const gradient = ROAST_GRADIENTS[product!.roastLevel ?? 'medium'] ?? ROAST_GRADIENTS.medium;

  const specs = [
    { label: 'Origin', value: product!.originCountry },
    { label: 'Farm', value: product!.farmName },
    { label: 'Variety', value: product!.variety },
    { label: 'Altitude', value: product!.altitudeMeters ? `${product!.altitudeMeters}m` : undefined },
    { label: 'Process', value: formatLabel(product!.processingMethod) },
    { label: 'Roast', value: formatLabel(product!.roastLevel) },
  ].filter((s) => s.value);

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-xs text-espresso-400">
        <Link href="/marketplace" className="hover:text-espresso-700">Marketplace</Link> /{' '}
        {product!.originCountry && (
          <>
            <Link href={`/marketplace?originCountry=${product!.originCountry}`} className="hover:text-espresso-700">
              {product!.originCountry}
            </Link>{' '}
            /{' '}
          </>
        )}
        <span className="text-espresso-600">{product!.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className={`flex aspect-square items-center justify-center rounded-xl2 bg-gradient-to-br ${gradient} shadow-card`}>
          <BeanIcon className="h-24 w-24 text-white/90 drop-shadow-lg" />
        </div>

        <div>
          {product!.originCountry && <p className="section-eyebrow">{product!.originCountry}</p>}
          <h1 className="mt-1.5 font-heading text-3xl font-bold text-espresso-800">{product!.name}</h1>
          {product!.farmName && <p className="mt-1 text-sm text-espresso-500">{product!.farmName}</p>}

          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product!.ratingAverage} count={product!.ratingCount} size={16} />
            {product!.roastDate && (
              <span className="text-xs text-espresso-400">
                Roasted {new Date(product!.roastDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {product!.flavorNotes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product!.flavorNotes.map((f) => (
                <span key={f} className="badge bg-forest-50 text-forest-700">{formatLabel(f)}</span>
              ))}
            </div>
          )}

          {product!.description && <p className="mt-5 text-sm leading-relaxed text-espresso-600">{product!.description}</p>}

          <div className="my-6 h-px bg-espresso-100" />

          <ProductActions productId={product!._id} variants={product!.variants} />

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <JournalNote productId={product!._id} />
            <CollectionPicker productId={product!._id} />
          </div>

          {specs.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-espresso-100 pt-6">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-espresso-400">{s.label}</dt>
                  <dd className="text-sm font-medium text-espresso-700">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-heading text-xl font-bold text-espresso-800">Reviews</h2>
        <div className="mt-6">
          <ReviewSection productId={product!._id} initialReviews={reviews} />
        </div>
      </div>
    </div>
  );
}
