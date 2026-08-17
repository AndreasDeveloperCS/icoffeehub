'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  isSupportedLocale,
  Locale,
  LOCALE_STORAGE_KEY,
  RTL_LOCALES,
} from './config';
import { MESSAGES, Messages } from './locales';

type TranslateVars = Record<string, string | number | undefined>;
type TranslateFn = (key: string, vars?: TranslateVars) => string;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolve(messages: Messages, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[part];
    return undefined;
  }, messages);
}

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) => (vars[name] != null ? String(vars[name]) : ''));
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Runs once on mount: a stored preference wins, otherwise fall back to the browser's languages.
  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isSupportedLocale(stored)) {
      setLocaleState(stored);
    } else {
      setLocaleState(detectBrowserLocale(navigator.languages ?? [navigator.language]));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const t = useCallback<TranslateFn>(
    (key, vars) => {
      const found = resolve(MESSAGES[locale], key) ?? resolve(MESSAGES[DEFAULT_LOCALE], key);
      if (typeof found !== 'string') return key;
      return interpolate(found, vars);
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
