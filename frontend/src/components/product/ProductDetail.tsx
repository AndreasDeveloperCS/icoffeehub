'use client';

import Link from 'next/link';
import { ProductActions } from '@/components/ProductActions';
import { JournalNote } from '@/components/JournalNote';
import { CollectionPicker } from '@/components/CollectionPicker';
import { ReviewSection } from '@/components/ReviewSection';
import { StarRating } from '@/components/StarRating';
import { BeanIcon } from '@/components/ProductCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Product, Review } from '@/lib/types';

const ROAST_GRADIENTS: Record<string, string> = {
  light: 'from-[#D9B48C] to-[#F5E3C6]',
  medium_light: 'from-[#C69C6D] to-[#EAD2A6]',
  medium: 'from-[#8F5C3E] to-[#C69C6D]',
  medium_dark: 'from-[#5D3A2E] to-[#8F5C3E]',
  dark: 'from-[#2A1712] to-[#5D3A2E]',
};

export function ProductDetail({ product, reviews }: { product: Product; reviews: Review[] }) {
  const { t } = useLanguage();
  const gradient = ROAST_GRADIENTS[product.roastLevel ?? 'medium'] ?? ROAST_GRADIENTS.medium;

  const specs = [
    { label: t('product.specs.origin'), value: product.originCountry },
    { label: t('product.specs.farm'), value: product.farmName },
    { label: t('product.specs.variety'), value: product.variety },
    { label: t('product.specs.altitude'), value: product.altitudeMeters ? `${product.altitudeMeters}m` : undefined },
    { label: t('product.specs.process'), value: product.processingMethod ? t(`coffeeOptions.processingMethods.${product.processingMethod}`) : undefined },
    { label: t('product.specs.roast'), value: product.roastLevel ? t(`coffeeOptions.roastLevels.${product.roastLevel}`) : undefined },
  ].filter((s) => s.value);

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-xs text-espresso-400">
        <Link href="/marketplace" className="hover:text-espresso-700">{t('header.navMarketplace')}</Link> /{' '}
        {product.originCountry && (
          <>
            <Link href={`/marketplace?originCountry=${product.originCountry}`} className="hover:text-espresso-700">
              {product.originCountry}
            </Link>{' '}
            /{' '}
          </>
        )}
        <span className="text-espresso-600">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className={`flex aspect-square items-center justify-center rounded-xl2 bg-gradient-to-br ${gradient} shadow-card`}>
          <BeanIcon className="h-24 w-24 text-white/90 drop-shadow-lg" />
        </div>

        <div>
          {product.originCountry && <p className="section-eyebrow">{product.originCountry}</p>}
          <h1 className="mt-1.5 font-heading text-3xl font-bold text-espresso-800">{product.name}</h1>
          {(product.farmName || product.sellerName) && (
            <div className="mt-1 flex items-center gap-1.5">
              <p className="text-sm text-espresso-500">{product.farmName ?? product.sellerName}</p>
              {product.sellerVerified && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2 py-0.5 text-[11px] font-semibold text-forest-700"
                  title={t('product.verifiedSeller')}
                >
                  <VerifiedIcon className="h-3 w-3" />
                  {t('product.verifiedSeller')}
                </span>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.ratingAverage} count={product.ratingCount} size={16} />
            {product.roastDate && (
              <span className="text-xs text-espresso-400">
                {t('product.roastedOn', { date: new Date(product.roastDate).toLocaleDateString() })}
              </span>
            )}
          </div>

          {product.flavorNotes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.flavorNotes.map((f) => (
                <span key={f} className="badge bg-forest-50 text-forest-700">{t(`coffeeOptions.flavorNotes.${f}`)}</span>
              ))}
            </div>
          )}

          {product.description && <p className="mt-5 text-sm leading-relaxed text-espresso-600">{product.description}</p>}

          <div className="my-6 h-px bg-espresso-100" />

          <ProductActions productId={product._id} variants={product.variants} />

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <JournalNote productId={product._id} />
            <CollectionPicker productId={product._id} />
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
        <h2 className="font-heading text-xl font-bold text-espresso-800">{t('product.reviewsHeading')}</h2>
        <div className="mt-6">
          <ReviewSection productId={product._id} initialReviews={reviews} />
        </div>
      </div>
    </div>
  );
}

function VerifiedIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2 9.5 4.5H6.5v3L4 10l2.5 2.5v3h3L12 18l2.5-2.5h3v-3L20 10l-2.5-2.5v-3h-3L12 2Zm-1.2 11.4-2.7-2.7 1.1-1.1 1.6 1.6 3.9-3.9 1.1 1.1-5 5Z" />
    </svg>
  );
}
