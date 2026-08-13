'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { AuditLogEntry } from '@/lib/types';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[] | null>(null);

  useEffect(() => {
    api<AuditLogEntry[]>('/admin/audit-logs').then(setLogs).catch(() => setLogs([]));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-espresso-800">Audit Log</h1>
      <p className="mt-1 text-sm text-espresso-500">A record of admin and seller actions across the platform.</p>

      {!logs ? (
        <p className="mt-4 text-sm text-espresso-400">Loading…</p>
      ) : logs.length === 0 ? (
        <p className="mt-4 text-sm text-espresso-500">No logged actions yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl2 border border-espresso-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-100 text-xs uppercase tracking-wide text-espresso-500">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Actor Role</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id} className="border-t border-espresso-100">
                  <td className="px-4 py-3 font-medium text-espresso-800">{l.action}</td>
                  <td className="px-4 py-3 capitalize text-espresso-600">{l.actorRole}</td>
                  <td className="px-4 py-3 text-espresso-600">{l.targetType} {l.targetId ? `(${l.targetId.slice(-6)})` : ''}</td>
                  <td className="px-4 py-3 text-espresso-500">{new Date(l.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
