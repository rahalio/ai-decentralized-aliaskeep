/**
 * RevokeRepository — in-memory sandbox implementation.
 */

import type { RevokeRepository } from '@aliaskeep/services/participants';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  notFound,
  str,
  participants,
} from '../_shared/product-sandbox-store.js';

export class RevokeRepositoryDdb implements RevokeRepository {
  constructor(private readonly dynamoClient: any) {}

  async revokeParticipant(
    input: Parameters<RevokeRepository['revokeParticipant']>[0],
  ): Promise<Awaited<ReturnType<RevokeRepository['revokeParticipant']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const participantId = str(raw, 'participantId');
    const record = participants.get(participantId);
    if (!record) return notFound();
    record.onboardingStatus = 'revoked';
    record.linkAllocationLocked = true;
    participants.set(participantId, record);
    return envelopeOne(record, corr(raw));
  }
}
