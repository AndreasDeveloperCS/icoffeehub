'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-espresso-800">
      <div className="absolute inset-0 bg-grain-fade" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-forest-500/10 blur-3xl" />

      <div className="container-page relative flex flex-col items-start gap-6 py-20 sm:py-28">
        <span className="section-eyebrow text-gold-400">{t('home.hero.eyebrow')}</span>
        <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight text-cream-50 sm:text-5xl">
          {t('home.hero.titleLine1')}
          <br /> {t('home.hero.titleLine2')}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-cream-200/80 sm:text-lg">{t('home.hero.subtitle')}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/marketplace" className="btn-gold">
            {t('home.hero.ctaMarketplace')}
          </Link>
          <Link href="/ai-assistant" className="btn bg-cream-50/10 text-cream-50 hover:bg-cream-50/20">
            {t('home.hero.ctaQuiz')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const { t } = useLanguage();
  const items = [
    { key: 'verifiedSellers' },
    { key: 'freshRoastDates' },
    { key: 'originTransparency' },
    { key: 'aiGuidedDiscovery' },
  ];
  return (
    <section className="border-b border-espresso-100 bg-cream-100/60">
      <div className="container-page grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {items.map((i) => (
          <div key={i.key}>
            <p className="font-heading text-sm font-bold text-espresso-800">{t(`home.trust.${i.key}.label`)}</p>
            <p className="mt-1 text-xs leading-relaxed text-espresso-500">{t(`home.trust.${i.key}.desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AiTeaser() {
  const { t } = useLanguage();
  return (
    <section className="container-page">
      <div className="card relative overflow-hidden bg-gradient-to-br from-espresso-700 to-espresso-800 p-8 text-cream-50 sm:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative flex flex-col items-start gap-4 sm:max-w-lg">
          <span className="section-eyebrow text-gold-400">{t('home.aiTeaser.eyebrow')}</span>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">{t('home.aiTeaser.title')}</h2>
          <p className="text-sm text-cream-200/80 sm:text-base">{t('home.aiTeaser.body')}</p>
          <Link href="/ai-assistant" className="btn-gold">
            {t('home.aiTeaser.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SellerCta() {
  const { t } = useLanguage();
  return (
    <section className="container-page mt-8">
      <div className="card flex flex-col items-start gap-4 border-gold-200 bg-gold-50 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-espresso-800">{t('home.sellerCta.title')}</h2>
          <p className="mt-1.5 max-w-xl text-sm text-espresso-600">{t('home.sellerCta.body')}</p>
        </div>
        <Link href="/seller" className="btn-primary shrink-0">
          {t('home.sellerCta.cta')}
        </Link>
      </div>
    </section>
  );
}

export function Section({
  eyebrowKey,
  titleKey,
  action,
  children,
}: {
  eyebrowKey: string;
  titleKey: string;
  action?: { href: string; labelKey: string };
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <section className="container-page py-14">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">{t(eyebrowKey)}</p>
          <h2 className="mt-1.5 font-heading text-2xl font-bold text-espresso-800 sm:text-3xl">{t(titleKey)}</h2>
        </div>
        {action && (
          <Link href={action.href} className="hidden shrink-0 text-sm font-semibold text-espresso-600 hover:text-espresso-900 sm:block">
            {t(action.labelKey)} &rarr;
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
