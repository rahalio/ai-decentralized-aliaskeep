/**
 * RequirePathRepository — in-memory sandbox implementation.
 */

import type { RequirePathRepository } from '@aliaskeep/services/fabric';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  fabricProfiles,
  nowIso,
  notFound,
  str,
} from '../_shared/product-sandbox-store.js';

export class RequirePathRepositoryDdb implements RequirePathRepository {
  constructor(private readonly dynamoClient: any) {}

  async requireFabricIdentityPath(
    input: Parameters<RequirePathRepository['requireFabricIdentityPath']>[0],
  ): Promise<Awaited<ReturnType<RequirePathRepository['requireFabricIdentityPath']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const profileId = str(raw, 'profileId');
    const record = fabricProfiles.get(profileId);
    if (!record) return notFound();
    const requiredPath = str(raw, 'requiredPath', record.recommendedPath) as FabricPath;
    record.recommendedPath = requiredPath;
    record.status =
      requiredPath === 'blocked'
        ? 'blocked'
        : requiredPath === 'identity_mixer' || requiredPath === 'x509_scrubbed'
          ? 'path_required'
          : record.status;
    record.updatedAt = nowIso();
    fabricProfiles.set(profileId, record);
    return envelopeOne(record, corr(raw));
  }
}

type FabricPath = 'x509_scrubbed' | 'identity_mixer' | 'blocked';
