import Link from 'next/link';
import { api } from '@/lib/api';
import type { Article } from '@/lib/types';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'encyclopedia', label: 'Encyclopedia' },
  { value: 'country', label: 'Origins' },
  { value: 'brew_guide', label: 'Brew Guides' },
  { value: 'recipe', label: 'Recipes' },
  { value: 'course', label: 'Courses' },
  { value: 'news', label: 'News' },
];

export default async function EncyclopediaPage({ searchParams }: { searchParams: { type?: string } }) {
  const type = searchParams.type ?? '';
  const articles = await api<Article[]>(`/articles${type ? `?type=${type}` : ''}`, { auth: false }).catch(
    () => [] as Article[],
  );

  return (
    <div className="container-page py-10">
      <p className="section-eyebrow">Learn</p>
      <h1 className="mt-1.5 font-heading text-3xl font-bold text-espresso-800">The Coffee Encyclopedia</h1>
      <p className="mt-2 max-w-xl text-sm text-espresso-500">
        Origins, brewing science and the culture behind every cup — written to help you taste with more intention.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <Link
            key={t.value}
            href={t.value ? `/encyclopedia?type=${t.value}` : '/encyclopedia'}
            className={`badge border ${type === t.value ? 'border-espresso-700 bg-espresso-700 text-cream-50' : 'border-espresso-200 bg-white text-espresso-600 hover:bg-espresso-50'}`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <p className="mt-10 text-sm text-espresso-500">No articles published in this category yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link key={a._id} href={`/encyclopedia/${a.slug}`} className="card flex flex-col p-5 hover:shadow-card-hover">
              <span className="section-eyebrow">{a.type.replace('_', ' ')}</span>
              <h2 className="mt-2 line-clamp-2 font-heading text-lg font-semibold text-espresso-800">{a.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-espresso-500">{a.summary}</p>
              <span className="mt-4 text-sm font-semibold text-espresso-700">Read more &rarr;</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
