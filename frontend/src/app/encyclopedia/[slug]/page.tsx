import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { formatLabel } from '@/lib/format';
import type { Article } from '@/lib/types';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await api<Article>(`/articles/${params.slug}`, { auth: false });
    const title = article.seoTitle || `${article.title} | iCoffeeHub.com`;
    const description = article.seoDescription || article.summary || 'Coffee encyclopedia article on iCoffeeHub.com.';
    return { title, description, openGraph: { title, description } };
  } catch {
    return { title: 'Article | iCoffeeHub.com' };
  }
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  let article: Article;
  try {
    article = await api<Article>(`/articles/${params.slug}`, { auth: false });
  } catch {
    notFound();
  }

  const paragraphs = (article!.body ?? '').split(/\n+/).filter(Boolean);

  return (
    <article className="container-page max-w-3xl py-10">
      <nav className="mb-6 text-xs text-espresso-400">
        <Link href="/encyclopedia" className="hover:text-espresso-700">Encyclopedia</Link> / {formatLabel(article!.type)}
      </nav>

      <span className="section-eyebrow">{formatLabel(article!.type)}</span>
      <h1 className="mt-1.5 font-heading text-3xl font-bold text-espresso-800 sm:text-4xl">{article!.title}</h1>
      {article!.summary && <p className="mt-4 text-lg leading-relaxed text-espresso-500">{article!.summary}</p>}

      <div className="mt-8 h-56 rounded-xl2 bg-gradient-to-br from-espresso-500 to-espresso-700 sm:h-72" />

      <div className="prose prose-espresso mt-8 space-y-4">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-espresso-700">{p}</p>
          ))
        ) : (
          <p className="text-base text-espresso-500">Full article content coming soon.</p>
        )}
      </div>

      {article!.countrySlug && (
        <Link href={`/country/${article!.countrySlug}`} className="btn-outline mt-10 inline-flex">
          Explore this origin &rarr;
        </Link>
      )}
    </article>
  );
}
