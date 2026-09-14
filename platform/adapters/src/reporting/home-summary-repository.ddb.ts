/**
 * HomeSummaryRepository — in-memory sandbox implementation.
 */

import type { HomeSummaryRepository } from '@aliaskeep/services/reporting';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  erasures,
  fabricProfiles,
  grants,
  quarantine,
  vaults,
} from '../_shared/product-sandbox-store.js';

export class HomeSummaryRepositoryDdb implements HomeSummaryRepository {
  constructor(private readonly dynamoClient: any) {}

  async getArchitectHomeSummary(
    input: Parameters<HomeSummaryRepository['getArchitectHomeSummary']>[0],
  ): Promise<Awaited<ReturnType<HomeSummaryRepository['getArchitectHomeSummary']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const liveLinkCount = [...grants.values()].filter((g) => g.status === 'active').length;
    const vaultCount = vaults.size;
    const erasureInFlight = [...erasures.values()].filter(
      (e) => e.status === 'queued' || e.status === 'in_progress',
    ).length;
    const erasureSlaAtRisk = [...erasures.values()].filter(
      (e) => e.status === 'sla_breach',
    ).length;
    const quarantineBacklog = [...quarantine.values()].filter((q) => q.status === 'held').length;
    const fabricRiskOpen = [...fabricProfiles.values()].filter(
      (p) => p.status === 'open' || p.status === 'path_required',
    ).length;

    const alerts: Array<{ severity: 'info' | 'amber' | 'coral'; message: string; href?: string }> =
      [];
    if (quarantineBacklog > 0) {
      alerts.push({
        severity: 'amber',
        message: `${quarantineBacklog} quarantine hold(s) awaiting review`,
        href: '/quarantine',
      });
    }
    if (erasureSlaAtRisk > 0) {
      alerts.push({
        severity: 'coral',
        message: `${erasureSlaAtRisk} erasure SLA breach(es)`,
        href: '/erasures',
      });
    }
    if (fabricRiskOpen > 0) {
      alerts.push({
        severity: 'info',
        message: `${fabricRiskOpen} Fabric identity profile(s) still open`,
        href: '/fabric',
      });
    }

    return envelopeOne(
      {
        liveLinkCount,
        vaultCount,
        erasureInFlight,
        erasureSlaAtRisk,
        quarantineBacklog,
        fabricRiskOpen,
        alerts,
      },
      corr(raw),
    );
  }
}
