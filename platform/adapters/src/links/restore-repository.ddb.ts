/**
 * RestoreRepository — in-memory sandbox implementation.
 */

import type { RestoreRepository } from '@aliaskeep/services/links';
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

export class RestoreRepositoryDdb implements RestoreRepository {
  constructor(private readonly dynamoClient: any) {}

  async restoreLinkGrant(
    input: Parameters<RestoreRepository['restoreLinkGrant']>[0],
  ): Promise<Awaited<ReturnType<RestoreRepository['restoreLinkGrant']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const grantId = str(raw, 'grantId');
    const record = grants.get(grantId);
    if (!record) return notFound();
    const wasActive = record.status === 'active';
    record.status = 'active';
    record.suspensionReason = undefined;
    grants.set(grantId, record);
    if (!wasActive) {
      const vault = vaults.get(record.vaultId);
      if (vault) {
        vault.activeGrantCount += 1;
        vault.updatedAt = nowIso();
        vaults.set(record.vaultId, vault);
      }
    }
    return envelopeOne(record, corr(raw));
  }
}
