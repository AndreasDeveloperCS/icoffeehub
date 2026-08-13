'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { Order, SellerCompany } from '@/lib/types';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [shipForm, setShipForm] = useState<Record<string, { carrierName: string; trackingNumber: string }>>({});
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    api<Order[]>('/orders/seller/mine').then(setOrders).catch(() => setOrders([]));
  }

  useEffect(() => {
    api<SellerCompany>('/sellers/me').then((s) => setSellerId(s._id)).catch(() => setSellerId(null));
    load();
  }, []);

  async function markShipped(orderId: string) {
    const data = shipForm[orderId];
    if (!data?.carrierName) return;
    setError(null);
    setBusyOrderId(orderId);
    try {
      await api(`/fulfillment/orders/${orderId}/ship`, { method: 'POST', body: data });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not mark order as shipped.');
    } finally {
      setBusyOrderId(null);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Orders</h1>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {!orders ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">No orders yet.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {orders.map((o) => {
            const myFulfillment = o.fulfillment?.find((f) => f.sellerId === sellerId);
            const myItems = o.items.filter((item) => item.sellerId === sellerId);
            return (
              <div key={o._id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-espresso-800">#{o._id.slice(-6).toUpperCase()}</p>
                  <span className="badge bg-forest-50 text-forest-700 capitalize">{o.status}</span>
                  <p className="text-xs text-espresso-400">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="mt-2 space-y-1">
                  {myItems.map((item) => (
                    <div key={`${item.productId}-${item.sku}`} className="flex justify-between text-sm text-espresso-600">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatMoney(item.price * item.quantity, item.currency)}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-espresso-400">
                  Ship to: {o.shippingAddress.fullName}, {o.shippingAddress.city}, {o.shippingAddress.country}
                </p>

                {myFulfillment?.status === 'pending' ? (
                  <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-espresso-100 pt-3">
                    <div>
                      <label className="label">Carrier</label>
                      <input
                        className="input w-40"
                        placeholder="e.g. DHL"
                        value={shipForm[o._id]?.carrierName ?? ''}
                        onChange={(e) => setShipForm({ ...shipForm, [o._id]: { ...shipForm[o._id], carrierName: e.target.value, trackingNumber: shipForm[o._id]?.trackingNumber ?? '' } })}
                      />
                    </div>
                    <div>
                      <label className="label">Tracking number</label>
                      <input
                        className="input w-44"
                        value={shipForm[o._id]?.trackingNumber ?? ''}
                        onChange={(e) => setShipForm({ ...shipForm, [o._id]: { ...shipForm[o._id], trackingNumber: e.target.value, carrierName: shipForm[o._id]?.carrierName ?? '' } })}
                      />
                    </div>
                    <button
                      onClick={() => markShipped(o._id)}
                      disabled={busyOrderId === o._id || !shipForm[o._id]?.carrierName}
                      className="btn-primary"
                    >
                      {busyOrderId === o._id ? 'Marking…' : 'Mark shipped'}
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 border-t border-espresso-100 pt-3 text-xs font-semibold text-forest-700 capitalize">
                    {myFulfillment?.status ?? 'shipped'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
