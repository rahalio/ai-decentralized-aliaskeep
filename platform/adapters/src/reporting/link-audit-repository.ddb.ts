/**
 * LinkAuditRepository — in-memory sandbox implementation.
 */

import type { LinkAuditRepository } from '@aliaskeep/services/reporting';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  erasures,
  grants,
  quarantine,
  str,
} from '../_shared/product-sandbox-store.js';

export class LinkAuditRepositoryDdb implements LinkAuditRepository {
  constructor(private readonly dynamoClient: any) {}

  async getLinkAuditReport(
    input: Parameters<LinkAuditRepository['getLinkAuditReport']>[0],
  ): Promise<Awaited<ReturnType<LinkAuditRepository['getLinkAuditReport']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    return envelopeOne(
      {
        period: str(raw, 'period', 'current'),
        activeGrants: [...grants.values()].filter((g) => g.status === 'active').length,
        erasuresCompleted: [...erasures.values()].filter((e) => e.status === 'completed').length,
        quarantinedScans: [...quarantine.values()].length,
        suspendedGrants: [...grants.values()].filter((g) => g.status === 'suspended').length,
        recreationAttemptsBlocked: [...erasures.values()].filter((e) =>
          e.holders.some((h) => h.status === 'recreation_blocked'),
        ).length,
      },
      corr(raw),
    );
  }
}
