'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { formatLabel } from '@/lib/format';
import type { Country, ProductListResponse } from '@/lib/types';

const ROAST_LEVELS = ['light', 'medium_light', 'medium', 'medium_dark', 'dark'];
const PROCESSES = ['washed', 'natural', 'honey', 'anaerobic', 'wet_hulled', 'decaf'];
const SORTS = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-espresso-400">Loading…</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<ProductListResponse | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q') ?? '';
  const originCountry = searchParams.get('originCountry') ?? '';
  const roastLevel = searchParams.get('roastLevel') ?? '';
  const processingMethod = searchParams.get('processingMethod') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      if (key !== 'page') params.delete('page');
      router.push(`/marketplace?${params.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    api<Country[]>('/countries?originOnly=true', { auth: false }).then(setCountries).catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (originCountry) params.set('originCountry', originCountry);
    if (roastLevel) params.set('roastLevel', roastLevel);
    if (processingMethod) params.set('processingMethod', processingMethod);
    if (sort) params.set('sort', sort);
    params.set('page', String(page));

    api<ProductListResponse>(`/products?${params.toString()}`, { auth: false })
      .then(setData)
      .catch(() => setData({ items: [], total: 0, page: 1, limit: 12, pages: 0 }))
      .finally(() => setLoading(false));
  }, [q, originCountry, roastLevel, processingMethod, sort, page]);

  const activeFilterCount = [originCountry, roastLevel, processingMethod].filter(Boolean).length;

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <p className="section-eyebrow">Marketplace</p>
        <h1 className="mt-1.5 font-heading text-3xl font-bold text-espresso-800">
          {q ? `Results for "${q}"` : 'Browse coffee from verified sellers'}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-7">
          <FilterGroup label="Origin Country">
            <select className="input" value={originCountry} onChange={(e) => setParam('originCountry', e.target.value)}>
              <option value="">All origins</option>
              {countries.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup label="Roast Level">
            <div className="flex flex-wrap gap-2">
              {ROAST_LEVELS.map((r) => (
                <FilterChip key={r} active={roastLevel === r} onClick={() => setParam('roastLevel', roastLevel === r ? '' : r)}>
                  {formatLabel(r)}
                </FilterChip>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Process">
            <div className="flex flex-wrap gap-2">
              {PROCESSES.map((p) => (
                <FilterChip key={p} active={processingMethod === p} onClick={() => setParam('processingMethod', processingMethod === p ? '' : p)}>
                  {formatLabel(p)}
                </FilterChip>
              ))}
            </div>
          </FilterGroup>

          {activeFilterCount > 0 && (
            <button onClick={() => router.push('/marketplace')} className="text-sm font-semibold text-espresso-600 underline">
              Clear all filters
            </button>
          )}
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-espresso-500">{loading ? 'Loading…' : `${data?.total ?? 0} coffees found`}</p>
            <select className="input w-auto" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-72 animate-pulse bg-espresso-50" />
              ))}
            </div>
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.items.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {data.pages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: data.pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setParam('page', String(i + 1))}
                      className={`h-9 w-9 rounded-full text-sm font-semibold ${page === i + 1 ? 'bg-espresso-700 text-cream-50' : 'bg-cream-100 text-espresso-600 hover:bg-cream-200'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="card flex flex-col items-center gap-2 p-14 text-center">
              <p className="font-heading text-lg font-semibold text-espresso-800">No coffees match those filters</p>
              <p className="text-sm text-espresso-500">Try clearing a filter or searching a different origin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="label">{label}</h3>
      {children}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`badge border transition-colors ${active ? 'border-espresso-700 bg-espresso-700 text-cream-50' : 'border-espresso-200 bg-white text-espresso-600 hover:bg-espresso-50'}`}
    >
      {children}
    </button>
  );
}
