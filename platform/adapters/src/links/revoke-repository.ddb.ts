/**
 * RevokeRepository — in-memory sandbox implementation.
 */

import type { RevokeRepository } from '@aliaskeep/services/links';
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

export class RevokeRepositoryDdb implements RevokeRepository {
  constructor(private readonly dynamoClient: any) {}

  async revokeLinkGrant(
    input: Parameters<RevokeRepository['revokeLinkGrant']>[0],
  ): Promise<Awaited<ReturnType<RevokeRepository['revokeLinkGrant']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const grantId = str(raw, 'grantId');
    const record = grants.get(grantId);
    if (!record) return notFound();
    const wasActive = record.status === 'active';
    record.status = 'revoked';
    record.revokedAt = nowIso();
    grants.set(grantId, record);
    if (wasActive) {
      const vault = vaults.get(record.vaultId);
      if (vault && vault.activeGrantCount > 0) {
        vault.activeGrantCount -= 1;
        vault.updatedAt = record.revokedAt;
        vaults.set(record.vaultId, vault);
      }
    }
    return envelopeOne(record, corr(raw));
  }
}
