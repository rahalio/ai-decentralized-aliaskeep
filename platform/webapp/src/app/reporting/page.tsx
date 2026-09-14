'use client';

import { useEffect, useState } from 'react';
import { apiFetch, idempotencyKey } from '@/lib/api';
import {
  DataTable,
  ErrorBox,
  PageHeader,
  Panel,
  PrimaryButton,
  StatusPill,
} from '@/components/ui';

type Audit = {
  period: string;
  activeGrants: number;
  erasuresCompleted: number;
  quarantinedScans: number;
  suspendedGrants?: number;
};

type Job = {
  jobId: string;
  packType: string;
  status: string;
  downloadUrl?: string;
};

export default function ReportingPage() {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const [a, j] = await Promise.all([
        apiFetch<{ data: Audit }>('/v1/reports/link-audit?period=last_30d'),
        apiFetch<{ data: { items: Job[] } }>('/v1/reports/export-jobs'),
      ]);
      setAudit(a.data);
      setJobs(j.data.items ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reporting');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createJob() {
    try {
      await apiFetch('/v1/reports/export-jobs', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey() },
        body: JSON.stringify({ packType: 'counsel_pack', period: 'last_30d' }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    }
  }

  return (
    <div>
      <PageHeader
        title="Reporting and regulatory export"
        subtitle="Link history, access events, and erasure certificates for GRC (BR-8)."
        actions={
          <PrimaryButton type="button" onClick={createJob}>
            Generate counsel pack
          </PrimaryButton>
        }
      />
      {error ? <ErrorBox message={error} /> : null}
      {audit ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {[
            ['Period', audit.period],
            ['Active grants', String(audit.activeGrants)],
            ['Erasures', String(audit.erasuresCompleted)],
            ['Quarantined', String(audit.quarantinedScans)],
          ].map(([k, v]) => (
            <Panel key={k}>
              <div className="text-xs text-graphite">{k}</div>
              <div className="mt-1 font-display text-xl">{v}</div>
            </Panel>
          ))}
        </div>
      ) : null}
      <DataTable
        columns={['Job', 'Pack', 'Status', 'Download']}
        rows={jobs.map((j) => [
          <span key="id" className="font-mono text-xs">
            {j.jobId}
          </span>,
          j.packType,
          <StatusPill
            key="s"
            tone={j.status === 'done' ? 'link' : j.status === 'failed' ? 'coral' : 'amber'}
          >
            {j.status}
          </StatusPill>,
          j.downloadUrl ? (
            <a key="d" href={j.downloadUrl} className="text-link">
              Open
            </a>
          ) : (
            '—'
          ),
        ])}
        empty="No export jobs yet."
      />
    </div>
  );
}
