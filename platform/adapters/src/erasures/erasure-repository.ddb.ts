/**
 * ErasureRepository — in-memory sandbox implementation.
 */

import type { ErasureRepository } from '@aliaskeep/services/erasures';
import {
  asRecord,
  certificates,
  corr,
  ensureDemoSeed,
  envelopeList,
  envelopeOne,
  grants,
  id,
  nowIso,
  notFound,
  pickId,
  str,
  erasures,
  vaults,
  type CertificateRecord,
  type ErasureRecord,
} from '../_shared/product-sandbox-store.js';

export class ErasureRepositoryDdb implements ErasureRepository {
  constructor(private readonly dynamoClient: any) {}

  async listLogicalErasures(
    input: Parameters<ErasureRepository['listLogicalErasures']>[0],
  ): Promise<Awaited<ReturnType<ErasureRepository['listLogicalErasures']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const status = str(raw, 'status');
    let items = [...erasures.values()];
    if (status) items = items.filter((e) => e.status === status);
    return envelopeList(items, corr(raw));
  }

  async executeLogicalErasure(
    input: Parameters<ErasureRepository['executeLogicalErasure']>[0],
  ): Promise<Awaited<ReturnType<ErasureRepository['executeLogicalErasure']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const now = nowIso();
    const vaultId = str(raw, 'vaultId');
    const vault = vaults.get(vaultId);
    const erasureId = pickId(raw, 'ers');
    const certificateId = id('crt');
    const sla = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const holders = [...grants.values()]
      .filter((g) => g.vaultId === vaultId)
      .map((g) => ({
        participantId: g.participantId,
        status: 'acknowledged' as const,
        acknowledgedAt: now,
      }));
    if (holders.length === 0 && vault?.controllerParticipantId) {
      holders.push({
        participantId: vault.controllerParticipantId,
        status: 'acknowledged',
        acknowledgedAt: now,
      });
    }

    const record: ErasureRecord = {
      erasureId,
      vaultId,
      pseudonymId: vault?.pseudonymId,
      certificateId,
      status: 'completed',
      erasureReason: str(raw, 'erasureReason', 'logical erasure'),
      holders,
      slaDeadlineAt: sla,
      createdAt: now,
      completedAt: now,
    };
    erasures.set(erasureId, record);

    const cert: CertificateRecord = {
      certificateId,
      erasureId,
      vaultId,
      pseudonymId: vault?.pseudonymId,
      anonymisedAt: now,
      proofHash: `sha256:sandbox:${erasureId}`,
      recreationBlocked: true,
    };
    certificates.set(certificateId, cert);

    if (vault) {
      vault.status = 'erased';
      vault.activeGrantCount = 0;
      vault.updatedAt = now;
      vaults.set(vaultId, vault);
    }
    for (const grant of grants.values()) {
      if (grant.vaultId === vaultId && grant.status !== 'revoked') {
        grant.status = 'revoked';
        grant.revokedAt = now;
        grants.set(grant.grantId, grant);
      }
    }

    return envelopeOne(record, corr(raw));
  }

  async getLogicalErasure(
    input: Parameters<ErasureRepository['getLogicalErasure']>[0],
  ): Promise<Awaited<ReturnType<ErasureRepository['getLogicalErasure']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const record = erasures.get(str(raw, 'erasureId'));
    if (!record) return notFound();
    return envelopeOne(record, corr(raw));
  }
}
