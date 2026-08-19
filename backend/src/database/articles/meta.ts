import { ArticleMeta } from './types';

// Locale-independent metadata for the seeded encyclopedia articles, keyed by
// translationGroup. Sources are real, externally verified references (see
// each article's `sources` array) rather than invented citations.
export const ARTICLE_META: ArticleMeta[] = [
  {
    translationGroup: 'origin-ethiopia',
    type: 'country',
    countrySlug: 'ethiopia',
    tags: ['ethiopia', 'origin', 'arabica'],
    sources: [
      { title: 'Coffee production in Ethiopia — Wikipedia', url: 'https://en.wikipedia.org/wiki/Coffee_production_in_Ethiopia' },
      { title: 'Specialty Coffee Association', url: 'https://sca.coffee/' },
    ],
  },
  {
    translationGroup: 'origin-colombia',
    type: 'country',
    countrySlug: 'colombia',
    tags: ['colombia', 'origin', 'arabica'],
    sources: [
      { title: 'Coffee production in Colombia — Wikipedia', url: 'https://en.wikipedia.org/wiki/Coffee_production_in_Colombia' },
      { title: 'International Coffee Organization', url: 'https://ico.org/' },
    ],
  },
  {
    translationGroup: 'brew-guide-v60',
    type: 'brew_guide',
    tags: ['brew guide', 'pour over', 'v60'],
    sources: [
      { title: 'Drip coffee — Wikipedia', url: 'https://en.wikipedia.org/wiki/Drip_coffee' },
      { title: 'Specialty Coffee Association', url: 'https://sca.coffee/' },
    ],
  },
  {
    translationGroup: 'brew-guide-french-press',
    type: 'brew_guide',
    tags: ['brew guide', 'french press', 'immersion'],
    sources: [{ title: 'French press — Wikipedia', url: 'https://en.wikipedia.org/wiki/French_press' }],
  },
  {
    translationGroup: 'recipe-cappuccino',
    type: 'recipe',
    tags: ['recipe', 'espresso', 'milk drink'],
    sources: [{ title: 'Cappuccino — Wikipedia', url: 'https://en.wikipedia.org/wiki/Cappuccino' }],
  },
  {
    translationGroup: 'recipe-cold-brew',
    type: 'recipe',
    tags: ['recipe', 'cold brew', 'iced coffee'],
    sources: [{ title: 'Cold brew coffee — Wikipedia', url: 'https://en.wikipedia.org/wiki/Cold_brew_coffee' }],
  },
  {
    translationGroup: 'course-cupping-101',
    type: 'course',
    tags: ['course', 'cupping', 'tasting'],
    sources: [
      { title: 'Coffee cupping — Wikipedia', url: 'https://en.wikipedia.org/wiki/Coffee_cupping' },
      { title: 'Specialty Coffee Association', url: 'https://sca.coffee/' },
    ],
  },
  {
    translationGroup: 'course-espresso-basics',
    type: 'course',
    tags: ['course', 'espresso', 'brewing science'],
    sources: [
      { title: 'Espresso — Wikipedia', url: 'https://en.wikipedia.org/wiki/Espresso' },
      { title: 'Espresso machine — Wikipedia', url: 'https://en.wikipedia.org/wiki/Espresso_machine' },
    ],
  },
  {
    translationGroup: 'news-c-market',
    type: 'news',
    tags: ['news', 'market', 'trade'],
    sources: [
      { title: 'ICE Coffee C Futures', url: 'https://www.ice.com/products/15/Coffee-C-Futures' },
      {
        title: "The 'C Price' as the Coffee Industry Knows It is Being Phased Out — Daily Coffee News",
        url: 'https://dailycoffeenews.com/2025/05/30/the-c-price-as-the-coffee-industry-knows-it-is-being-phased-out/',
      },
    ],
  },
  {
    translationGroup: 'news-global-trade',
    type: 'news',
    tags: ['news', 'trade', 'global market'],
    sources: [
      { title: 'International Coffee Organization', url: 'https://ico.org/' },
      { title: 'National Coffee Association', url: 'https://www.ncausa.org/about-nca' },
    ],
  },
  // --- Encyclopedia: short, definition-first glossary/pillar entries written for both
  // classic search (SEO) and AI answer engines (GEO) — clear up-front definitions,
  // concrete numbers, and citations an LLM can quote and attribute.
  {
    translationGroup: 'glossary-specialty-coffee',
    type: 'encyclopedia',
    tags: ['glossary', 'specialty coffee', 'grading'],
    sources: [
      { title: 'Specialty coffee — Wikipedia', url: 'https://en.wikipedia.org/wiki/Specialty_coffee' },
      { title: 'Specialty Coffee Association', url: 'https://sca.coffee/' },
    ],
  },
  {
    translationGroup: 'glossary-arabica-robusta',
    type: 'encyclopedia',
    tags: ['glossary', 'arabica', 'robusta', 'coffee species'],
    sources: [
      { title: 'Coffea arabica — Wikipedia', url: 'https://en.wikipedia.org/wiki/Coffea_arabica' },
      { title: 'Coffea canephora — Wikipedia', url: 'https://en.wikipedia.org/wiki/Coffea_canephora' },
    ],
  },
  {
    translationGroup: 'glossary-processing-methods',
    type: 'encyclopedia',
    tags: ['glossary', 'processing', 'washed', 'natural', 'honey'],
    sources: [
      { title: 'Coffee production — Wikipedia', url: 'https://en.wikipedia.org/wiki/Coffee_production' },
      { title: 'Specialty Coffee Association', url: 'https://sca.coffee/' },
    ],
  },
  {
    translationGroup: 'glossary-roast-levels',
    type: 'encyclopedia',
    tags: ['glossary', 'roasting', 'roast levels'],
    sources: [{ title: 'Coffee roasting — Wikipedia', url: 'https://en.wikipedia.org/wiki/Coffee_roasting' }],
  },
  {
    translationGroup: 'glossary-direct-trade',
    type: 'encyclopedia',
    tags: ['glossary', 'direct trade', 'sourcing'],
    sources: [{ title: 'Direct trade — Wikipedia', url: 'https://en.wikipedia.org/wiki/Direct_trade' }],
  },
];
