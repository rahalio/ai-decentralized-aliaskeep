/**
 * PolicyRepository — in-memory sandbox implementation.
 */

import type { PolicyRepository } from '@aliaskeep/services/links';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeList,
  envelopeOne,
  nowIso,
  pickId,
  str,
  policies,
  type LinkPolicyRecord,
} from '../_shared/product-sandbox-store.js';

export class PolicyRepositoryDdb implements PolicyRepository {
  constructor(private readonly dynamoClient: any) {}

  async listLinkPolicies(
    input: Parameters<PolicyRepository['listLinkPolicies']>[0],
  ): Promise<Awaited<ReturnType<PolicyRepository['listLinkPolicies']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const consortiumId = str(raw, 'consortiumId');
    const approvalStatus = str(raw, 'approvalStatus');
    let items = [...policies.values()];
    if (consortiumId) items = items.filter((p) => p.consortiumId === consortiumId);
    if (approvalStatus) items = items.filter((p) => p.approvalStatus === approvalStatus);
    return envelopeList(items, corr(raw));
  }

  async createLinkPolicy(
    input: Parameters<PolicyRepository['createLinkPolicy']>[0],
  ): Promise<Awaited<ReturnType<PolicyRepository['createLinkPolicy']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const now = nowIso();
    const policyId = pickId(raw, 'pol');
    const submitToCounsel = raw.submitToCounsel !== false;
    const record: LinkPolicyRecord = {
      policyId,
      consortiumId: str(raw, 'consortiumId'),
      channelId: str(raw, 'channelId'),
      lawfulBasis: str(raw, 'lawfulBasis') || undefined,
      retentionIntent: str(raw, 'retentionIntent') || undefined,
      crossBorder: Boolean(raw.crossBorder),
      approvalStatus: submitToCounsel ? 'pending_counsel' : 'draft',
      createdAt: now,
    };
    policies.set(policyId, record);
    return envelopeOne(record, corr(raw));
  }
}
