'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { ProductVariant } from '@/lib/types';

export function ProductActions({ productId, variants }: { productId: string; variants: ProductVariant[] }) {
  const { user, refresh } = useAuth();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [sku, setSku] = useState(variants[0]?.sku);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [wishBusy, setWishBusy] = useState(false);
  const wished = !!user?.wishlist.includes(productId);

  async function onToggleWishlist() {
    if (!user) {
      router.push('/login');
      return;
    }
    setWishBusy(true);
    try {
      await api(`/users/me/wishlist/${productId}`, { method: 'POST' });
      await refresh();
    } finally {
      setWishBusy(false);
    }
  }

  const selected = variants.find((v) => v.sku === sku) ?? variants[0];

  async function onAdd() {
    if (!user) {
      router.push('/login');
      return;
    }
    setStatus('loading');
    try {
      await addItem(productId, sku, quantity);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setStatus('idle');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="label">{t('productActions.bagSize')}</label>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.sku}
              onClick={() => setSku(v.sku)}
              className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${
                sku === v.sku ? 'border-espresso-700 bg-espresso-700 text-cream-50' : 'border-espresso-200 text-espresso-700 hover:bg-espresso-50'
              }`}
            >
              {v.weightGrams >= 1000 ? `${v.weightGrams / 1000}kg` : `${v.weightGrams}g`}
              <span className="ml-1.5 font-normal opacity-80">{formatMoney(v.price, v.currency)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-espresso-200">
          <button
            className="px-3.5 py-2 text-lg text-espresso-600"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label={t('productActions.decreaseQuantity')}
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            className="px-3.5 py-2 text-lg text-espresso-600"
            onClick={() => setQuantity((q) => Math.min(selected?.stock ?? 99, q + 1))}
            aria-label={t('productActions.increaseQuantity')}
          >
            +
          </button>
        </div>
        <span className="text-xs text-espresso-400">
          {selected && selected.stock > 0 ? t('productActions.inStock', { count: selected.stock }) : t('productActions.outOfStock')}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAdd}
          disabled={status === 'loading' || !selected || selected.stock === 0}
          className="btn-primary flex-1 text-base"
        >
          {status === 'done'
            ? t('productActions.added')
            : status === 'loading'
              ? t('productActions.adding')
              : t('productActions.addToCart', { price: selected ? formatMoney(selected.price * quantity, selected.currency) : '' })}
        </button>
        <button
          onClick={onToggleWishlist}
          disabled={wishBusy}
          aria-label={wished ? t('productActions.removeFromWishlist') : t('productActions.saveToWishlist')}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
            wished ? 'border-gold-500 bg-gold-50 text-gold-600' : 'border-espresso-200 text-espresso-500 hover:bg-espresso-50'
          }`}
        >
          <HeartIcon filled={wished} />
        </button>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20.5S3 14.9 3 8.9C3 5.9 5.4 3.5 8.4 3.5c1.7 0 3.3.8 4.3 2.1a5.3 5.3 0 0 1 8.7 4.1c0 6-9.4 10.8-9.4 10.8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
