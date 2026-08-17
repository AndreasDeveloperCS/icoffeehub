'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { api, ApiError } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Country, Order } from '@/lib/types';

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const { cart, refreshCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  const [countries, setCountries] = useState<Country[]>([]);
  const [form, setForm] = useState({ fullName: '', line1: '', line2: '', city: '', country: '', postalCode: '', phone: '', couponCode: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [couponPreview, setCouponPreview] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  useEffect(() => {
    api<Country[]>('/countries', { auth: false }).then(setCountries).catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (user?.name && !form.fullName) setForm((f) => ({ ...f, fullName: user.name }));
  }, [user, form.fullName]);

  if (loading) return <div className="container-page py-16 text-center text-espresso-400">{t('common.loading')}</div>;
  if (!user) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-espresso-800">{t('checkout.signInTitle')}</h1>
        <Link href="/login" className="btn-primary">{t('common.signIn')}</Link>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <span className="badge bg-forest-50 text-forest-700">{t('checkout.orderConfirmed')}</span>
        <h1 className="font-heading text-3xl font-bold text-espresso-800">{t('checkout.thankYou', { name: user.name.split(' ')[0] })}</h1>
        <p className="text-sm text-espresso-500">
          {t('checkout.orderPlaced', {
            orderNumber: placedOrder._id.slice(-6).toUpperCase(),
            total: formatMoney(placedOrder.total, placedOrder.currency),
          })}
        </p>
        <div className="flex gap-3">
          <Link href="/account/orders" className="btn-primary">{t('checkout.viewOrders')}</Link>
          <Link href="/marketplace" className="btn-outline">{t('checkout.keepBrowsing')}</Link>
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-espresso-800">{t('cart.emptyTitle')}</h1>
        <Link href="/marketplace" className="btn-primary">{t('cart.browseMarketplace')}</Link>
      </div>
    );
  }

  async function applyCoupon() {
    if (!form.couponCode) return;
    setCouponError(null);
    setCheckingCoupon(true);
    try {
      const preview = await api<{ code: string; discount: number }>('/promotions/preview', {
        method: 'POST',
        body: { code: form.couponCode, subtotal },
        auth: false,
      });
      setCouponPreview(preview);
    } catch (err) {
      setCouponPreview(null);
      setCouponError(err instanceof ApiError ? err.message : t('checkout.couponError'));
    } finally {
      setCheckingCoupon(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const order = await api<Order>('/orders/checkout', { method: 'POST', body: form });
      await refreshCart();
      setPlacedOrder(order);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('checkout.checkoutFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-heading text-3xl font-bold text-espresso-800">{t('checkout.title')}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={onSubmit} className="card space-y-4 p-6">
          <h2 className="font-heading text-lg font-bold text-espresso-800">{t('checkout.shippingAddress')}</h2>

          <div>
            <label className="label">{t('checkout.fullName')}</label>
            <input required className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('checkout.addressLine1')}</label>
            <input required className="input" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('checkout.addressLine2')}</label>
            <input className="input" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('checkout.city')}</label>
              <input required className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="label">{t('checkout.postalCode')}</label>
              <input className="input" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">{t('checkout.country')}</label>
            <select required className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
              <option value="">{t('checkout.selectCountry')}</option>
              {countries.map((c) => (
                <option key={c._id} value={c.isoCode}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('checkout.phone')}</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div>
            <label className="label">{t('checkout.couponCode')}</label>
            <div className="flex gap-2">
              <input
                className="input"
                value={form.couponCode}
                onChange={(e) => {
                  setForm({ ...form, couponCode: e.target.value.toUpperCase() });
                  setCouponPreview(null);
                  setCouponError(null);
                }}
                placeholder={t('checkout.couponPlaceholder')}
              />
              <button type="button" onClick={applyCoupon} disabled={checkingCoupon || !form.couponCode} className="btn-outline shrink-0">
                {checkingCoupon ? t('checkout.checkingCoupon') : t('checkout.apply')}
              </button>
            </div>
            {couponError && <p className="mt-1 text-xs text-red-600">{couponError}</p>}
            {couponPreview && (
              <p className="mt-1 text-xs text-forest-700">
                {t('checkout.couponApplied', { code: couponPreview.code, discount: formatMoney(couponPreview.discount) })}
              </p>
            )}
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting
              ? t('checkout.placingOrder')
              : t('checkout.placeOrder', { total: formatMoney(Math.max(0, subtotal - (couponPreview?.discount ?? 0))) })}
          </button>
          <p className="text-center text-xs text-espresso-400">{t('checkout.paymentSimulated')}</p>
        </form>

        <div className="card h-fit p-6">
          <h2 className="font-heading text-lg font-bold text-espresso-800">{t('cart.orderSummary')}</h2>
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={`${item.productId}-${item.sku}`} className="flex justify-between text-sm text-espresso-600">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatMoney(item.price * item.quantity, item.currency)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 border-t border-espresso-100 pt-4 text-sm">
            <div className="flex justify-between text-espresso-600">
              <span>{t('cart.subtotal')}</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            {couponPreview && (
              <div className="flex justify-between text-forest-700">
                <span>{t('checkout.discount', { code: couponPreview.code })}</span>
                <span>-{formatMoney(couponPreview.discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1.5 font-semibold text-espresso-800">
              <span>{t('checkout.totalBeforeShipping')}</span>
              <span>{formatMoney(Math.max(0, subtotal - (couponPreview?.discount ?? 0)))}</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-espresso-400">{t('checkout.shippingPerSellerNote')}</p>
        </div>
      </div>
    </div>
  );
}
