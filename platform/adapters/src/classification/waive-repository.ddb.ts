/**
 * WaiveRepository — in-memory sandbox implementation.
 */

import type { WaiveRepository } from '@aliaskeep/services/classification';
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

export class WaiveRepositoryDdb implements WaiveRepository {
  constructor(private readonly dynamoClient: any) {}

  async waiveQuarantineItem(
    input: Parameters<WaiveRepository['waiveQuarantineItem']>[0],
  ): Promise<Awaited<ReturnType<WaiveRepository['waiveQuarantineItem']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const quarantineId = str(raw, 'quarantineId');
    const record = quarantine.get(quarantineId);
    if (!record) return notFound();
    record.status = 'waived';
    record.waiverNote = str(raw, 'riskAcceptance') || str(raw, 'note') || record.waiverNote;
    record.resolvedAt = nowIso();
    quarantine.set(quarantineId, record);
    return envelopeOne(record, corr(raw));
  }
}
