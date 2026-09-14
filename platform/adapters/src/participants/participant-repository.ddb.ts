/**
 * ParticipantRepository — in-memory sandbox implementation.
 */

import type { ParticipantRepository } from '@aliaskeep/services/participants';
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
  participants,
  type ParticipantRecord,
} from '../_shared/product-sandbox-store.js';

export class ParticipantRepositoryDdb implements ParticipantRepository {
  constructor(private readonly dynamoClient: any) {}

  async listParticipants(
    input: Parameters<ParticipantRepository['listParticipants']>[0],
  ): Promise<Awaited<ReturnType<ParticipantRepository['listParticipants']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const consortiumId = str(raw, 'consortiumId');
    const onboardingStatus = str(raw, 'onboardingStatus');
    let items = [...participants.values()];
    if (consortiumId) items = items.filter((p) => p.consortiumId === consortiumId);
    if (onboardingStatus) items = items.filter((p) => p.onboardingStatus === onboardingStatus);
    return envelopeList(items, corr(raw));
  }

  async onboardParticipant(
    input: Parameters<ParticipantRepository['onboardParticipant']>[0],
  ): Promise<Awaited<ReturnType<ParticipantRepository['onboardParticipant']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const now = nowIso();
    const participantId = pickId(raw, 'prt');
    const channelIds = Array.isArray(raw.channelIds)
      ? (raw.channelIds as string[])
      : undefined;
    const record: ParticipantRecord = {
      participantId,
      consortiumId: str(raw, 'consortiumId', DEMO.consortiumId),
      name: str(raw, 'name', 'Sandbox participant'),
      jurisdiction: str(raw, 'jurisdiction') || undefined,
      gdprRole: str(raw, 'gdprRole') || undefined,
      channelIds,
      fabricIdentityMode: str(raw, 'fabricIdentityMode') || 'not_configured',
      onboardingStatus: 'pending',
      linkAllocationLocked: true,
      createdAt: now,
    };
    participants.set(participantId, record);
    return envelopeOne(record, corr(raw));
  }

  async getParticipant(
    input: Parameters<ParticipantRepository['getParticipant']>[0],
  ): Promise<Awaited<ReturnType<ParticipantRepository['getParticipant']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const record = participants.get(str(raw, 'participantId'));
    if (!record) return notFound();
    return envelopeOne(record, corr(raw));
  }
}
