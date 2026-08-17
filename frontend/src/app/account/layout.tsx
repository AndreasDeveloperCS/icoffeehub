'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const NAV = [
    { href: '/account', label: t('account.nav.overview') },
    { href: '/account/orders', label: t('account.nav.orders') },
    { href: '/account/wishlist', label: t('account.nav.wishlist') },
    { href: '/account/collections', label: t('account.nav.collections') },
    { href: '/account/journal', label: t('account.nav.journal') },
    { href: '/account/support', label: t('account.nav.support') },
  ];

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="container-page py-16 text-center text-espresso-400">{t('common.loading')}</div>;
  }

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-1">
        <div className="mb-4">
          <p className="font-heading text-lg font-bold text-espresso-800">{t('account.greeting', { name: user.name.split(' ')[0] })}</p>
          <p className="text-xs text-espresso-400">{user.email}</p>
        </div>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${
              pathname === n.href ? 'bg-espresso-700 text-cream-50' : 'text-espresso-600 hover:bg-cream-100'
            }`}
          >
            {n.label}
          </Link>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  );
}
