export interface ArticleSourceSeed {
  title: string;
  url: string;
}

/** Locale-independent facts about one encyclopedia article: what it is, not what it says. */
export interface ArticleMeta {
  translationGroup: string;
  type: 'encyclopedia' | 'country' | 'brew_guide' | 'recipe' | 'course' | 'news';
  countrySlug?: string;
  tags: string[];
  sources: ArticleSourceSeed[];
}

/** The translated copy for one article in one language. */
export interface ArticleTranslation {
  translationGroup: string;
  title: string;
  summary: string;
  body: string;
  /** Optional per-locale <title> tag override, kept short for SEO/GEO snippet display. */
  seoTitle?: string;
  /** Optional per-locale meta-description override, kept short for SEO/GEO snippet display. */
  seoDescription?: string;
}
