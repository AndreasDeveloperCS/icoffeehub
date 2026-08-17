import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Providers } from '@/components/Providers';

const heading = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'iCoffeeHub.com — Everything About Coffee. One Global Hub.',
  description:
    'A global coffee marketplace, encyclopedia and AI assistant connecting coffee farms, roasters, shops and enthusiasts worldwide.',
  // Language is switched client-side (see LanguageProvider) rather than via
  // locale-prefixed routes, so there is no separate crawlable URL per
  // language for hreflang to point at. og:locale/alternate still tells
  // crawlers and social scrapers which languages the page supports.
  openGraph: {
    locale: 'en_US',
    alternateLocale: ['es_ES', 'pt_PT', 'fr_FR', 'el_GR', 'bg_BG', 'ar_AR'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <Providers>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
