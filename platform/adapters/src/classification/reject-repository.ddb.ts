/**
 * RejectRepository — in-memory sandbox implementation.
 */

import type { RejectRepository } from '@aliaskeep/services/classification';
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

export class RejectRepositoryDdb implements RejectRepository {
  constructor(private readonly dynamoClient: any) {}

  async rejectQuarantineItem(
    input: Parameters<RejectRepository['rejectQuarantineItem']>[0],
  ): Promise<Awaited<ReturnType<RejectRepository['rejectQuarantineItem']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const quarantineId = str(raw, 'quarantineId');
    const record = quarantine.get(quarantineId);
    if (!record) return notFound();
    record.status = 'rejected';
    record.waiverNote = str(raw, 'note') || record.waiverNote;
    record.resolvedAt = nowIso();
    quarantine.set(quarantineId, record);
    return envelopeOne(record, corr(raw));
  }
}
