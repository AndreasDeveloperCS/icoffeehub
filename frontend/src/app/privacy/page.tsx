'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <main className="container-page py-16 lg:py-24">
      <article className="mx-auto max-w-4xl">
        <header className="mb-12">
          <p className="text-sm font-bold uppercase tracking-wider text-gold-600">
            {t('privacy.eyebrow')}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-espresso-900 sm:text-5xl">
            {t('privacy.title')}
          </h1>

          <p className="mt-4 text-sm text-espresso-500">
            {t('privacy.lastUpdated')}
          </p>
        </header>

        <div className="space-y-10 text-base leading-8 text-espresso-700">
          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.introduction.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.introduction.body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.information.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.information.body')}
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>{t('privacy.sections.information.items.account')}</li>
              <li>{t('privacy.sections.information.items.orders')}</li>
              <li>{t('privacy.sections.information.items.technical')}</li>
              <li>{t('privacy.sections.information.items.communication')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.use.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.use.body')}
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>{t('privacy.sections.use.items.account')}</li>
              <li>{t('privacy.sections.use.items.orders')}</li>
              <li>{t('privacy.sections.use.items.marketplace')}</li>
              <li>{t('privacy.sections.use.items.ai')}</li>
              <li>{t('privacy.sections.use.items.security')}</li>
              <li>{t('privacy.sections.use.items.improvement')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.ai.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.ai.body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.cookies.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.cookies.body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.storage.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.storage.body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.sharing.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.sharing.body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.security.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.security.body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.rights.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.rights.body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.children.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.children.body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.changes.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.changes.body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-espresso-900">
              {t('privacy.sections.contact.title')}
            </h2>
            <p className="mt-4">
              {t('privacy.sections.contact.body')}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}