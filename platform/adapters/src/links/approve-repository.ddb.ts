/**
 * ApproveRepository — in-memory sandbox implementation.
 */

import type { ApproveRepository } from '@aliaskeep/services/links';
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

export class ApproveRepositoryDdb implements ApproveRepository {
  constructor(private readonly dynamoClient: any) {}

  async approveLinkPolicy(
    input: Parameters<ApproveRepository['approveLinkPolicy']>[0],
  ): Promise<Awaited<ReturnType<ApproveRepository['approveLinkPolicy']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const policyId = str(raw, 'policyId');
    const record = policies.get(policyId);
    if (!record) return notFound();
    record.approvalStatus = 'approved';
    record.counselNote = str(raw, 'note') || record.counselNote;
    record.decidedAt = nowIso();
    policies.set(policyId, record);
    return envelopeOne(record, corr(raw));
  }
}
