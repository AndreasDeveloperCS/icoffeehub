'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Country } from '@/lib/types';

interface Zone {
  countryCode: string;
  flatRate: number;
  estimatedDays?: number;
}

export default function DeliveryZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      api<Zone[]>('/logistics/me/zones').catch(() => []),
      api<Country[]>('/countries', { auth: false }).catch(() => []),
    ]).then(([z, c]) => {
      setZones(z.map((zz) => ({ countryCode: zz.countryCode, flatRate: zz.flatRate, estimatedDays: zz.estimatedDays })));
      setCountries(c);
    });
  }, []);

  function addZone() {
    setZones((z) => [...z, { countryCode: countries[0]?.isoCode ?? '', flatRate: 10, estimatedDays: 7 }]);
  }

  function updateZone(i: number, patch: Partial<Zone>) {
    setZones((z) => z.map((zz, idx) => (idx === i ? { ...zz, ...patch } : zz)));
  }

  function removeZone(i: number) {
    setZones((z) => z.filter((_, idx) => idx !== i));
  }

  async function onSave() {
    setSaving(true);
    try {
      await api('/logistics/me/zones', { method: 'POST', body: { zones } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Delivery Zones</h1>
      <p className="mt-1 text-sm text-espresso-500">
        Set a flat shipping rate for each country you deliver to. Products only appear to customers in countries
        you&apos;ve added here.
      </p>

      <div className="mt-6 space-y-3">
        {zones.map((z, i) => (
          <div key={i} className="card grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            <div>
              <label className="label">Country</label>
              <select className="input" value={z.countryCode} onChange={(e) => updateZone(i, { countryCode: e.target.value })}>
                {countries.map((c) => (
                  <option key={c._id} value={c.isoCode}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Flat rate (USD)</label>
              <input type="number" step="0.01" className="input" value={z.flatRate} onChange={(e) => updateZone(i, { flatRate: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Est. days</label>
              <input type="number" className="input" value={z.estimatedDays ?? 7} onChange={(e) => updateZone(i, { estimatedDays: Number(e.target.value) })} />
            </div>
            <div className="flex items-end">
              <button onClick={() => removeZone(i)} className="text-sm text-red-600 hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button onClick={addZone} className="btn-outline">+ Add country</button>
        <button onClick={onSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save delivery zones'}
        </button>
      </div>
    </div>
  );
}
