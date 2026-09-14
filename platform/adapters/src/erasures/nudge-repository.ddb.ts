/**
 * NudgeRepository — in-memory sandbox implementation.
 */

import type { NudgeRepository } from '@aliaskeep/services/erasures';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  erasures,
  nowIso,
  notFound,
  str,
  toPropagation,
} from '../_shared/product-sandbox-store.js';

export class NudgeRepositoryDdb implements NudgeRepository {
  constructor(private readonly dynamoClient: any) {}

  async nudgeErasurePropagation(
    input: Parameters<NudgeRepository['nudgeErasurePropagation']>[0],
  ): Promise<Awaited<ReturnType<NudgeRepository['nudgeErasurePropagation']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const erasureId = str(raw, 'erasureId');
    const record = erasures.get(erasureId);
    if (!record) return notFound();
    const participantId = str(raw, 'participantId');
    const now = nowIso();
    record.holders = record.holders.map((h) => {
      if (!participantId || h.participantId === participantId) {
        return { ...h, lastNudgedAt: now };
      }
      return h;
    });
    erasures.set(erasureId, record);
    return envelopeOne(toPropagation(record), corr(raw));
  }
}
