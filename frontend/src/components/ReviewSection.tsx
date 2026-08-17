'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { StarRating } from './StarRating';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Review } from '@/lib/types';

export function ReviewSection({ productId, initialReviews }: { productId: string; initialReviews: Review[] }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const alreadyReviewed = user ? reviews.some((r) => r.userId === user._id) : false;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const review = await api<Review>(`/products/${productId}/reviews`, {
        method: 'POST',
        body: { rating, body },
      });
      setReviews((r) => [review, ...r]);
      setBody('');
      setRating(5);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('reviews.submitError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-sm text-espresso-500">{t('reviews.empty')}</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b border-espresso-100 pb-6 last:border-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-espresso-800">{r.userName}</p>
                <span className="text-xs text-espresso-400">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-1">
                <StarRating value={r.rating} />
              </div>
              {r.body && <p className="mt-2 text-sm leading-relaxed text-espresso-600">{r.body}</p>}
            </div>
          ))
        )}
      </div>

      <div className="card h-fit p-5">
        <h3 className="font-heading text-sm font-bold text-espresso-800">{t('reviews.writeReview')}</h3>
        {!user ? (
          <p className="mt-3 text-sm text-espresso-500">{t('reviews.signInPrompt')}</p>
        ) : alreadyReviewed ? (
          <p className="mt-3 text-sm text-espresso-500">{t('reviews.alreadyReviewed')}</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-3 space-y-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={t('reviews.starsAriaLabel', { count: n })}>
                  <StarRating value={n <= rating ? 5 : 0} size={20} />
                </button>
              ))}
            </div>
            <textarea
              className="input min-h-[90px]"
              placeholder={t('reviews.placeholder')}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? t('reviews.submitting') : t('reviews.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
