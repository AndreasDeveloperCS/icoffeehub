export const SUPPORTED_LOCALES = ['en', 'es', 'pt', 'fr', 'el', 'bg', 'ar'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_STORAGE_KEY = 'icoffeehub-locale';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  el: 'Ελληνικά',
  bg: 'Български',
  ar: 'العربية',
};

export const RTL_LOCALES: readonly Locale[] = ['ar'];

export function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Picks the best supported locale from a list of browser language tags (e.g. `navigator.languages`). */
export function detectBrowserLocale(candidates: readonly string[]): Locale {
  for (const raw of candidates) {
    if (!raw) continue;
    const primary = raw.split('-')[0].toLowerCase();
    if (isSupportedLocale(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}
