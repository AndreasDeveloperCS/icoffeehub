'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Order } from '@/lib/types';

export default function OrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    api<Order[]>('/orders').then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">{t('account.nav.orders')}</h1>

      {!orders ? (
        <p className="mt-4 text-sm text-espresso-400">{t('common.loading')}</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">
          {t('account.noOrdersYet')} <Link href="/marketplace" className="font-semibold underline">{t('account.startShopping')}</Link>
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-espresso-800">{t('account.orderNumber', { number: o._id.slice(-6).toUpperCase() })}</p>
                  <p className="text-xs text-espresso-400">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <span className="badge bg-forest-50 text-forest-700 capitalize">{o.status}</span>
              </div>
              <div className="mt-3 space-y-1.5 border-t border-espresso-100 pt-3">
                {o.items.map((item) => (
                  <div key={`${item.productId}-${item.sku}`} className="flex justify-between text-sm text-espresso-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatMoney(item.price * item.quantity, item.currency)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-espresso-100 pt-3 text-sm font-semibold text-espresso-800">
                <span>{t('account.totalInclShipping')}</span>
                <span>{formatMoney(o.total, o.currency)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-espresso-400">
                  {t('account.shippingTo', { city: o.shippingAddress.city, country: o.shippingAddress.country })}
                </p>
                <Link href={`/account/orders/${o._id}`} className="text-xs font-semibold text-espresso-600 hover:underline">
                  {t('account.trackManage')} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
