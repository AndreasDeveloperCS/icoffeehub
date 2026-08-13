import Link from 'next/link';
import { LogoWordmark } from './Logo';

const ORIGIN_COUNTRIES = ['Ethiopia', 'Kenya', 'Colombia', 'Brazil', 'Guatemala', 'Indonesia'];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-espresso-100 bg-espresso-800 text-cream-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <LogoWordmark className="[&_span]:text-cream-50 [&_span_span]:text-gold-400" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-200/80">
            Everything about coffee. One global hub. A marketplace, encyclopedia and AI assistant connecting coffee
            farms, roasters and enthusiasts worldwide.
          </p>
        </div>

        <FooterColumn
          title="Origin Countries"
          links={ORIGIN_COUNTRIES.map((c) => ({ label: c, href: `/country/${c.toLowerCase()}` }))}
        />
        <FooterColumn
          title="Discover"
          links={[
            { label: 'Marketplace', href: '/marketplace' },
            { label: 'Coffee Encyclopedia', href: '/encyclopedia' },
            { label: 'AI Coffee Assistant', href: '/ai-assistant' },
            { label: 'Brew Guides', href: '/encyclopedia?type=brew_guide' },
          ]}
        />
        <FooterColumn
          title="Business"
          links={[
            { label: 'Sell on iCoffeeHub', href: '/seller' },
            { label: 'Help & Support', href: '/' },
            { label: 'Terms of Service', href: '/' },
            { label: 'Privacy Policy', href: '/' },
          ]}
        />
      </div>

      <div className="border-t border-espresso-700">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream-200/60 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} iCoffeeHub.com — All rights reserved.</span>
          <span>English (US) · USD</span>
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
