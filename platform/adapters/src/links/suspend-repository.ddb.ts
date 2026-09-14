/**
 * SuspendRepository — in-memory sandbox implementation.
 */

import type { SuspendRepository } from '@aliaskeep/services/links';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  nowIso,
  notFound,
  str,
  grants,
  vaults,
} from '../_shared/product-sandbox-store.js';

export class SuspendRepositoryDdb implements SuspendRepository {
  constructor(private readonly dynamoClient: any) {}

  async suspendLinkGrant(
    input: Parameters<SuspendRepository['suspendLinkGrant']>[0],
  ): Promise<Awaited<ReturnType<SuspendRepository['suspendLinkGrant']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const grantId = str(raw, 'grantId');
    const record = grants.get(grantId);
    if (!record) return notFound();
    const wasActive = record.status === 'active';
    record.status = 'suspended';
    record.suspensionReason = str(raw, 'reason') || record.suspensionReason || 'suspended';
    grants.set(grantId, record);
    if (wasActive) {
      const vault = vaults.get(record.vaultId);
      if (vault && vault.activeGrantCount > 0) {
        vault.activeGrantCount -= 1;
        vault.updatedAt = nowIso();
        vaults.set(record.vaultId, vault);
      }
    }
    return envelopeOne(record, corr(raw));
  }
}
