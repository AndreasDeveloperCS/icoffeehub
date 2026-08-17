'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export function StarRating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-1">
      <div className="flex" aria-label={t('reviews.ratingAriaLabel', { value: value.toFixed(1) })}>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" className="shrink-0">
            <defs>
              <linearGradient id={`star-${i}-${value}`}>
                <stop offset={`${Math.max(0, Math.min(1, value - (i - 1))) * 100}%`} stopColor="#C9A227" />
                <stop offset={`${Math.max(0, Math.min(1, value - (i - 1))) * 100}%`} stopColor="#E0DACF" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#star-${i}-${value})`}
              d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.7l-5.2 2.8 1-5.8-4.2-4.1 5.8-.8L10 1.5z"
            />
          </svg>
        ))}
      </div>
      {typeof count === 'number' && <span className="text-xs text-espresso-400">({count})</span>}
    </div>
  );
}
