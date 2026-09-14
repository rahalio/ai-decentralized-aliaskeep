/**
 * AttestRepository — in-memory sandbox implementation.
 */

import type { AttestRepository } from '@aliaskeep/services/participants';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  nowIso,
  notFound,
  str,
  participants,
} from '../_shared/product-sandbox-store.js';

export class AttestRepositoryDdb implements AttestRepository {
  constructor(private readonly dynamoClient: any) {}

  async attestParticipant(
    input: Parameters<AttestRepository['attestParticipant']>[0],
  ): Promise<Awaited<ReturnType<AttestRepository['attestParticipant']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const participantId = str(raw, 'participantId');
    const record = participants.get(participantId);
    if (!record) return notFound();
    if (raw.jurisdiction) record.jurisdiction = str(raw, 'jurisdiction');
    if (raw.gdprRole) record.gdprRole = str(raw, 'gdprRole');
    if (Array.isArray(raw.channelIds)) record.channelIds = raw.channelIds as string[];
    record.onboardingStatus = 'attested';
    record.linkAllocationLocked = false;
    record.attestedAt = nowIso();
    participants.set(participantId, record);
    return envelopeOne(record, corr(raw));
  }
}
