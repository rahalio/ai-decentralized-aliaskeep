import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const createReportExportJob_Body = z
  .object({
    packType: z.enum(['counsel_pack', 'link_audit', 'erasure_certificates']),
    period: z.string().optional(),
    consortiumId: z
      .string()
      .regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
    pseudonymId: z
      .string()
      .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
  })
  .passthrough();
const ConsortiumId = z.string();
const PseudonymId = z.string();
const Problem = z
  .object({
    type: z.string().url(),
    title: z.string(),
    status: z.number().int(),
    detail: z.string(),
    instance: z.string().url(),
    code: z.string(),
  })
  .partial()
  .passthrough();
const LinkAuditReport = z
  .object({
    period: z.string(),
    activeGrants: z.number().int().gte(0),
    erasuresCompleted: z.number().int().gte(0),
    quarantinedScans: z.number().int().gte(0),
    suspendedGrants: z.number().int().gte(0).optional(),
    recreationAttemptsBlocked: z.number().int().gte(0).optional(),
  })
  .passthrough();
const ResponseMeta = z
  .object({
    requestId: z.string().uuid(),
    correlationId: z.string(),
    generatedAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const LinkAuditReportResponse = z
  .object({
    data: z
      .object({
        period: z.string(),
        activeGrants: z.number().int().gte(0),
        erasuresCompleted: z.number().int().gte(0),
        quarantinedScans: z.number().int().gte(0),
        suspendedGrants: z.number().int().gte(0).optional(),
        recreationAttemptsBlocked: z.number().int().gte(0).optional(),
      })
      .passthrough(),
    meta: z
      .object({
        requestId: z.string().uuid(),
        correlationId: z.string(),
        generatedAt: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const ReportJobId = z.string();
const JobStatus = z.enum(['queued', 'running', 'done', 'failed']);
const ReportJob = z
  .object({
    jobId: z.string().regex(/^rpt_[0-9A-HJKMNP-TV-Z]{26}$/),
    packType: z.string(),
    status: z.enum(['queued', 'running', 'done', 'failed']),
    downloadUrl: z.string().url().optional(),
    errorMessage: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    completedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const ReportJobListData = z
  .object({
    items: z.array(
      z
        .object({
          jobId: z.string().regex(/^rpt_[0-9A-HJKMNP-TV-Z]{26}$/),
          packType: z.string(),
          status: z.enum(['queued', 'running', 'done', 'failed']),
          downloadUrl: z.string().url().optional(),
          errorMessage: z.string().optional(),
          createdAt: z.string().datetime({ offset: true }),
          completedAt: z.string().datetime({ offset: true }).optional(),
        })
        .passthrough()
    ),
    nextCursor: z.string().optional(),
  })
  .passthrough();
const ReportJobListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              jobId: z.string().regex(/^rpt_[0-9A-HJKMNP-TV-Z]{26}$/),
              packType: z.string(),
              status: z.enum(['queued', 'running', 'done', 'failed']),
              downloadUrl: z.string().url().optional(),
              errorMessage: z.string().optional(),
              createdAt: z.string().datetime({ offset: true }),
              completedAt: z.string().datetime({ offset: true }).optional(),
            })
            .passthrough()
        ),
        nextCursor: z.string().optional(),
      })
      .passthrough(),
    meta: z
      .object({
        requestId: z.string().uuid(),
        correlationId: z.string(),
        generatedAt: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const ReportExportCreateRequest = z
  .object({
    packType: z.enum(['counsel_pack', 'link_audit', 'erasure_certificates']),
    period: z.string().optional(),
    consortiumId: z
      .string()
      .regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
    pseudonymId: z
      .string()
      .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
  })
  .passthrough();
const ReportJobResponse = z
  .object({
    data: z
      .object({
        jobId: z.string().regex(/^rpt_[0-9A-HJKMNP-TV-Z]{26}$/),
        packType: z.string(),
        status: z.enum(['queued', 'running', 'done', 'failed']),
        downloadUrl: z.string().url().optional(),
        errorMessage: z.string().optional(),
        createdAt: z.string().datetime({ offset: true }),
        completedAt: z.string().datetime({ offset: true }).optional(),
      })
      .passthrough(),
    meta: z
      .object({
        requestId: z.string().uuid(),
        correlationId: z.string(),
        generatedAt: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const ArchitectHomeSummary = z
  .object({
    liveLinkCount: z.number().int(),
    vaultCount: z.number().int(),
    erasureInFlight: z.number().int(),
    erasureSlaAtRisk: z.number().int().optional(),
    quarantineBacklog: z.number().int(),
    fabricRiskOpen: z.number().int(),
    alerts: z
      .array(
        z
          .object({
            severity: z.enum(['info', 'amber', 'coral']),
            message: z.string(),
            href: z.string().optional(),
          })
          .passthrough()
      )
      .optional(),
  })
  .passthrough();
const ArchitectHomeSummaryResponse = z
  .object({
    data: z
      .object({
        liveLinkCount: z.number().int(),
        vaultCount: z.number().int(),
        erasureInFlight: z.number().int(),
        erasureSlaAtRisk: z.number().int().optional(),
        quarantineBacklog: z.number().int(),
        fabricRiskOpen: z.number().int(),
        alerts: z
          .array(
            z
              .object({
                severity: z.enum(['info', 'amber', 'coral']),
                message: z.string(),
                href: z.string().optional(),
              })
              .passthrough()
          )
          .optional(),
      })
      .passthrough(),
    meta: z
      .object({
        requestId: z.string().uuid(),
        correlationId: z.string(),
        generatedAt: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();

export const schemas: any = {
  createReportExportJob_Body,
  ConsortiumId,
  PseudonymId,
  Problem,
  LinkAuditReport,
  ResponseMeta,
  LinkAuditReportResponse,
  ReportJobId,
  JobStatus,
  ReportJob,
  ReportJobListData,
  ReportJobListResponse,
  ReportExportCreateRequest,
  ReportJobResponse,
  ArchitectHomeSummary,
  ArchitectHomeSummaryResponse,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/reports/export-jobs',
    alias: 'listReportExportJobs',
    requestFormat: 'json',
    parameters: [
      {
        name: 'cursor',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(200).optional().default(50),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  jobId: z.string().regex(/^rpt_[0-9A-HJKMNP-TV-Z]{26}$/),
                  packType: z.string(),
                  status: z.enum(['queued', 'running', 'done', 'failed']),
                  downloadUrl: z.string().url().optional(),
                  errorMessage: z.string().optional(),
                  createdAt: z.string().datetime({ offset: true }),
                  completedAt: z.string().datetime({ offset: true }).optional(),
                })
                .passthrough()
            ),
            nextCursor: z.string().optional(),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/reports/export-jobs',
    alias: 'createReportExportJob',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: createReportExportJob_Body,
      },
      {
        name: 'Idempotency-Key',
        type: 'Header',
        schema: z.string().min(1).max(128),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            jobId: z.string().regex(/^rpt_[0-9A-HJKMNP-TV-Z]{26}$/),
            packType: z.string(),
            status: z.enum(['queued', 'running', 'done', 'failed']),
            downloadUrl: z.string().url().optional(),
            errorMessage: z.string().optional(),
            createdAt: z.string().datetime({ offset: true }),
            completedAt: z.string().datetime({ offset: true }).optional(),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Malformed request`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/reports/export-jobs/:jobId',
    alias: 'getReportExportJob',
    requestFormat: 'json',
    parameters: [
      {
        name: 'jobId',
        type: 'Path',
        schema: z.string().regex(/^rpt_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            jobId: z.string().regex(/^rpt_[0-9A-HJKMNP-TV-Z]{26}$/),
            packType: z.string(),
            status: z.enum(['queued', 'running', 'done', 'failed']),
            downloadUrl: z.string().url().optional(),
            errorMessage: z.string().optional(),
            createdAt: z.string().datetime({ offset: true }),
            completedAt: z.string().datetime({ offset: true }).optional(),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/reports/home-summary',
    alias: 'getArchitectHomeSummary',
    requestFormat: 'json',
    parameters: [
      {
        name: 'consortiumId',
        type: 'Query',
        schema: z
          .string()
          .regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/)
          .optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            liveLinkCount: z.number().int(),
            vaultCount: z.number().int(),
            erasureInFlight: z.number().int(),
            erasureSlaAtRisk: z.number().int().optional(),
            quarantineBacklog: z.number().int(),
            fabricRiskOpen: z.number().int(),
            alerts: z
              .array(
                z
                  .object({
                    severity: z.enum(['info', 'amber', 'coral']),
                    message: z.string(),
                    href: z.string().optional(),
                  })
                  .passthrough()
              )
              .optional(),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/reports/link-audit',
    alias: 'getLinkAuditReport',
    requestFormat: 'json',
    parameters: [
      {
        name: 'period',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'consortiumId',
        type: 'Query',
        schema: z
          .string()
          .regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/)
          .optional(),
      },
      {
        name: 'pseudonymId',
        type: 'Query',
        schema: z
          .string()
          .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
          .optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            period: z.string(),
            activeGrants: z.number().int().gte(0),
            erasuresCompleted: z.number().int().gte(0),
            quarantinedScans: z.number().int().gte(0),
            suspendedGrants: z.number().int().gte(0).optional(),
            recreationAttemptsBlocked: z.number().int().gte(0).optional(),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
]);

export const api: any = new Zodios(
  'https://api.ddd-codegen-starter.local/v1',
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions): any {
  return new Zodios(baseUrl, endpoints, options);
}
