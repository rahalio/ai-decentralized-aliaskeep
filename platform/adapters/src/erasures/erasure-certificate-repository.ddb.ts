/**
 * ErasureCertificateRepository — in-memory sandbox implementation.
 */

import type { ErasureCertificateRepository } from '@aliaskeep/services/erasures';
import {
  asRecord,
  certificates,
  corr,
  ensureDemoSeed,
  envelopeOne,
  notFound,
  str,
} from '../_shared/product-sandbox-store.js';

export class ErasureCertificateRepositoryDdb implements ErasureCertificateRepository {
  constructor(private readonly dynamoClient: any) {}

  async getErasureCertificate(
    input: Parameters<ErasureCertificateRepository['getErasureCertificate']>[0],
  ): Promise<Awaited<ReturnType<ErasureCertificateRepository['getErasureCertificate']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const record = certificates.get(str(raw, 'certificateId'));
    if (!record) return notFound();
    return envelopeOne(record, corr(raw));
  }
}
