'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { formatLabel } from '@/lib/format';
import type { Article } from '@/lib/types';

const TYPES = ['encyclopedia', 'country', 'farm', 'roaster', 'coffee_shop', 'brew_guide', 'recipe', 'news', 'course'];

const EMPTY_FORM = {
  title: '',
  type: 'encyclopedia',
  summary: '',
  body: '',
  countrySlug: '',
  status: 'draft' as 'draft' | 'published',
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    api<Article[]>('/articles/admin/all').then(setArticles).catch(() => setArticles([]));
  }

  useEffect(load, []);

  function editArticle(a: Article) {
    setEditingId(a._id);
    setForm({
      title: a.title,
      type: a.type,
      summary: a.summary ?? '',
      body: a.body ?? '',
      countrySlug: a.countrySlug ?? '',
      status: a.status as 'draft' | 'published',
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editingId) {
        await api(`/articles/${editingId}`, { method: 'PATCH', body: form });
      } else {
        await api('/articles', { method: 'POST', body: form });
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save article.');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(a: Article) {
    await api(`/articles/${a._id}`, { method: 'PATCH', body: { status: a.status === 'published' ? 'draft' : 'published' } });
    load();
  }

  async function remove(a: Article) {
    await api(`/articles/${a._id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Articles (CMS)</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-espresso-800">{a.title}</p>
                <p className="text-xs text-espresso-400">{formatLabel(a.type)} · {a.status}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editArticle(a)} className="text-sm font-semibold text-espresso-600 hover:underline">Edit</button>
                <button onClick={() => togglePublish(a)} className="btn-outline">
                  {a.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => remove(a)} className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {articles.length === 0 && <p className="text-sm text-espresso-500">No articles yet.</p>}
        </div>

        <form onSubmit={onSubmit} className="card h-fit space-y-3 p-5">
          <h2 className="font-heading text-sm font-bold text-espresso-800">{editingId ? 'Edit article' : 'New article'}</h2>
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{formatLabel(t)}</option>
              ))}
            </select>
          </div>
          {form.type === 'country' && (
            <div>
              <label className="label">Country slug</label>
              <input className="input" value={form.countrySlug} onChange={(e) => setForm({ ...form, countrySlug: e.target.value })} placeholder="e.g. ethiopia" />
            </div>
          )}
          <div>
            <label className="label">Summary</label>
            <textarea className="input min-h-[60px]" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>
          <div>
            <label className="label">Body</label>
            <textarea className="input min-h-[140px]" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create article'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
