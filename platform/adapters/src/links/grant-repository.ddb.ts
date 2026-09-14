/**
 * GrantRepository — in-memory sandbox implementation.
 */

import type { GrantRepository } from '@aliaskeep/services/links';
import {
  asRecord,
  corr,
  DEMO,
  ensureDemoSeed,
  envelopeList,
  envelopeOne,
  nowIso,
  notFound,
  pickId,
  str,
  grants,
  vaults,
  type LinkGrantRecord,
} from '../_shared/product-sandbox-store.js';

export class GrantRepositoryDdb implements GrantRepository {
  constructor(private readonly dynamoClient: any) {}

  async listLinkGrants(
    input: Parameters<GrantRepository['listLinkGrants']>[0],
  ): Promise<Awaited<ReturnType<GrantRepository['listLinkGrants']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const vaultId = str(raw, 'vaultId');
    const status = str(raw, 'status');
    const pseudonymId = str(raw, 'pseudonymId');
    let items = [...grants.values()];
    if (vaultId) items = items.filter((g) => g.vaultId === vaultId);
    if (status) items = items.filter((g) => g.status === status);
    if (pseudonymId) {
      const matchingVaults = new Set(
        [...vaults.values()]
          .filter((v) => v.pseudonymId === pseudonymId)
          .map((v) => v.vaultId),
      );
      items = items.filter((g) => matchingVaults.has(g.vaultId));
    }
    return envelopeList(items, corr(raw));
  }

  async allocateLinkGrant(
    input: Parameters<GrantRepository['allocateLinkGrant']>[0],
  ): Promise<Awaited<ReturnType<GrantRepository['allocateLinkGrant']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const now = nowIso();
    const grantId = pickId(raw, 'lnk');
    const vaultId = str(raw, 'vaultId', DEMO.vaultId);
    const record: LinkGrantRecord = {
      grantId,
      vaultId,
      participantId: str(raw, 'participantId', DEMO.participantId),
      channelId: str(raw, 'channelId', 'trade-finance'),
      policyId: str(raw, 'policyId', DEMO.policyId) || undefined,
      lawfulBasis: str(raw, 'lawfulBasis', 'contract'),
      retentionIntent: str(raw, 'retentionIntent') || undefined,
      status: 'active',
      createdAt: now,
    };
    grants.set(grantId, record);
    const vault = vaults.get(vaultId);
    if (vault) {
      vault.activeGrantCount += 1;
      vault.updatedAt = now;
      vaults.set(vaultId, vault);
    }
    return envelopeOne(record, corr(raw));
  }

  async getLinkGrant(
    input: Parameters<GrantRepository['getLinkGrant']>[0],
  ): Promise<Awaited<ReturnType<GrantRepository['getLinkGrant']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const record = grants.get(str(raw, 'grantId'));
    if (!record) return notFound();
    return envelopeOne(record, corr(raw));
  }
}
