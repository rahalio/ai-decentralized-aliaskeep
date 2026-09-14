/**
 * ScanRepository — in-memory sandbox implementation.
 */

import type { ScanRepository } from '@aliaskeep/services/classification';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeOne,
  id,
  nowIso,
  pickId,
  quarantine,
  scans,
  str,
  type QuarantineRecord,
  type ScanRecord,
} from '../_shared/product-sandbox-store.js';

function looksSensitive(raw: Record<string, unknown>): boolean {
  const payloadType = str(raw, 'payloadType');
  const haystack = `${str(raw, 'fieldPath')} ${str(raw, 'proposalRef')} ${payloadType}`.toLowerCase();
  return (
    payloadType === 'pdf' ||
    payloadType === 'image' ||
    /email|name|iban|ssn|phone|passport|address/.test(haystack)
  );
}

export class ScanRepositoryDdb implements ScanRepository {
  constructor(private readonly dynamoClient: any) {}

  async submitClassificationScan(
    input: Parameters<ScanRepository['submitClassificationScan']>[0],
  ): Promise<Awaited<ReturnType<ScanRepository['submitClassificationScan']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const scanId = pickId(raw, 'cls');
    const sensitive = looksSensitive(raw);
    const quarantineId = sensitive ? id('qtn') : undefined;
    const record: ScanRecord = {
      scanId,
      decision: sensitive ? 'quarantine' : 'allow',
      confidence: sensitive ? 0.88 : 0.21,
      detectedCategories: sensitive ? ['personal_data'] : [],
      quarantineId,
    };
    scans.set(scanId, record);

    if (quarantineId) {
      const hold: QuarantineRecord = {
        quarantineId,
        scanId,
        status: 'held',
        confidence: record.confidence,
        channelId: str(raw, 'channelId') || undefined,
        fieldPath: str(raw, 'fieldPath') || undefined,
        detectedCategories: record.detectedCategories,
        redactedPreview: '[redacted sandbox preview]',
        createdAt: nowIso(),
      };
      quarantine.set(quarantineId, hold);
    }

    return envelopeOne(record, corr(raw));
  }
}
