import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { ArticleDetail } from '@/components/encyclopedia/ArticleDetail';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import type { Article } from '@/lib/types';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await api<Article>(`/articles/${params.slug}`, { auth: false });
    const title = article.seoTitle || `${article.title} | iCoffeeHub.com`;
    const description = article.seoDescription || article.summary || 'Coffee encyclopedia article on iCoffeeHub.com.';
    return {
      title,
      description,
      openGraph: { title, description, locale: 'en_US', alternateLocale: ['es_ES', 'pt_PT', 'fr_FR', 'el_GR', 'bg_BG', 'ar_AR'] },
    };
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

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Encyclopedia', url: '/encyclopedia' },
    { name: article!.title, url: `/encyclopedia/${article!.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[articleJsonLd(article!), breadcrumb]} />
      <ArticleDetail article={article!} />
    </>
  );
}
