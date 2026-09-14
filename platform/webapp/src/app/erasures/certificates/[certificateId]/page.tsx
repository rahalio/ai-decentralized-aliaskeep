'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { ErrorBox, PageHeader, Panel, StatusPill } from '@/components/ui';

type Cert = {
  certificateId: string;
  vaultId: string;
  pseudonymId?: string;
  anonymisedAt: string;
  proofHash: string;
  recreationBlocked?: boolean;
};

export default function CertificatePage() {
  const params = useParams<{ certificateId: string }>();
  const [cert, setCert] = useState<Cert | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.certificateId) return;
    apiFetch<{ data: Cert }>(
      `/v1/erasure-certificates/${params.certificateId}`
    )
      .then((r) => setCert(r.data))
      .catch((e) => setError(e.message));
  }, [params.certificateId]);

  return (
    <div>
      <PageHeader
        title="Broken-seal certificate"
        subtitle="Anonymisation proof — destroyed links cannot be unilaterally recreated (BR-12)."
      />
      {error ? <ErrorBox message={error} /> : null}
      {cert ? (
        <Panel className="max-w-xl">
          <div className="mb-4 flex items-center gap-2">
            <StatusPill tone="seal">Anonymised</StatusPill>
            {cert.recreationBlocked ? (
              <StatusPill tone="coral">Recreation blocked</StatusPill>
            ) : null}
          </div>
          <dl className="space-y-2 font-mono text-xs">
            <div>
              <dt className="text-graphite">Certificate</dt>
              <dd className="text-brand">{cert.certificateId}</dd>
            </div>
            <div>
              <dt className="text-graphite">Vault</dt>
              <dd>{cert.vaultId}</dd>
            </div>
            <div>
              <dt className="text-graphite">Pseudonym</dt>
              <dd>{cert.pseudonymId ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-graphite">Anonymised at</dt>
              <dd>{cert.anonymisedAt}</dd>
            </div>
            <div>
              <dt className="text-graphite">Proof hash</dt>
              <dd className="break-all text-seal">{cert.proofHash}</dd>
            </div>
          </dl>
        </Panel>
      ) : null}
    </div>
  );
}
