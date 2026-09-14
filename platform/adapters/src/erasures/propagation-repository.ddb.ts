/**
 * PropagationRepository — in-memory sandbox implementation.
 */

import type { PropagationRepository } from '@aliaskeep/services/erasures';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  erasures,
  notFound,
  str,
  toPropagation,
} from '../_shared/product-sandbox-store.js';

export class PropagationRepositoryDdb implements PropagationRepository {
  constructor(private readonly dynamoClient: any) {}

  async getErasurePropagation(
    input: Parameters<PropagationRepository['getErasurePropagation']>[0],
  ): Promise<Awaited<ReturnType<PropagationRepository['getErasurePropagation']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const record = erasures.get(str(raw, 'erasureId'));
    if (!record) return notFound();
    return envelopeOne(toPropagation(record), corr(raw));
  }
}
