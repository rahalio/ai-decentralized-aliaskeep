/**
 * JobRepository — in-memory sandbox implementation of ExportJobRepository.
 */

import type { ExportJobRepository } from '@aliaskeep/services/reporting';
import {
  asRecord,
  corr,
  ensureDemoSeed,
  envelopeList,
  envelopeOne,
  nowIso,
  notFound,
  pickId,
  reportJobs,
  str,
  type ReportJobRecord,
} from '../_shared/product-sandbox-store.js';

export class JobRepositoryDdb implements ExportJobRepository {
  constructor(private readonly dynamoClient: any) {}

  async listReportExportJobs(
    input: Parameters<ExportJobRepository['listReportExportJobs']>[0],
  ): Promise<Awaited<ReturnType<ExportJobRepository['listReportExportJobs']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    return envelopeList([...reportJobs.values()], corr(raw));
  }

  async createReportExportJob(
    input: Parameters<ExportJobRepository['createReportExportJob']>[0],
  ): Promise<Awaited<ReturnType<ExportJobRepository['createReportExportJob']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const now = nowIso();
    const jobId = pickId(raw, 'rpt');
    const packType = str(raw, 'packType', 'link_audit');
    const record: ReportJobRecord = {
      jobId,
      packType,
      status: 'done',
      downloadUrl: `https://sandbox.aliaskeep.local/exports/${jobId}.json`,
      createdAt: now,
      completedAt: now,
    };
    reportJobs.set(jobId, record);
    return envelopeOne(record, corr(raw));
  }

  async getReportExportJob(
    input: Parameters<ExportJobRepository['getReportExportJob']>[0],
  ): Promise<Awaited<ReturnType<ExportJobRepository['getReportExportJob']>>> {
    ensureDemoSeed();
    const raw = asRecord(input);
    const record = reportJobs.get(str(raw, 'jobId'));
    if (!record) return notFound();
    return envelopeOne(record, corr(raw));
  }
}
