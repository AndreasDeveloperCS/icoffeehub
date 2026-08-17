'use client';

import Link from 'next/link';
import { StarRating } from './StarRating';
import { formatMoney, lowestPrice } from '@/lib/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Product } from '@/lib/types';

const ROAST_GRADIENTS: Record<string, string> = {
  light: 'from-[#D9B48C] to-[#F5E3C6]',
  medium_light: 'from-[#C69C6D] to-[#EAD2A6]',
  medium: 'from-[#8F5C3E] to-[#C69C6D]',
  medium_dark: 'from-[#5D3A2E] to-[#8F5C3E]',
  dark: 'from-[#2A1712] to-[#5D3A2E]',
};

export function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  const gradient = ROAST_GRADIENTS[product.roastLevel ?? 'medium'] ?? ROAST_GRADIENTS.medium;
  const price = lowestPrice(product.variants);

  return (
    <Link href={`/product/${product.slug}`} className="card group flex flex-col overflow-hidden hover:shadow-card-hover">
      <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <BeanIcon className="h-14 w-14 text-white/90 drop-shadow" />
        {product.featured && (
          <span className="badge absolute left-3 top-3 bg-gold-500 text-espresso-900">{t('product.featuredBadge')}</span>
        )}
        {product.originCountry && (
          <span className="badge absolute right-3 top-3 bg-white/90 text-espresso-700 backdrop-blur">
            {product.originCountry}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div>
          <h3 className="line-clamp-1 font-heading text-sm font-semibold text-espresso-800">{product.name}</h3>
          {product.farmName && <p className="mt-0.5 text-xs text-espresso-400">{product.farmName}</p>}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.roastLevel && (
            <span className="badge bg-espresso-50 text-espresso-600">
              {t('product.roastBadge', { roast: t(`coffeeOptions.roastLevels.${product.roastLevel}`) })}
            </span>
          )}
          {product.flavorNotes.slice(0, 2).map((f) => (
            <span key={f} className="badge bg-forest-50 text-forest-700">
              {t(`coffeeOptions.flavorNotes.${f}`)}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <StarRating value={product.ratingAverage} count={product.ratingCount} />
          <span className="font-heading text-sm font-bold text-espresso-800">{formatMoney(price)}</span>
        </div>
      </div>
    </Link>
  );
}

export function BeanIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 2.2c1.9 0 3.63.68 4.98 1.8-2.4.55-4.98 3.2-4.98 6 0 2.8 2.58 5.45 4.98 6A7.78 7.78 0 0 1 12 19.8 7.8 7.8 0 0 1 4.2 12 7.8 7.8 0 0 1 12 4.2Z" />
    </svg>
  );
}
