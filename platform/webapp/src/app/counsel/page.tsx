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

type Policy = {
  policyId: string;
  channelId: string;
  lawfulBasis?: string;
  crossBorder?: boolean;
  approvalStatus: string;
};

export default function CounselPage() {
  const [items, setItems] = useState<Policy[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await apiFetch<{ data: { items: Policy[] } }>(
        '/v1/links/policies?approvalStatus=pending_counsel'
      );
      const pending = res.data.items ?? [];
      if (!pending.length) {
        const all = await apiFetch<{ data: { items: Policy[] } }>(
          '/v1/links/policies'
        );
        setItems(all.data.items ?? []);
      } else setItems(pending);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load policies');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function decide(id: string, action: 'approve' | 'reject') {
    try {
      await apiFetch(`/v1/links/policies/${id}/${action}`, {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify({ note: `Counsel ${action} from inbox` }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Decision failed');
    }
  }

  return (
    <div>
      <PageHeader
        title="Counsel inbox"
        subtitle="Approve cross-border link policies and review erasure certificates (BR-8)."
      />
      {error ? <ErrorBox message={error} /> : null}
      <DataTable
        columns={['Policy', 'Channel', 'Basis', 'Cross-border', 'Status', 'Actions']}
        rows={items.map((p) => [
          <span key="id" className="font-mono text-xs">
            {p.policyId}
          </span>,
          p.channelId,
          p.lawfulBasis ?? '—',
          p.crossBorder ? 'yes' : 'no',
          <StatusPill
            key="s"
            tone={
              p.approvalStatus === 'approved'
                ? 'link'
                : p.approvalStatus === 'rejected'
                  ? 'coral'
                  : 'amber'
            }
          >
            {p.approvalStatus}
          </StatusPill>,
          p.approvalStatus === 'pending_counsel' ||
          p.approvalStatus === 'draft' ? (
            <div key="a" className="flex gap-1">
              <PrimaryButton type="button" onClick={() => decide(p.policyId, 'approve')}>
                Approve
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => decide(p.policyId, 'reject')}>
                Reject
              </SecondaryButton>
            </div>
          ) : (
            '—'
          ),
        ])}
        empty="No pending counsel actions."
      />
    </div>
  );
}
