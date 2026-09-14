'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch, idempotencyKey } from '@/lib/api';
import {
  DataTable,
  ErrorBox,
  PageHeader,
  Panel,
  PrimaryButton,
  SecondaryButton,
  StatusPill,
} from '@/components/ui';

type Participant = {
  participantId: string;
  name: string;
  jurisdiction?: string;
  gdprRole?: string;
  onboardingStatus: string;
  linkAllocationLocked?: boolean;
};

export default function ParticipantsPage() {
  const [items, setItems] = useState<Participant[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await apiFetch<{ data: { items: Participant[] } }>(
        '/v1/participants'
      );
      setItems(res.data.items ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load participants');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onboard(e: FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/v1/participants', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify({
          consortiumId: 'cns_01demo00000000000000000001',
          name,
          jurisdiction: 'AE',
          gdprRole: 'processor',
        }),
      });
      setName('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onboard failed');
    }
  }

  async function attest(id: string) {
    try {
      await apiFetch(`/v1/participants/${id}/attest`, {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify({ jurisdiction: 'AE', gdprRole: 'processor' }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Attest failed');
    }
  }

  return (
    <div>
      <PageHeader
        title="Participant onboarding"
        subtitle="Jurisdiction and GDPR role must be attested before link allocation (BR-5)."
      />
      {error ? <ErrorBox message={error} /> : null}
      <Panel className="mb-4">
        <form onSubmit={onboard} className="flex flex-wrap gap-3">
          <input
            className="rounded-md border border-white/10 bg-charcoal-950 px-3 py-2 text-sm"
            placeholder="Participant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <PrimaryButton type="submit">Onboard</PrimaryButton>
        </form>
      </Panel>
      <DataTable
        columns={['Participant', 'Name', 'Jurisdiction', 'Role', 'Status', 'Link lock', 'Actions']}
        rows={items.map((p) => [
          <span key="id" className="font-mono text-xs">
            {p.participantId}
          </span>,
          p.name,
          p.jurisdiction ?? '—',
          p.gdprRole ?? '—',
          <StatusPill
            key="s"
            tone={
              p.onboardingStatus === 'attested'
                ? 'link'
                : p.onboardingStatus === 'revoked'
                  ? 'coral'
                  : 'amber'
            }
          >
            {p.onboardingStatus}
          </StatusPill>,
          p.linkAllocationLocked ? (
            <StatusPill key="l" tone="coral">
              locked
            </StatusPill>
          ) : (
            <StatusPill key="l" tone="link">
              open
            </StatusPill>
          ),
          p.onboardingStatus === 'pending' ? (
            <SecondaryButton
              key="a"
              type="button"
              onClick={() => attest(p.participantId)}
            >
              Attest
            </SecondaryButton>
          ) : (
            '—'
          ),
        ])}
        empty="Onboard the first consortium participant."
      />
    </div>
  );
}
