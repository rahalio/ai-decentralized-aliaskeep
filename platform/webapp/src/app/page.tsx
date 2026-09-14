'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import {
  DataTable,
  ErrorBox,
  PageHeader,
  Panel,
  StatusPill,
} from '@/components/ui';

type HomeSummary = {
  data: {
    liveLinkCount: number;
    vaultCount: number;
    erasureInFlight: number;
    erasureSlaAtRisk?: number;
    quarantineBacklog: number;
    fabricRiskOpen: number;
    alerts?: Array<{ severity: string; message: string; href?: string }>;
  };
};

export default function HomePage() {
  const [data, setData] = useState<HomeSummary['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<HomeSummary>('/v1/reports/home-summary')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message));
  }, []);

  const kpis = data
    ? [
        ['Live links', data.liveLinkCount, 'link'],
        ['Vaults', data.vaultCount, 'graphite'],
        ['Erasures in flight', data.erasureInFlight, 'amber'],
        ['SLA at risk', data.erasureSlaAtRisk ?? 0, 'coral'],
        ['Quarantine backlog', data.quarantineBacklog, 'amber'],
        ['Fabric risk open', data.fabricRiskOpen, 'coral'],
      ] as const
    : [];

  return (
    <div>
      <PageHeader
        title="Privacy architect home"
        subtitle="Are links governed, and is erasure SLA at risk?"
        actions={
          <Link
            href="/reporting"
            className="rounded-md border border-link/40 px-3 py-2 text-sm text-link"
          >
            Export counsel pack
          </Link>
        }
      />
      {error ? <ErrorBox message={error} /> : null}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map(([label, value, tone]) => (
          <Panel key={label}>
            <div className="text-xs uppercase tracking-wide text-graphite">
              {label}
            </div>
            <div className="mt-2 font-display text-3xl text-ink">{value}</div>
            <div className="mt-2">
              <StatusPill tone={tone as 'link' | 'amber' | 'coral' | 'graphite'}>
                {tone === 'link' ? 'live' : tone}
              </StatusPill>
            </div>
          </Panel>
        ))}
      </div>
      <Panel>
        <h2 className="mb-3 text-sm font-medium text-ink">Alerts</h2>
        <DataTable
          columns={['Severity', 'Message', 'Action']}
          rows={(data?.alerts ?? []).map((a) => [
            <StatusPill
              key="s"
              tone={
                a.severity === 'coral'
                  ? 'coral'
                  : a.severity === 'amber'
                    ? 'amber'
                    : 'graphite'
              }
            >
              {a.severity}
            </StatusPill>,
            a.message,
            a.href ? (
              <Link href={a.href} className="text-link">
                Open
              </Link>
            ) : (
              '—'
            ),
          ])}
          empty="No open alerts — consortium healthy."
        />
      </Panel>
    </div>
  );
}
