'use client';

import { useEffect, useState } from 'react';
import { apiFetch, idempotencyKey } from '@/lib/api';
import {
  DataTable,
  ErrorBox,
  PageHeader,
  SecondaryButton,
  StatusPill,
} from '@/components/ui';

type Profile = {
  profileId: string;
  participantId: string;
  riskLevel: string;
  recommendedPath: string;
  status: string;
};

export default function FabricPage() {
  const [items, setItems] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await apiFetch<{ data: { items: Profile[] } }>(
        '/v1/fabric/profiles'
      );
      setItems(res.data.items ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load Fabric profiles');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function requirePath(id: string) {
    try {
      await apiFetch(`/v1/fabric/profiles/${id}/require-path`, {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify({ requiredPath: 'identity_mixer' }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Require path failed');
    }
  }

  return (
    <div>
      <PageHeader
        title="Fabric identity advisory"
        subtitle="Flag X.509 attributes that embed PD; prefer Identity Mixer or scrubbed enrollment (BR-6)."
      />
      {error ? <ErrorBox message={error} /> : null}
      <DataTable
        columns={['Profile', 'Participant', 'Risk', 'Recommended', 'Status', 'Actions']}
        rows={items.map((p) => [
          <span key="id" className="font-mono text-xs">
            {p.profileId}
          </span>,
          <span key="p" className="font-mono text-xs">
            {p.participantId}
          </span>,
          <StatusPill
            key="r"
            tone={
              p.riskLevel === 'block'
                ? 'coral'
                : p.riskLevel === 'warn'
                  ? 'amber'
                  : 'link'
            }
          >
            {p.riskLevel}
          </StatusPill>,
          p.recommendedPath,
          p.status,
          p.status === 'open' ? (
            <SecondaryButton
              key="a"
              type="button"
              onClick={() => requirePath(p.profileId)}
            >
              Require Identity Mixer
            </SecondaryButton>
          ) : (
            '—'
          ),
        ])}
        empty="No Fabric org configured — hide advisory when empty."
      />
    </div>
  );
}
