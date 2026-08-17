'use client';

import Link from 'next/link';
import { LogoWordmark } from './Logo';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LOCALE_LABELS } from '@/lib/i18n/config';

const ORIGIN_COUNTRIES = [
  { key: 'ethiopia', slug: 'ethiopia' },
  { key: 'kenya', slug: 'kenya' },
  { key: 'colombia', slug: 'colombia' },
  { key: 'brazil', slug: 'brazil' },
  { key: 'guatemala', slug: 'guatemala' },
  { key: 'indonesia', slug: 'indonesia' },
];

export function Footer() {
  const { t, locale } = useLanguage();

  return (
    <footer className="mt-24 border-t border-espresso-100 bg-espresso-800 text-cream-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <LogoWordmark className="[&_span]:text-cream-50 [&_span_span]:text-gold-400" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-200/80">{t('footer.tagline')}</p>
        </div>

        <FooterColumn
          title={t('footer.originCountries')}
          links={ORIGIN_COUNTRIES.map((c) => ({ label: t(`common.countries.${c.key}`), href: `/country/${c.slug}` }))}
        />
        <FooterColumn
          title={t('footer.discover')}
          links={[
            { label: t('footer.discoverMarketplace'), href: '/marketplace' },
            { label: t('footer.discoverEncyclopedia'), href: '/encyclopedia' },
            { label: t('footer.discoverAiAssistant'), href: '/ai-assistant' },
            { label: t('footer.discoverBrewGuides'), href: '/encyclopedia?type=brew_guide' },
            { label: t('calculator.title'), href: '/calculator' },
          ]}
        />
        <FooterColumn
          title={t('footer.business')}
          links={[
            { label: t('footer.businessSell'), href: '/seller' },
            { label: t('footer.businessSupport'), href: '/' },
            { label: t('footer.businessTerms'), href: '/' },
            { label: t('footer.businessPrivacy'), href: '/' },
          ]}
        />
      </div>

      <div className="border-t border-espresso-700">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream-200/60 sm:flex-row">
          <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          <span>
            {LOCALE_LABELS[locale]} · {t('common.currencyLabel')}
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-cream-200/80 hover:text-cream-50">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
