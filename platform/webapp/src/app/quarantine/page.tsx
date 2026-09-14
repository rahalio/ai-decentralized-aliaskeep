'use client';

import { useEffect, useState } from 'react';
import { apiFetch, idempotencyKey } from '@/lib/api';
import {
  DataTable,
  ErrorBox,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  StatusPill,
} from '@/components/ui';

type Item = {
  quarantineId: string;
  confidence: number;
  status: string;
  channelId?: string;
  fieldPath?: string;
  detectedCategories?: string[];
};

export default function QuarantinePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await apiFetch<{ data: { items: Item[] } }>(
        '/v1/classification/quarantine'
      );
      setItems(res.data.items ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load quarantine');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function act(id: string, action: 'remediate' | 'waive' | 'reject') {
    try {
      await apiFetch(`/v1/classification/quarantine/${id}/${action}`, {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify(
          action === 'waive'
            ? { riskAcceptance: 'Operator accepted low-confidence override with documented risk.' }
            : { note: 'Console action' }
        ),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    }
  }

  return (
    <div>
      <PageHeader
        title="Classification quarantine"
        subtitle="Hold probable PD before the blockchain adapter. Low confidence never auto-passes (BR-9)."
      />
      {error ? <ErrorBox message={error} /> : null}
      <DataTable
        columns={['Hold', 'Confidence', 'Channel / field', 'Categories', 'Status', 'Actions']}
        rows={items.map((q) => [
          <span key="id" className="font-mono text-xs">
            {q.quarantineId}
          </span>,
          `${Math.round((q.confidence ?? 0) * 100)}%`,
          `${q.channelId ?? '—'} / ${q.fieldPath ?? '—'}`,
          (q.detectedCategories ?? []).join(', ') || '—',
          <StatusPill
            key="s"
            tone={q.status === 'held' ? 'amber' : q.status === 'rejected' ? 'coral' : 'link'}
          >
            {q.status}
          </StatusPill>,
          q.status === 'held' ? (
            <div key="a" className="flex flex-wrap gap-1">
              <PrimaryButton type="button" onClick={() => act(q.quarantineId, 'remediate')}>
                Remediate
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => act(q.quarantineId, 'waive')}>
                Waive risk
              </SecondaryButton>
              <SecondaryButton type="button" onClick={() => act(q.quarantineId, 'reject')}>
                Reject
              </SecondaryButton>
            </div>
          ) : (
            '—'
          ),
        ])}
        empty="Healthy — no classification holds."
      />
    </div>
  );
}
