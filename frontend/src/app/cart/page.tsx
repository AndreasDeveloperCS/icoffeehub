'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { formatMoney } from '@/lib/format';

export default function CartPage() {
  const { user, loading } = useAuth();
  const { cart, updateItem, removeItem } = useCart();

  if (loading) return <div className="container-page py-16 text-center text-espresso-400">Loading…</div>;

  if (!user) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-espresso-800">Sign in to view your cart</h1>
        <Link href="/login" className="btn-primary">Sign in</Link>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-espresso-800">Your cart is empty</h1>
        <p className="text-sm text-espresso-500">Explore the marketplace to find your next favorite coffee.</p>
        <Link href="/marketplace" className="btn-primary">Browse the marketplace</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-heading text-3xl font-bold text-espresso-800">Your Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.sku}`} className="card flex items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-espresso-400 to-espresso-600" />
              <div className="flex-1">
                <p className="font-semibold text-espresso-800">{item.name}</p>
                <p className="text-xs text-espresso-400">{item.sku}</p>
              </div>
              <div className="flex items-center rounded-full border border-espresso-200">
                <button
                  className="px-3 py-1.5 text-espresso-600"
                  onClick={() => updateItem(item.productId, item.sku, item.quantity - 1)}
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  className="px-3 py-1.5 text-espresso-600"
                  onClick={() => updateItem(item.productId, item.sku, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="w-20 text-right font-semibold text-espresso-800">
                {formatMoney(item.price * item.quantity, item.currency)}
              </p>
              <button
                onClick={() => removeItem(item.productId, item.sku)}
                className="text-espresso-300 hover:text-red-600"
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-heading text-lg font-bold text-espresso-800">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-espresso-600">
            <span>Subtotal</span>
            <span className="font-semibold text-espresso-800">{formatMoney(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-espresso-400">Shipping is calculated at checkout based on delivery country.</p>
          <Link href="/checkout" className="btn-primary mt-5 w-full">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
