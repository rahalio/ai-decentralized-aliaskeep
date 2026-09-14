'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, idempotencyKey } from '@/lib/api';
import {
  DataTable,
  ErrorBox,
  PageHeader,
  Panel,
  PrimaryButton,
  StatusPill,
} from '@/components/ui';

type Erasure = {
  erasureId: string;
  vaultId: string;
  status: string;
  certificateId?: string;
  erasureReason: string;
};

export default function ErasuresPage() {
  const [items, setItems] = useState<Erasure[]>([]);
  const [vaultId, setVaultId] = useState('vlt_01demo00000000000000000001');
  const [reason, setReason] = useState('DSR / logical erasure');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await apiFetch<{ data: { items: Erasure[] } }>('/v1/erasures');
      setItems(res.data.items ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load erasures');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onExecute(e: FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/v1/erasures', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify({ vaultId, erasureReason: reason }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erasure failed');
    }
  }

  return (
    <div>
      <PageHeader
        title="Logical erasure workspace"
        subtitle="Destroy link material and emit an anonymisation certificate — distinct from access suspension."
      />
      {error ? <ErrorBox message={error} /> : null}
      <Panel className="mb-4">
        <form onSubmit={onExecute} className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="text-graphite">Vault id</span>
            <input
              className="mt-1 block w-72 rounded-md border border-white/10 bg-charcoal-950 px-2 py-1.5 font-mono text-xs"
              value={vaultId}
              onChange={(e) => setVaultId(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="text-graphite">Reason</span>
            <input
              className="mt-1 block w-64 rounded-md border border-white/10 bg-charcoal-950 px-2 py-1.5 text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <PrimaryButton type="submit">Execute logical erasure</PrimaryButton>
        </form>
        <p className="mt-2 text-xs text-amber">
          Warning: this destroys re-identification links. Use Suspend on Link
          grants for temporary access halt.
        </p>
      </Panel>
      <DataTable
        columns={['Erasure', 'Vault', 'Status', 'Certificate', 'Reason']}
        rows={items.map((row) => [
          <span key="id" className="font-mono text-xs">
            {row.erasureId}
          </span>,
          <span key="v" className="font-mono text-xs text-brand">
            {row.vaultId}
          </span>,
          <StatusPill
            key="s"
            tone={
              row.status === 'completed'
                ? 'seal'
                : row.status === 'sla_breach'
                  ? 'coral'
                  : 'amber'
            }
          >
            {row.status}
          </StatusPill>,
          row.certificateId ? (
            <Link
              key="c"
              href={`/erasures/certificates/${row.certificateId}`}
              className="font-mono text-xs text-link"
            >
              {row.certificateId}
            </Link>
          ) : (
            '—'
          ),
          row.erasureReason,
        ])}
        empty="No open erasures."
      />
    </div>
  );
}
