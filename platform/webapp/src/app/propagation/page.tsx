'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch, idempotencyKey } from '@/lib/api';
import {
  DataTable,
  ErrorBox,
  PageHeader,
  Panel,
  SecondaryButton,
  StatusPill,
} from '@/components/ui';

type Propagation = {
  erasureId: string;
  slaDeadlineAt: string;
  slaBreached?: boolean;
  holders: Array<{
    participantId: string;
    status: string;
    lastNudgedAt?: string;
  }>;
  recreationAttempts?: number;
};

export default function PropagationPage() {
  const [erasureId, setErasureId] = useState('');
  const [data, setData] = useState<Propagation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ data: { items: Array<{ erasureId: string }> } }>('/v1/erasures')
      .then((r) => {
        const first = r.data.items?.[0]?.erasureId;
        if (first) setErasureId(first);
      })
      .catch(() => undefined);
  }, []);

  async function load(id: string) {
    if (!id) return;
    try {
      const res = await apiFetch<{ data: Propagation }>(
        `/v1/erasures/${id}/propagation`
      );
      setData(res.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load propagation');
    }
  }

  useEffect(() => {
    if (erasureId) void load(erasureId);
  }, [erasureId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await load(erasureId);
  }

  async function nudge(participantId: string) {
    try {
      await apiFetch(`/v1/erasures/${erasureId}/propagation/nudge`, {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify({ participantId }),
      });
      await load(erasureId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nudge failed');
    }
  }

  return (
    <div>
      <PageHeader
        title="Cross-participant revocation monitor"
        subtitle="Prove erasure propagated within SLA; block unilateral link recreation (BR-7, BR-12)."
      />
      {error ? <ErrorBox message={error} /> : null}
      <Panel className="mb-4">
        <form onSubmit={onSubmit} className="flex flex-wrap gap-3">
          <input
            className="w-80 rounded-md border border-white/10 bg-charcoal-950 px-3 py-2 font-mono text-xs"
            value={erasureId}
            onChange={(e) => setErasureId(e.target.value)}
            placeholder="erasure id"
          />
          <SecondaryButton type="submit">Load ack matrix</SecondaryButton>
        </form>
        {data ? (
          <div className="mt-3 flex gap-2 text-sm">
            <StatusPill tone={data.slaBreached ? 'coral' : 'amber'}>
              SLA {data.slaBreached ? 'breached' : 'open'}
            </StatusPill>
            <span className="font-mono text-xs text-graphite">
              deadline {data.slaDeadlineAt}
            </span>
            <StatusPill tone="coral">
              recreation attempts {data.recreationAttempts ?? 0}
            </StatusPill>
          </div>
        ) : null}
      </Panel>
      <DataTable
        columns={['Participant', 'Ack status', 'Last nudged', 'Actions']}
        rows={(data?.holders ?? []).map((h) => [
          <span key="p" className="font-mono text-xs">
            {h.participantId}
          </span>,
          <StatusPill
            key="s"
            tone={
              h.status === 'acknowledged'
                ? 'link'
                : h.status === 'recreation_blocked'
                  ? 'coral'
                  : 'amber'
            }
          >
            {h.status}
          </StatusPill>,
          h.lastNudgedAt ?? '—',
          h.status === 'pending' ? (
            <SecondaryButton
              key="n"
              type="button"
              onClick={() => nudge(h.participantId)}
            >
              Nudge
            </SecondaryButton>
          ) : (
            '—'
          ),
        ])}
        empty="Select an erasure to view the holder acknowledgement matrix."
      />
    </div>
  );
}
