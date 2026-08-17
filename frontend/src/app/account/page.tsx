'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Order } from '@/lib/types';

export default function AccountOverviewPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api<Order[]>('/orders').then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-espresso-800">{t('account.overviewTitle')}</h1>
        <p className="mt-1 text-sm text-espresso-500">{t('account.overviewSubtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t('account.ordersPlaced')} value={orders.length} />
        <StatCard
          label={t('account.totalSpent')}
          value={formatMoney(orders.reduce((sum, o) => sum + o.total, 0))}
        />
        <Link href="/ai-assistant" className="card flex flex-col justify-center p-5 hover:shadow-card-hover">
          <p className="font-heading text-sm font-bold text-espresso-800">{t('account.retakeQuiz')}</p>
          <p className="mt-1 text-xs text-espresso-500">{t('account.retakeQuizBody')} &rarr;</p>
        </Link>
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold text-espresso-800">{t('account.recentOrders')}</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-espresso-500">
            {t('account.noOrdersYet')} <Link href="/marketplace" className="font-semibold text-espresso-800 underline">{t('account.startShopping')}</Link>
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o._id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-espresso-800">#{o._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-espresso-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="badge bg-forest-50 text-forest-700 capitalize">{o.status}</span>
                <p className="font-semibold text-espresso-800">{formatMoney(o.total, o.currency)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-espresso-400">{label}</p>
      <p className="mt-1.5 font-heading text-2xl font-bold text-espresso-800">{value}</p>
    </div>
  );
}
