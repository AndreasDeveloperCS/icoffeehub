'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatLabel } from '@/lib/format';
import { ProductCard } from '@/components/ProductCard';
import { AiChat } from '@/components/AiChat';
import type { Product } from '@/lib/types';
import { FLAVOR_NOTES, ROAST_LEVELS } from '@/lib/coffee-options';

export default function AiAssistantPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<'quiz' | 'chat'>('quiz');
  const [roasts, setRoasts] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [avoid, setAvoid] = useState<string[]>([]);
  const [acidity, setAcidity] = useState(3);
  const [body, setBody] = useState(3);
  const [recommendations, setRecommendations] = useState<Product[] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    api('/ai/taste-quiz')
      .then((profile: any) => {
        if (!profile) return;
        setRoasts(profile.preferredRoastLevels ?? []);
        setFlavors(profile.preferredFlavorNotes ?? []);
        setAvoid(profile.avoidFlavorNotes ?? []);
        setAcidity(profile.acidityPreference ?? 3);
        setBody(profile.bodyPreference ?? 3);
      })
      .catch(() => {});
  }, [user]);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api('/ai/taste-quiz', {
        method: 'POST',
        body: {
          preferredRoastLevels: roasts,
          preferredFlavorNotes: flavors,
          avoidFlavorNotes: avoid,
          acidityPreference: acidity,
          bodyPreference: body,
        },
      });
      const recs = await api<Product[]>('/ai/recommendations');
      setRecommendations(recs);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="container-page py-16 text-center text-espresso-400">Loading…</div>;

  if (!user) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <span className="section-eyebrow">AI Coffee Assistant</span>
        <h1 className="font-heading text-3xl font-bold text-espresso-800">Sign in to get personalized picks</h1>
        <p className="max-w-md text-sm text-espresso-500">
          Take a short taste quiz and we&apos;ll recommend coffees from across the marketplace that match your palate.
        </p>
        <Link href="/login" className="btn-primary">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-eyebrow">AI Coffee Assistant</span>
        <h1 className="mt-1.5 font-heading text-3xl font-bold text-espresso-800">Find your next favorite cup</h1>
        <p className="mt-2 text-sm text-espresso-500">
          These are AI-generated suggestions based on your answers below, not verified facts — always check each
          product&apos;s listing for exact origin and roast details.
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-2xl gap-2 rounded-full bg-cream-100 p-1">
        <button
          type="button"
          onClick={() => setTab('quiz')}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${tab === 'quiz' ? 'bg-espresso-700 text-cream-50' : 'text-espresso-600'}`}
        >
          Taste Quiz
        </button>
        <button
          type="button"
          onClick={() => setTab('chat')}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${tab === 'chat' ? 'bg-espresso-700 text-cream-50' : 'text-espresso-600'}`}
        >
          Ask a Question
        </button>
      </div>

      {tab === 'chat' ? (
        <div className="mt-8">
          <AiChat />
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="card mx-auto mt-8 max-w-2xl space-y-6 p-6 sm:p-8">
            <div>
              <label className="label">Preferred roast levels</label>
              <div className="flex flex-wrap gap-2">
                {ROAST_LEVELS.map((r) => (
                  <Chip key={r} active={roasts.includes(r)} onClick={() => toggle(roasts, setRoasts, r)}>
                    {formatLabel(r)}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Flavors you love</label>
              <div className="flex flex-wrap gap-2">
                {FLAVOR_NOTES.map((f) => (
                  <Chip key={f} active={flavors.includes(f)} onClick={() => toggle(flavors, setFlavors, f)}>
                    {formatLabel(f)}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Flavors you&apos;d rather avoid</label>
              <div className="flex flex-wrap gap-2">
                {FLAVOR_NOTES.map((f) => (
                  <Chip key={f} active={avoid.includes(f)} tone="avoid" onClick={() => toggle(avoid, setAvoid, f)}>
                    {formatLabel(f)}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <SliderField label="Acidity" value={acidity} onChange={setAcidity} lowLabel="Smooth" highLabel="Bright" />
              <SliderField label="Body" value={body} onChange={setBody} lowLabel="Light" highLabel="Full" />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full text-base">
              {submitting ? 'Matching you with coffees…' : 'Get my recommendations'}
            </button>
          </form>

          {recommendations && (
            <div className="mt-14">
              <h2 className="text-center font-heading text-2xl font-bold text-espresso-800">Recommended for you</h2>
              {recommendations.length === 0 ? (
                <p className="mt-4 text-center text-sm text-espresso-500">No matches yet — try adjusting your answers.</p>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {recommendations.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  tone = 'default',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: 'default' | 'avoid';
}) {
  const activeClass = tone === 'avoid' ? 'border-red-400 bg-red-50 text-red-700' : 'border-espresso-700 bg-espresso-700 text-cream-50';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`badge border transition-colors ${active ? activeClass : 'border-espresso-200 bg-white text-espresso-600 hover:bg-espresso-50'}`}
    >
      {children}
    </button>
  );
}

function SliderField({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold-500"
      />
      <div className="flex justify-between text-xs text-espresso-400">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
