'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { Order } from '@/lib/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    api<Order[]>('/admin/orders').then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Orders</h1>

      {!orders ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">No orders yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl2 border border-espresso-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-100 text-xs uppercase tracking-wide text-espresso-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-espresso-100">
                  <td className="px-4 py-3 font-medium text-espresso-800">#{o._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3 capitalize text-espresso-600">{o.status}</td>
                  <td className="px-4 py-3 text-espresso-600">{formatMoney(o.total, o.currency)}</td>
                  <td className="px-4 py-3 text-espresso-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
