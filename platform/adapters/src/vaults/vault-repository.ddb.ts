/**
 * VaultRepository — in-memory sandbox implementation.
 */

import type { VaultRepository } from '@aliaskeep/services/vaults';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeList,
  envelopeOne,
  nowIso,
  notFound,
  pickId,
  str,
  vaults,
  type VaultRecord,
} from '../_shared/product-sandbox-store.js';

export class VaultRepositoryDdb implements VaultRepository {
  constructor(private readonly dynamoClient: any) {}

  async listIdentityVaults(
    input: Parameters<VaultRepository['listIdentityVaults']>[0],
  ): Promise<Awaited<ReturnType<VaultRepository['listIdentityVaults']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const consortiumId = str(raw, 'consortiumId');
    const status = str(raw, 'status');
    let items = [...vaults.values()];
    if (consortiumId) items = items.filter((v) => v.consortiumId === consortiumId);
    if (status) items = items.filter((v) => v.status === status);
    return envelopeList(items, corr(raw));
  }

  async createIdentityVault(
    input: Parameters<VaultRepository['createIdentityVault']>[0],
  ): Promise<Awaited<ReturnType<VaultRepository['createIdentityVault']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const now = nowIso();
    const vaultId = pickId(raw, 'vlt');
    const record: VaultRecord = {
      vaultId,
      consortiumId: str(raw, 'consortiumId'),
      pseudonymId: str(raw, 'pseudonymId') || undefined,
      controllerParticipantId: str(raw, 'controllerParticipantId') || undefined,
      jurisdiction: str(raw, 'jurisdiction') || undefined,
      lawfulBasis: str(raw, 'lawfulBasis') || undefined,
      status: 'active',
      bindStatus: str(raw, 'pseudonymId') ? 'bound' : 'unbound',
      activeGrantCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    vaults.set(vaultId, record);
    return envelopeOne(record, corr(raw));
  }

  async getIdentityVault(
    input: Parameters<VaultRepository['getIdentityVault']>[0],
  ): Promise<Awaited<ReturnType<VaultRepository['getIdentityVault']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const record = vaults.get(str(raw, 'vaultId'));
    if (!record) return notFound();
    return envelopeOne(record, corr(raw));
  }
}
