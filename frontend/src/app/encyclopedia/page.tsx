import { api } from '@/lib/api';
import { EncyclopediaList } from '@/components/encyclopedia/EncyclopediaList';
import type { Article } from '@/lib/types';

export default async function EncyclopediaPage({ searchParams }: { searchParams: { type?: string } }) {
  const type = searchParams.type ?? '';
  const articles = await api<Article[]>(`/articles${type ? `?type=${type}` : ''}`, { auth: false }).catch(
    () => [] as Article[],
  );

  return <EncyclopediaList type={type} articles={articles} />;
}
