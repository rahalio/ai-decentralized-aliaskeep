/**
 * DisclosureRepository — in-memory sandbox implementation.
 */

import type { DisclosureRepository } from '@aliaskeep/services/classification';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  getUploadDisclosure,
} from '../_shared/product-sandbox-store.js';

export class DisclosureRepositoryDdb implements DisclosureRepository {
  constructor(private readonly dynamoClient: any) {}

  async getUploadDisclosure(
    input: Parameters<DisclosureRepository['getUploadDisclosure']>[0],
  ): Promise<Awaited<ReturnType<DisclosureRepository['getUploadDisclosure']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    return envelopeOne({ ...getUploadDisclosure() }, corr(raw));
  }
}
