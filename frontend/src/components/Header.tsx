'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogoWordmark } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: '/marketplace', label: t('header.navMarketplace') },
    { href: '/encyclopedia', label: t('header.navEncyclopedia') },
    { href: '/ai-assistant', label: t('header.navAiAssistant') },
  ];

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/marketplace?q=${encodeURIComponent(query.trim())}` : '/marketplace');
  }

  const accountHref = user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/account';

  return (
    <header className="sticky top-0 z-40 border-b border-espresso-100 bg-cream-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="shrink-0">
          <LogoWordmark />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-espresso-600 transition-colors hover:text-espresso-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden flex-1 max-w-sm items-center sm:flex">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('header.searchPlaceholder')}
            className="input h-10 py-0"
          />
        </form>

        <div className="ml-auto flex items-center gap-3 sm:ml-0">
          <LanguageSwitcher />
          <Link href="/cart" className="relative rounded-full p-2 text-espresso-700 hover:bg-espresso-50" aria-label={t('common.cart')}>
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-espresso-900">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-espresso-200 py-1.5 pl-3 pr-2 text-sm font-medium text-espresso-700 hover:bg-espresso-50"
              >
                {user.name.split(' ')[0]}
                <ChevronIcon />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-espresso-100 bg-white shadow-card-hover"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link href={accountHref} className="block px-4 py-2.5 text-sm text-espresso-700 hover:bg-cream-100" onClick={() => setMenuOpen(false)}>
                    {user.role === 'admin' ? t('header.adminDashboard') : user.role === 'seller' ? t('header.sellerPortal') : t('header.myAccount')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      router.push('/');
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-espresso-700 hover:bg-cream-100"
                  >
                    {t('common.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-outline hidden sm:inline-flex">
                {t('common.signIn')}
              </Link>
              <Link href="/register" className="btn-primary">
                {t('common.join')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
