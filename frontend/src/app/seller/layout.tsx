'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

const NAV = [
  { href: '/seller', label: 'Dashboard' },
  { href: '/seller/products', label: 'Products' },
  { href: '/seller/orders', label: 'Orders' },
  { href: '/seller/returns', label: 'Returns' },
  { href: '/seller/delivery', label: 'Delivery Zones' },
  { href: '/seller/payouts', label: 'Payouts' },
  { href: '/seller/profile', label: 'Company Profile' },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'seller')) router.push('/login');
  }, [loading, user, router]);

  if (loading || !user || user.role !== 'seller') {
    return <div className="container-page py-16 text-center text-espresso-400">Loading…</div>;
  }

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-1">
        <p className="mb-4 font-heading text-lg font-bold text-espresso-800">Seller Portal</p>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${
              pathname === n.href ? 'bg-espresso-700 text-cream-50' : 'text-espresso-600 hover:bg-cream-100'
            }`}
          >
            {n.label}
          </Link>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  );
}
