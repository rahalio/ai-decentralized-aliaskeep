'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch, idempotencyKey } from '@/lib/api';
import {
  DataTable,
  ErrorBox,
  PageHeader,
  Panel,
  PrimaryButton,
  StatusPill,
} from '@/components/ui';

type Vault = {
  vaultId: string;
  consortiumId: string;
  pseudonymId?: string;
  status: string;
  bindStatus: string;
  activeGrantCount?: number;
};

export default function VaultsPage() {
  const [items, setItems] = useState<Vault[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pseudonymId, setPseudonymId] = useState('');
  const [consortiumId, setConsortiumId] = useState(
    'cns_01demo00000000000000000001'
  );
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const res = await apiFetch<{ data: { items: Vault[] } }>('/v1/vaults');
      setItems(res.data.items ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vaults');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await apiFetch('/v1/vaults', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify({
          consortiumId,
          pseudonymId:
            pseudonymId ||
            `psn_${Date.now().toString(36).padEnd(26, '0').slice(0, 26)}`,
        }),
      });
      setPseudonymId('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Identity vault registry"
        subtitle="One governed off-chain vault per on-chain pseudonym — no orphans or duplicates."
      />
      {error ? <ErrorBox message={error} /> : null}
      <Panel className="mb-4">
        <form onSubmit={onCreate} className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="text-graphite">Consortium</span>
            <input
              className="mt-1 block w-64 rounded-md border border-white/10 bg-charcoal-950 px-2 py-1.5 font-mono text-xs"
              value={consortiumId}
              onChange={(e) => setConsortiumId(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="text-graphite">Pseudonym id (optional)</span>
            <input
              className="mt-1 block w-72 rounded-md border border-white/10 bg-charcoal-950 px-2 py-1.5 font-mono text-xs"
              value={pseudonymId}
              onChange={(e) => setPseudonymId(e.target.value)}
              placeholder="auto-generate"
            />
          </label>
          <PrimaryButton type="submit" disabled={busy}>
            Register vault
          </PrimaryButton>
        </form>
      </Panel>
      <DataTable
        columns={['Vault', 'Pseudonym', 'Bind', 'Status', 'Grants']}
        rows={items.map((v) => [
          <span key="id" className="font-mono text-xs text-brand">
            {v.vaultId}
          </span>,
          <span key="psn" className="font-mono text-xs">
            {v.pseudonymId ?? '—'}
          </span>,
          <StatusPill key="b" tone={v.bindStatus === 'bound' ? 'link' : 'amber'}>
            {v.bindStatus}
          </StatusPill>,
          <StatusPill
            key="s"
            tone={v.status === 'active' ? 'link' : 'seal'}
          >
            {v.status}
          </StatusPill>,
          String(v.activeGrantCount ?? 0),
        ])}
        empty="Register the first vault to bind a pseudonym."
      />
    </div>
  );
}
