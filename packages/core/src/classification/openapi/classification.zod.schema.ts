import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const submitClassificationScan_Body = z
  .object({
    proposalRef: z.string(),
    payloadType: z.enum(['json', 'text', 'pdf', 'image']),
    contentBase64: z.string().optional(),
    channelId: z.string().min(1).max(128).optional(),
    fieldPath: z.string().optional(),
  })
  .passthrough();
const waiveQuarantineItem_Body = z
  .object({
    riskAcceptance: z.string().min(10).max(2000),
    note: z.string().optional(),
  })
  .passthrough();
const publishUploadDisclosure_Body = z
  .object({
    version: z.string(),
    fields: z.array(
      z
        .object({
          fieldPath: z.string(),
          storageMode: z.enum(['off_chain_vault', 'hash_only', 'blocked']),
          endUserDisclosure: z.string().optional(),
        })
        .passthrough()
    ),
    requireAdapterAck: z.boolean().optional().default(true),
  })
  .passthrough();
const ChannelId = z.string();
const ClassificationScanRequest = z
  .object({
    proposalRef: z.string(),
    payloadType: z.enum(['json', 'text', 'pdf', 'image']),
    contentBase64: z.string().optional(),
    channelId: z.string().min(1).max(128).optional(),
    fieldPath: z.string().optional(),
  })
  .passthrough();
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
const ScanId = z.string();
const ClassificationDecision = z.enum(['allow', 'quarantine', 'block']);
const QuarantineId = z.string();
const ClassificationScan = z
  .object({
    scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
    decision: z.enum(['allow', 'quarantine', 'block']),
    confidence: z.number().gte(0).lte(1).optional(),
    detectedCategories: z.array(z.string()).optional(),
    quarantineId: z
      .string()
      .regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
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
const ClassificationScanResponse = z
  .object({
    data: z
      .object({
        scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
        decision: z.enum(['allow', 'quarantine', 'block']),
        confidence: z.number().gte(0).lte(1).optional(),
        detectedCategories: z.array(z.string()).optional(),
        quarantineId: z
          .string()
          .regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/)
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
const QuarantineStatus = z.enum(['held', 'remediated', 'waived', 'rejected']);
const QuarantineItem = z
  .object({
    quarantineId: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
    scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
    status: z.enum(['held', 'remediated', 'waived', 'rejected']),
    confidence: z.number(),
    channelId: z.string().min(1).max(128).optional(),
    fieldPath: z.string().optional(),
    detectedCategories: z.array(z.string()).optional(),
    redactedPreview: z.string().optional(),
    waiverNote: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    resolvedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const QuarantineListData = z
  .object({
    items: z.array(
      z
        .object({
          quarantineId: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
          scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
          status: z.enum(['held', 'remediated', 'waived', 'rejected']),
          confidence: z.number(),
          channelId: z.string().min(1).max(128).optional(),
          fieldPath: z.string().optional(),
          detectedCategories: z.array(z.string()).optional(),
          redactedPreview: z.string().optional(),
          waiverNote: z.string().optional(),
          createdAt: z.string().datetime({ offset: true }),
          resolvedAt: z.string().datetime({ offset: true }).optional(),
        })
        .passthrough()
    ),
    nextCursor: z.string().optional(),
  })
  .passthrough();
const QuarantineListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              quarantineId: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
              scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
              status: z.enum(['held', 'remediated', 'waived', 'rejected']),
              confidence: z.number(),
              channelId: z.string().min(1).max(128).optional(),
              fieldPath: z.string().optional(),
              detectedCategories: z.array(z.string()).optional(),
              redactedPreview: z.string().optional(),
              waiverNote: z.string().optional(),
              createdAt: z.string().datetime({ offset: true }),
              resolvedAt: z.string().datetime({ offset: true }).optional(),
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
const QuarantineItemResponse = z
  .object({
    data: z
      .object({
        quarantineId: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
        scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
        status: z.enum(['held', 'remediated', 'waived', 'rejected']),
        confidence: z.number(),
        channelId: z.string().min(1).max(128).optional(),
        fieldPath: z.string().optional(),
        detectedCategories: z.array(z.string()).optional(),
        redactedPreview: z.string().optional(),
        waiverNote: z.string().optional(),
        createdAt: z.string().datetime({ offset: true }),
        resolvedAt: z.string().datetime({ offset: true }).optional(),
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
const QuarantineActionRequest = z
  .object({ note: z.string() })
  .partial()
  .passthrough();
const RiskWaiverRequest = z
  .object({
    riskAcceptance: z.string().min(10).max(2000),
    note: z.string().optional(),
  })
  .passthrough();
const StorageMode = z.enum(['off_chain_vault', 'hash_only', 'blocked']);
const DisclosureField = z
  .object({
    fieldPath: z.string(),
    storageMode: z.enum(['off_chain_vault', 'hash_only', 'blocked']),
    endUserDisclosure: z.string().optional(),
  })
  .passthrough();
const UploadDisclosure = z
  .object({
    version: z.string(),
    published: z.boolean(),
    fields: z.array(
      z
        .object({
          fieldPath: z.string(),
          storageMode: z.enum(['off_chain_vault', 'hash_only', 'blocked']),
          endUserDisclosure: z.string().optional(),
        })
        .passthrough()
    ),
    publishedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const UploadDisclosureResponse = z
  .object({
    data: z
      .object({
        version: z.string(),
        published: z.boolean(),
        fields: z.array(
          z
            .object({
              fieldPath: z.string(),
              storageMode: z.enum(['off_chain_vault', 'hash_only', 'blocked']),
              endUserDisclosure: z.string().optional(),
            })
            .passthrough()
        ),
        publishedAt: z.string().datetime({ offset: true }).optional(),
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
const UploadDisclosurePublishRequest = z
  .object({
    version: z.string(),
    fields: z.array(
      z
        .object({
          fieldPath: z.string(),
          storageMode: z.enum(['off_chain_vault', 'hash_only', 'blocked']),
          endUserDisclosure: z.string().optional(),
        })
        .passthrough()
    ),
    requireAdapterAck: z.boolean().optional().default(true),
  })
  .passthrough();

export const schemas: any = {
  submitClassificationScan_Body,
  waiveQuarantineItem_Body,
  publishUploadDisclosure_Body,
  ChannelId,
  ClassificationScanRequest,
  Problem,
  ScanId,
  ClassificationDecision,
  QuarantineId,
  ClassificationScan,
  ResponseMeta,
  ClassificationScanResponse,
  QuarantineStatus,
  QuarantineItem,
  QuarantineListData,
  QuarantineListResponse,
  QuarantineItemResponse,
  QuarantineActionRequest,
  RiskWaiverRequest,
  StorageMode,
  DisclosureField,
  UploadDisclosure,
  UploadDisclosureResponse,
  UploadDisclosurePublishRequest,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/classification/disclosure',
    alias: 'getUploadDisclosure',
    requestFormat: 'json',
    response: z
      .object({
        data: z
          .object({
            version: z.string(),
            published: z.boolean(),
            fields: z.array(
              z
                .object({
                  fieldPath: z.string(),
                  storageMode: z.enum([
                    'off_chain_vault',
                    'hash_only',
                    'blocked',
                  ]),
                  endUserDisclosure: z.string().optional(),
                })
                .passthrough()
            ),
            publishedAt: z.string().datetime({ offset: true }).optional(),
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
    method: 'put',
    path: '/v1/classification/disclosure',
    alias: 'publishUploadDisclosure',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: publishUploadDisclosure_Body,
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
            version: z.string(),
            published: z.boolean(),
            fields: z.array(
              z
                .object({
                  fieldPath: z.string(),
                  storageMode: z.enum([
                    'off_chain_vault',
                    'hash_only',
                    'blocked',
                  ]),
                  endUserDisclosure: z.string().optional(),
                })
                .passthrough()
            ),
            publishedAt: z.string().datetime({ offset: true }).optional(),
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
    path: '/v1/classification/quarantine',
    alias: 'listQuarantineItems',
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
      {
        name: 'status',
        type: 'Query',
        schema: z.enum(['held', 'remediated', 'waived', 'rejected']).optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  quarantineId: z
                    .string()
                    .regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
                  scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
                  status: z.enum(['held', 'remediated', 'waived', 'rejected']),
                  confidence: z.number(),
                  channelId: z.string().min(1).max(128).optional(),
                  fieldPath: z.string().optional(),
                  detectedCategories: z.array(z.string()).optional(),
                  redactedPreview: z.string().optional(),
                  waiverNote: z.string().optional(),
                  createdAt: z.string().datetime({ offset: true }),
                  resolvedAt: z.string().datetime({ offset: true }).optional(),
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
    method: 'get',
    path: '/v1/classification/quarantine/:quarantineId',
    alias: 'getQuarantineItem',
    requestFormat: 'json',
    parameters: [
      {
        name: 'quarantineId',
        type: 'Path',
        schema: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            quarantineId: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
            scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
            status: z.enum(['held', 'remediated', 'waived', 'rejected']),
            confidence: z.number(),
            channelId: z.string().min(1).max(128).optional(),
            fieldPath: z.string().optional(),
            detectedCategories: z.array(z.string()).optional(),
            redactedPreview: z.string().optional(),
            waiverNote: z.string().optional(),
            createdAt: z.string().datetime({ offset: true }),
            resolvedAt: z.string().datetime({ offset: true }).optional(),
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
    method: 'post',
    path: '/v1/classification/quarantine/:quarantineId/reject',
    alias: 'rejectQuarantineItem',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z
          .object({ note: z.string() })
          .partial()
          .passthrough()
          .optional(),
      },
      {
        name: 'quarantineId',
        type: 'Path',
        schema: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            quarantineId: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
            scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
            status: z.enum(['held', 'remediated', 'waived', 'rejected']),
            confidence: z.number(),
            channelId: z.string().min(1).max(128).optional(),
            fieldPath: z.string().optional(),
            detectedCategories: z.array(z.string()).optional(),
            redactedPreview: z.string().optional(),
            waiverNote: z.string().optional(),
            createdAt: z.string().datetime({ offset: true }),
            resolvedAt: z.string().datetime({ offset: true }).optional(),
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
    method: 'post',
    path: '/v1/classification/quarantine/:quarantineId/remediate',
    alias: 'remediateQuarantineItem',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z
          .object({ note: z.string() })
          .partial()
          .passthrough()
          .optional(),
      },
      {
        name: 'quarantineId',
        type: 'Path',
        schema: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            quarantineId: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
            scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
            status: z.enum(['held', 'remediated', 'waived', 'rejected']),
            confidence: z.number(),
            channelId: z.string().min(1).max(128).optional(),
            fieldPath: z.string().optional(),
            detectedCategories: z.array(z.string()).optional(),
            redactedPreview: z.string().optional(),
            waiverNote: z.string().optional(),
            createdAt: z.string().datetime({ offset: true }),
            resolvedAt: z.string().datetime({ offset: true }).optional(),
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
    method: 'post',
    path: '/v1/classification/quarantine/:quarantineId/waive',
    alias: 'waiveQuarantineItem',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: waiveQuarantineItem_Body,
      },
      {
        name: 'quarantineId',
        type: 'Path',
        schema: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            quarantineId: z.string().regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/),
            scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
            status: z.enum(['held', 'remediated', 'waived', 'rejected']),
            confidence: z.number(),
            channelId: z.string().min(1).max(128).optional(),
            fieldPath: z.string().optional(),
            detectedCategories: z.array(z.string()).optional(),
            redactedPreview: z.string().optional(),
            waiverNote: z.string().optional(),
            createdAt: z.string().datetime({ offset: true }),
            resolvedAt: z.string().datetime({ offset: true }).optional(),
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
    method: 'post',
    path: '/v1/classification/scans',
    alias: 'submitClassificationScan',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: submitClassificationScan_Body,
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
            scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
            decision: z.enum(['allow', 'quarantine', 'block']),
            confidence: z.number().gte(0).lte(1).optional(),
            detectedCategories: z.array(z.string()).optional(),
            quarantineId: z
              .string()
              .regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/)
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
      {
        status: 422,
        description: `PD detected; quarantine required`,
        schema: z
          .object({
            data: z
              .object({
                scanId: z.string().regex(/^cls_[0-9A-HJKMNP-TV-Z]{26}$/),
                decision: z.enum(['allow', 'quarantine', 'block']),
                confidence: z.number().gte(0).lte(1).optional(),
                detectedCategories: z.array(z.string()).optional(),
                quarantineId: z
                  .string()
                  .regex(/^qtn_[0-9A-HJKMNP-TV-Z]{26}$/)
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
