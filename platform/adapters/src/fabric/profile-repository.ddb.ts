/**
 * ProfileRepository — in-memory sandbox implementation.
 */

import type { ProfileRepository } from '@aliaskeep/services/fabric';
import {
  asRecord,
  corr,
  DEMO,
  ensureDemoSeed,
  envelopeList,
  envelopeOne,
  fabricProfiles,
  nowIso,
  notFound,
  pickId,
  str,
  type FabricProfileRecord,
} from '../_shared/product-sandbox-store.js';

function assessAttributes(raw: Record<string, unknown>): FabricProfileRecord['attributes'] {
  const attrs = Array.isArray(raw.attributes) ? raw.attributes : [];
  return attrs.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const attributeName = String(row.attributeName ?? '');
    const lower = attributeName.toLowerCase();
    if (/iban|ssn|passport|email/.test(lower)) {
      return { attributeName, riskLevel: 'block', reason: 'Attribute likely encodes personal data.' };
    }
    if (/cn|name|serial/.test(lower)) {
      return { attributeName, riskLevel: 'warn', reason: 'Attribute may encode a natural person.' };
    }
    return { attributeName, riskLevel: 'clear' };
  });
}

export class ProfileRepositoryDdb implements ProfileRepository {
  constructor(private readonly dynamoClient: any) {}

  async listFabricIdentityProfiles(
    input: Parameters<ProfileRepository['listFabricIdentityProfiles']>[0],
  ): Promise<Awaited<ReturnType<ProfileRepository['listFabricIdentityProfiles']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const riskLevel = str(raw, 'riskLevel');
    let items = [...fabricProfiles.values()];
    if (riskLevel) items = items.filter((p) => p.riskLevel === riskLevel);
    return envelopeList(items, corr(raw));
  }

  async submitFabricEnrollmentScan(
    input: Parameters<ProfileRepository['submitFabricEnrollmentScan']>[0],
  ): Promise<Awaited<ReturnType<ProfileRepository['submitFabricEnrollmentScan']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const now = nowIso();
    const profileId = pickId(raw, 'fab');
    const attributes = assessAttributes(raw);
    const riskLevel = attributes.some((a) => a.riskLevel === 'block')
      ? 'block'
      : attributes.some((a) => a.riskLevel === 'warn')
        ? 'warn'
        : 'clear';
    const recommendedPath =
      riskLevel === 'block'
        ? 'blocked'
        : riskLevel === 'warn'
          ? 'x509_scrubbed'
          : 'identity_mixer';
    const record: FabricProfileRecord = {
      profileId,
      participantId: str(raw, 'participantId', DEMO.participantId),
      mspId: str(raw, 'mspId') || undefined,
      riskLevel,
      recommendedPath,
      attributes,
      status: riskLevel === 'clear' ? 'cleared' : riskLevel === 'block' ? 'blocked' : 'open',
      createdAt: now,
      updatedAt: now,
    };
    fabricProfiles.set(profileId, record);
    return envelopeOne(record, corr(raw));
  }

  async getFabricIdentityProfile(
    input: Parameters<ProfileRepository['getFabricIdentityProfile']>[0],
  ): Promise<Awaited<ReturnType<ProfileRepository['getFabricIdentityProfile']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const record = fabricProfiles.get(str(raw, 'profileId'));
    if (!record) return notFound();
    return envelopeOne(record, corr(raw));
  }
}
