import Link from 'next/link';
import { api } from '@/lib/api';
import { ProductCard, BeanIcon } from '@/components/ProductCard';
import type { Article, Country, Product } from '@/lib/types';

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [featured, countries, articles] = await Promise.all([
    safe(api<Product[]>('/products/featured', { auth: false }), []),
    safe(api<Country[]>('/countries?originOnly=true', { auth: false }), []),
    safe(api<Article[]>('/articles', { auth: false }), []),
  ]);

  return (
    <div>
      <Hero />
      <TrustStrip />

      {countries.length > 0 && (
        <Section eyebrow="Explore by Origin" title="Coffee has a birthplace for every cup">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {countries.slice(0, 12).map((c) => (
              <Link
                key={c._id}
                href={`/country/${c.slug}`}
                className="card group flex flex-col items-center gap-2 px-3 py-6 text-center hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso-50 text-espresso-600 group-hover:bg-gold-100 group-hover:text-gold-700">
                  <BeanIcon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-espresso-800">{c.name}</span>
                <span className="text-xs text-espresso-400">{c.region}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {featured.length > 0 && (
        <Section eyebrow="Hand-Picked" title="Featured coffees this week" action={{ href: '/marketplace', label: 'Browse all' }}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Section>
      )}

      <AiTeaser />

      {articles.length > 0 && (
        <Section eyebrow="Learn" title="From the Coffee Encyclopedia" action={{ href: '/encyclopedia', label: 'Explore encyclopedia' }}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 4).map((a) => (
              <Link key={a._id} href={`/encyclopedia/${a.slug}`} className="card flex flex-col p-5 hover:shadow-card-hover">
                <span className="section-eyebrow">{a.type.replace('_', ' ')}</span>
                <h3 className="mt-2 line-clamp-2 font-heading text-base font-semibold text-espresso-800">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-espresso-500">{a.summary}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <SellerCta />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-espresso-800">
      <div className="absolute inset-0 bg-grain-fade" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-forest-500/10 blur-3xl" />

      <div className="container-page relative flex flex-col items-start gap-6 py-20 sm:py-28">
        <span className="section-eyebrow text-gold-400">Global Coffee Marketplace &amp; Encyclopedia</span>
        <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight text-cream-50 sm:text-5xl">
          Everything about coffee.
          <br /> One global hub.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-cream-200/80 sm:text-lg">
          Discover verified farms and roasters, trace every bean back to its origin, and let our AI assistant guide
          you to your next favorite cup.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/marketplace" className="btn-gold">
            Explore the Marketplace
          </Link>
          <Link href="/ai-assistant" className="btn bg-cream-50/10 text-cream-50 hover:bg-cream-50/20">
            Take the Taste Quiz
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { label: 'Verified Sellers', desc: 'Farms & roasters reviewed before they list' },
    { label: 'Fresh Roast Dates', desc: 'Every bag shows exactly when it was roasted' },
    { label: 'Origin Transparency', desc: 'Farm, altitude and process on every product' },
    { label: 'AI-Guided Discovery', desc: 'Personalized picks from your taste profile' },
  ];
  return (
    <section className="border-b border-espresso-100 bg-cream-100/60">
      <div className="container-page grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {items.map((i) => (
          <div key={i.label}>
            <p className="font-heading text-sm font-bold text-espresso-800">{i.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-espresso-500">{i.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AiTeaser() {
  return (
    <section className="container-page">
      <div className="card relative overflow-hidden bg-gradient-to-br from-espresso-700 to-espresso-800 p-8 text-cream-50 sm:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative flex flex-col items-start gap-4 sm:max-w-lg">
          <span className="section-eyebrow text-gold-400">AI Coffee Assistant</span>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">Not sure what to brew next?</h2>
          <p className="text-sm text-cream-200/80 sm:text-base">
            Answer a few quick questions about roast, body and flavor and we&apos;ll match you with coffees from our
            global marketplace — clearly separating our recommendations from the facts in each listing.
          </p>
          <Link href="/ai-assistant" className="btn-gold">
            Start the taste quiz
          </Link>
        </div>
      </div>
    </section>
  );
}

function SellerCta() {
  return (
    <section className="container-page mt-8">
      <div className="card flex flex-col items-start gap-4 border-gold-200 bg-gold-50 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-espresso-800">Are you a coffee farm, roaster or shop?</h2>
          <p className="mt-1.5 max-w-xl text-sm text-espresso-600">
            List your coffee on iCoffeeHub and reach customers worldwide with transparent origin data and built-in
            delivery-zone logistics.
          </p>
        </div>
        <Link href="/seller" className="btn-primary shrink-0">
          Start selling
        </Link>
      </div>
    </section>
  );
}

function Section({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="container-page py-14">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="mt-1.5 font-heading text-2xl font-bold text-espresso-800 sm:text-3xl">{title}</h2>
        </div>
        {action && (
          <Link href={action.href} className="hidden shrink-0 text-sm font-semibold text-espresso-600 hover:text-espresso-900 sm:block">
            {action.label} &rarr;
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
