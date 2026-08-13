'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/sellers', label: 'Seller Approvals' },
  { href: '/admin/products', label: 'Product Moderation' },
  { href: '/admin/reviews', label: 'Review Moderation' },
  { href: '/admin/articles', label: 'Articles (CMS)' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/payouts', label: 'Seller Payouts' },
  { href: '/admin/disputes', label: 'Disputes' },
  { href: '/admin/tickets', label: 'Support Tickets' },
  { href: '/admin/audit-logs', label: 'Audit Log' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [loading, user, router]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="container-page py-16 text-center text-espresso-400">Loading…</div>;
  }

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-1">
        <p className="mb-4 font-heading text-lg font-bold text-espresso-800">Admin</p>
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
