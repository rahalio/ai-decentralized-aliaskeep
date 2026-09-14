'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import {
  DataTable,
  ErrorBox,
  PageHeader,
  Panel,
  StatusPill,
} from '@/components/ui';

type Disclosure = {
  version: string;
  published: boolean;
  fields: Array<{
    fieldPath: string;
    storageMode: string;
    endUserDisclosure?: string;
  }>;
  publishedAt?: string;
};

export default function DisclosurePage() {
  const [data, setData] = useState<Disclosure | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ data: Disclosure }>('/v1/classification/disclosure')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <PageHeader
        title="Upload storage disclosure"
        subtitle="Document how files and free text are stored relative to the chain (BR-11)."
      />
      {error ? <ErrorBox message={error} /> : null}
      {data ? (
        <Panel className="mb-4 flex items-center gap-3 text-sm">
          <span className="font-mono text-xs">v{data.version}</span>
          <StatusPill tone={data.published ? 'link' : 'amber'}>
            {data.published ? 'published' : 'draft'}
          </StatusPill>
          {data.publishedAt ? (
            <span className="text-graphite">{data.publishedAt}</span>
          ) : null}
        </Panel>
      ) : null}
      <DataTable
        columns={['Field path', 'Storage mode', 'End-user disclosure']}
        rows={(data?.fields ?? []).map((f) => [
          <span key="p" className="font-mono text-xs">
            {f.fieldPath}
          </span>,
          <StatusPill
            key="m"
            tone={
              f.storageMode === 'blocked'
                ? 'coral'
                : f.storageMode === 'hash_only'
                  ? 'amber'
                  : 'link'
            }
          >
            {f.storageMode}
          </StatusPill>,
          f.endUserDisclosure ?? '—',
        ])}
        empty="Undocumented fields block enabling the write path."
      />
    </div>
  );
}
