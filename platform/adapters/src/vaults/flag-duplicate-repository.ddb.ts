/**
 * FlagDuplicateRepository — in-memory sandbox implementation.
 */

import type { FlagDuplicateRepository } from '@aliaskeep/services/vaults';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  nowIso,
  notFound,
  str,
  vaults,
} from '../_shared/product-sandbox-store.js';

export class FlagDuplicateRepositoryDdb implements FlagDuplicateRepository {
  constructor(private readonly dynamoClient: any) {}

  async flagVaultDuplicate(
    input: Parameters<FlagDuplicateRepository['flagVaultDuplicate']>[0],
  ): Promise<Awaited<ReturnType<FlagDuplicateRepository['flagVaultDuplicate']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const vaultId = str(raw, 'vaultId');
    const record = vaults.get(vaultId);
    if (!record) return notFound();

    record.status = str(raw, 'relatedVaultId') ? 'duplicate_review' : 'orphan_review';
    record.updatedAt = nowIso();
    vaults.set(vaultId, record);
    return envelopeOne(record, corr(raw));
  }
}
