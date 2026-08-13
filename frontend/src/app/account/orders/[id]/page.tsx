'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { Order, OrderTracking } from '@/lib/types';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<OrderTracking[]>([]);
  const [returnSku, setReturnSku] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  function load() {
    api<Order>(`/orders/${params.id}`).then(setOrder).catch(() => setOrder(null));
    api<OrderTracking[]>(`/fulfillment/orders/${params.id}/tracking`).then(setTracking).catch(() => setTracking([]));
  }

  useEffect(load, [params.id]);

  async function submitReturn(e: React.FormEvent) {
    e.preventDefault();
    if (!returnSku) return;
    try {
      await api('/returns', { method: 'POST', body: { orderId: params.id, sku: returnSku, reason } });
      setMessage('Return request submitted.');
      setReturnSku(null);
      setReason('');
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Could not submit return request.');
    }
  }

  async function submitDispute(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api('/disputes', { method: 'POST', body: { orderId: params.id, reason: disputeReason } });
      setMessage('Dispute filed — our support team will review it.');
      setDisputeOpen(false);
      setDisputeReason('');
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Could not file dispute.');
    }
  }

  if (!order) return <p className="text-sm text-espresso-400">Loading…</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-heading text-2xl font-bold text-espresso-800">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="text-xs text-espresso-400">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="badge bg-forest-50 text-forest-700 capitalize">{order.status}</span>
      </div>

      {message && <p className="rounded-lg bg-cream-100 px-3 py-2 text-sm text-espresso-700">{message}</p>}

      <div className="card p-5">
        <h2 className="font-heading text-sm font-bold text-espresso-800">Items</h2>
        <div className="mt-3 space-y-3">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.sku}`} className="flex flex-wrap items-center justify-between gap-2 border-t border-espresso-100 pt-3 first:border-0 first:pt-0">
              <div>
                <p className="text-sm font-medium text-espresso-800">{item.name} × {item.quantity}</p>
                <p className="text-xs text-espresso-400">{item.sku}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-espresso-600">{formatMoney(item.price * item.quantity, item.currency)}</span>
                <button onClick={() => setReturnSku(item.sku)} className="text-xs font-semibold text-espresso-600 hover:underline">
                  Request return
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-espresso-100 pt-4 text-sm">
          <div className="flex justify-between text-espresso-500"><span>Subtotal</span><span>{formatMoney(order.subtotal, order.currency)}</span></div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-forest-700"><span>Discount ({order.couponCode})</span><span>-{formatMoney(order.discountTotal, order.currency)}</span></div>
          )}
          <div className="flex justify-between text-espresso-500"><span>Shipping</span><span>{formatMoney(order.shippingTotal, order.currency)}</span></div>
          <div className="flex justify-between font-semibold text-espresso-800"><span>Total</span><span>{formatMoney(order.total, order.currency)}</span></div>
        </div>
      </div>

      {returnSku && (
        <form onSubmit={submitReturn} className="card space-y-3 p-5">
          <h3 className="font-heading text-sm font-bold text-espresso-800">Return {returnSku}</h3>
          <textarea required className="input min-h-[70px]" placeholder="Why are you returning this item?" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setReturnSku(null)} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">Submit return request</button>
          </div>
        </form>
      )}

      <div className="card p-5">
        <h2 className="font-heading text-sm font-bold text-espresso-800">Shipment Tracking</h2>
        {tracking.length === 0 ? (
          <p className="mt-3 text-sm text-espresso-500">No shipments yet — the seller hasn&apos;t marked this order as shipped.</p>
        ) : (
          <div className="mt-3 space-y-4">
            {tracking.map(({ shipment, events }) => (
              <div key={shipment._id} className="border-t border-espresso-100 pt-4 first:border-0 first:pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-espresso-800">
                    {shipment.carrierName ?? 'Carrier'} {shipment.trackingNumber && `· ${shipment.trackingNumber}`}
                  </p>
                  <span className="badge bg-gold-50 text-gold-700 capitalize">{shipment.status.replace('_', ' ')}</span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {events.map((e) => (
                    <li key={e._id} className="text-xs text-espresso-500">
                      <span className="font-medium text-espresso-700 capitalize">{e.status.replace('_', ' ')}</span>
                      {e.location && ` — ${e.location}`}
                      {e.note && ` — ${e.note}`}
                      <span className="ml-1 text-espresso-400">({new Date(e.occurredAt).toLocaleDateString()})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold text-espresso-800">Having a problem with this order?</h2>
          {!disputeOpen && (
            <button onClick={() => setDisputeOpen(true)} className="btn-outline">File a dispute</button>
          )}
        </div>
        {disputeOpen && (
          <form onSubmit={submitDispute} className="mt-3 space-y-3">
            <textarea required className="input min-h-[70px]" placeholder="What went wrong?" value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} />
            <div className="flex gap-2">
              <button type="button" onClick={() => setDisputeOpen(false)} className="btn-outline">Cancel</button>
              <button type="submit" className="btn-primary">Submit dispute</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
