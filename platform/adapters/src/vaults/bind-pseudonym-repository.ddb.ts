/**
 * BindPseudonymRepository — in-memory sandbox implementation.
 */

import type { BindPseudonymRepository } from '@aliaskeep/services/vaults';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  id,
  nowIso,
  notFound,
  str,
  vaults,
} from '../_shared/product-sandbox-store.js';

export class BindPseudonymRepositoryDdb implements BindPseudonymRepository {
  constructor(private readonly dynamoClient: any) {}

  async bindVaultPseudonym(
    input: Parameters<BindPseudonymRepository['bindVaultPseudonym']>[0],
  ): Promise<Awaited<ReturnType<BindPseudonymRepository['bindVaultPseudonym']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const vaultId = str(raw, 'vaultId');
    const record = vaults.get(vaultId);
    if (!record) return notFound();

    const pseudonymId = str(raw, 'pseudonymId') || id('psn');
    const conflict = [...vaults.values()].some(
      (v) => v.vaultId !== vaultId && v.pseudonymId === pseudonymId,
    );
    record.pseudonymId = pseudonymId;
    record.bindStatus = conflict ? 'conflict' : 'bound';
    record.updatedAt = nowIso();
    vaults.set(vaultId, record);
    return envelopeOne(record, corr(raw));
  }
}
