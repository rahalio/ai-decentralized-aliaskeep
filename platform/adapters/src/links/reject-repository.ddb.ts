/**
 * RejectRepository — in-memory sandbox implementation.
 */

import type { RejectRepository } from '@aliaskeep/services/links';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  nowIso,
  notFound,
  str,
  policies,
} from '../_shared/product-sandbox-store.js';

export class RejectRepositoryDdb implements RejectRepository {
  constructor(private readonly dynamoClient: any) {}

  async rejectLinkPolicy(
    input: Parameters<RejectRepository['rejectLinkPolicy']>[0],
  ): Promise<Awaited<ReturnType<RejectRepository['rejectLinkPolicy']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const policyId = str(raw, 'policyId');
    const record = policies.get(policyId);
    if (!record) return notFound();
    record.approvalStatus = 'rejected';
    record.counselNote = str(raw, 'note') || record.counselNote;
    record.decidedAt = nowIso();
    policies.set(policyId, record);
    return envelopeOne(record, corr(raw));
  }
}
