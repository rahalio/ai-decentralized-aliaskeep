/**
 * RemediateRepository — in-memory sandbox implementation.
 */

import type { RemediateRepository } from '@aliaskeep/services/classification';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  nowIso,
  notFound,
  quarantine,
  str,
} from '../_shared/product-sandbox-store.js';

export class RemediateRepositoryDdb implements RemediateRepository {
  constructor(private readonly dynamoClient: any) {}

  async remediateQuarantineItem(
    input: Parameters<RemediateRepository['remediateQuarantineItem']>[0],
  ): Promise<Awaited<ReturnType<RemediateRepository['remediateQuarantineItem']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const quarantineId = str(raw, 'quarantineId');
    const record = quarantine.get(quarantineId);
    if (!record) return notFound();
    record.status = 'remediated';
    record.resolvedAt = nowIso();
    if (raw.note) record.waiverNote = str(raw, 'note');
    quarantine.set(quarantineId, record);
    return envelopeOne(record, corr(raw));
  }
}
