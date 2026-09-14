/**
 * QuarantineRepository — in-memory sandbox implementation.
 */

import type { QuarantineRepository } from '@aliaskeep/services/classification';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeList,
  envelopeOne,
  notFound,
  quarantine,
  str,
} from '../_shared/product-sandbox-store.js';

export class QuarantineRepositoryDdb implements QuarantineRepository {
  constructor(private readonly dynamoClient: any) {}

  async listQuarantineItems(
    input: Parameters<QuarantineRepository['listQuarantineItems']>[0],
  ): Promise<Awaited<ReturnType<QuarantineRepository['listQuarantineItems']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const status = str(raw, 'status');
    let items = [...quarantine.values()];
    if (status) items = items.filter((q) => q.status === status);
    return envelopeList(items, corr(raw));
  }

  async getQuarantineItem(
    input: Parameters<QuarantineRepository['getQuarantineItem']>[0],
  ): Promise<Awaited<ReturnType<QuarantineRepository['getQuarantineItem']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const record = quarantine.get(str(raw, 'quarantineId'));
    if (!record) return notFound();
    return envelopeOne(record, corr(raw));
  }
}
