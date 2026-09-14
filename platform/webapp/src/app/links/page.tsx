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

type Grant = {
  grantId: string;
  vaultId: string;
  participantId: string;
  channelId: string;
  status: string;
  lawfulBasis: string;
};

export default function LinksPage() {
  const [items, setItems] = useState<Grant[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await apiFetch<{ data: { items: Grant[] } }>(
        '/v1/links/grants'
      );
      setItems(res.data.items ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load grants');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function act(path: string, body: Record<string, unknown> = {}) {
    try {
      await apiFetch(path, {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify(body),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    }
  }

  return (
    <div>
      <PageHeader
        title="Link grants"
        subtitle="Allocate re-identification access by channel and lawful basis. Suspend is not erasure (BR-10)."
      />
      {error ? <ErrorBox message={error} /> : null}
      <DataTable
        columns={['Grant', 'Vault', 'Participant', 'Channel', 'Status', 'Actions']}
        rows={items.map((g) => [
          <span key="id" className="font-mono text-xs">
            {g.grantId}
          </span>,
          <span key="v" className="font-mono text-xs text-brand">
            {g.vaultId}
          </span>,
          <span key="p" className="font-mono text-xs">
            {g.participantId}
          </span>,
          g.channelId,
          <StatusPill
            key="s"
            tone={
              g.status === 'active'
                ? 'link'
                : g.status === 'suspended'
                  ? 'amber'
                  : 'seal'
            }
          >
            {g.status}
          </StatusPill>,
          <div key="a" className="flex flex-wrap gap-1">
            {g.status === 'active' ? (
              <>
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    act(`/v1/links/grants/${g.grantId}/suspend`, {
                      reason: 'Operator suspension from console',
                    })
                  }
                >
                  Suspend
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    act(`/v1/links/grants/${g.grantId}/revoke`, {
                      reason: 'Operator revoke from console',
                    })
                  }
                >
                  Revoke
                </SecondaryButton>
              </>
            ) : null}
            {g.status === 'suspended' ? (
              <PrimaryButton
                type="button"
                onClick={() => act(`/v1/links/grants/${g.grantId}/restore`)}
              >
                Restore
              </PrimaryButton>
            ) : null}
          </div>,
        ])}
        empty="No grants yet — attest a participant and approve a policy first."
      />
    </div>
  );
}
