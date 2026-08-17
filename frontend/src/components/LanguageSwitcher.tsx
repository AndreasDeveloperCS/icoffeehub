'use client';

import { useState } from 'react';
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@/lib/i18n/config';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t('common.language')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-espresso-200 px-3 py-1.5 text-sm font-medium text-espresso-700 hover:bg-espresso-50"
      >
        <GlobeIcon />
        <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
        <ChevronIcon />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-espresso-100 bg-white shadow-card-hover"
          onMouseLeave={() => setOpen(false)}
        >
          {SUPPORTED_LOCALES.map((code) => (
            <li key={code} role="option" aria-selected={code === locale}>
              <button
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-cream-100 ${
                  code === locale ? 'font-semibold text-espresso-900' : 'text-espresso-700'
                }`}
              >
                {LOCALE_LABELS[code]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
