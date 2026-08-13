'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { StarRating } from '@/components/StarRating';
import type { Review } from '@/lib/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  function load() {
    api<Review[]>('/admin/reviews').then(setReviews).catch(() => setReviews([]));
  }

  useEffect(load, []);

  async function setStatus(id: string, status: 'visible' | 'hidden') {
    await api(`/admin/reviews/${id}/status`, { method: 'PATCH', body: { status } });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Review Moderation</h1>

      {!reviews ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">No reviews yet.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="max-w-lg">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-espresso-800">{r.userName}</p>
                  <StarRating value={r.rating} />
                  <span className={`badge ${r.status === 'visible' ? 'bg-forest-50 text-forest-700' : 'bg-red-50 text-red-700'}`}>
                    {r.status}
                  </span>
                </div>
                {r.body && <p className="mt-1 text-sm text-espresso-500">{r.body}</p>}
              </div>
              <button
                onClick={() => setStatus(r._id, r.status === 'visible' ? 'hidden' : 'visible')}
                className="btn-outline"
              >
                {r.status === 'visible' ? 'Hide' : 'Unhide'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
