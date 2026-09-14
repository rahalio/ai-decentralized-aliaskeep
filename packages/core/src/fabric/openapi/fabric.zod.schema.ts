import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const submitFabricEnrollmentScan_Body = z
  .object({
    participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
    mspId: z.string().optional(),
    attributes: z.array(
      z
        .object({ attributeName: z.string(), valueHint: z.string() })
        .passthrough()
    ),
  })
  .passthrough();
const requireFabricIdentityPath_Body = z
  .object({
    requiredPath: z.enum(['x509_scrubbed', 'identity_mixer', 'blocked']),
    note: z.string().optional(),
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
const FabricProfileId = z.string();
const ParticipantId = z.string();
const FabricRiskLevel = z.enum(['clear', 'warn', 'block']);
const RecommendedPath = z.enum(['x509_scrubbed', 'identity_mixer', 'blocked']);
const AttributeRisk = z
  .object({
    attributeName: z.string(),
    riskLevel: z.enum(['clear', 'warn', 'block']),
    reason: z.string().optional(),
  })
  .passthrough();
const FabricIdentityProfile = z
  .object({
    profileId: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
    participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
    mspId: z.string().optional(),
    riskLevel: z.enum(['clear', 'warn', 'block']),
    recommendedPath: z.enum(['x509_scrubbed', 'identity_mixer', 'blocked']),
    attributes: z
      .array(
        z
          .object({
            attributeName: z.string(),
            riskLevel: z.enum(['clear', 'warn', 'block']),
            reason: z.string().optional(),
          })
          .passthrough()
      )
      .optional(),
    status: z.enum(['open', 'path_required', 'cleared', 'blocked']),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const FabricProfileListData = z
  .object({
    items: z.array(
      z
        .object({
          profileId: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
          participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
          mspId: z.string().optional(),
          riskLevel: z.enum(['clear', 'warn', 'block']),
          recommendedPath: z.enum([
            'x509_scrubbed',
            'identity_mixer',
            'blocked',
          ]),
          attributes: z
            .array(
              z
                .object({
                  attributeName: z.string(),
                  riskLevel: z.enum(['clear', 'warn', 'block']),
                  reason: z.string().optional(),
                })
                .passthrough()
            )
            .optional(),
          status: z.enum(['open', 'path_required', 'cleared', 'blocked']),
          createdAt: z.string().datetime({ offset: true }),
          updatedAt: z.string().datetime({ offset: true }).optional(),
        })
        .passthrough()
    ),
    nextCursor: z.string().optional(),
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
const FabricProfileListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              profileId: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
              participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
              mspId: z.string().optional(),
              riskLevel: z.enum(['clear', 'warn', 'block']),
              recommendedPath: z.enum([
                'x509_scrubbed',
                'identity_mixer',
                'blocked',
              ]),
              attributes: z
                .array(
                  z
                    .object({
                      attributeName: z.string(),
                      riskLevel: z.enum(['clear', 'warn', 'block']),
                      reason: z.string().optional(),
                    })
                    .passthrough()
                )
                .optional(),
              status: z.enum(['open', 'path_required', 'cleared', 'blocked']),
              createdAt: z.string().datetime({ offset: true }),
              updatedAt: z.string().datetime({ offset: true }).optional(),
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
const FabricEnrollmentScanRequest = z
  .object({
    participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
    mspId: z.string().optional(),
    attributes: z.array(
      z
        .object({ attributeName: z.string(), valueHint: z.string() })
        .passthrough()
    ),
  })
  .passthrough();
const FabricProfileResponse = z
  .object({
    data: z
      .object({
        profileId: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
        participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
        mspId: z.string().optional(),
        riskLevel: z.enum(['clear', 'warn', 'block']),
        recommendedPath: z.enum(['x509_scrubbed', 'identity_mixer', 'blocked']),
        attributes: z
          .array(
            z
              .object({
                attributeName: z.string(),
                riskLevel: z.enum(['clear', 'warn', 'block']),
                reason: z.string().optional(),
              })
              .passthrough()
          )
          .optional(),
        status: z.enum(['open', 'path_required', 'cleared', 'blocked']),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }).optional(),
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
const RequireFabricPathRequest = z
  .object({
    requiredPath: z.enum(['x509_scrubbed', 'identity_mixer', 'blocked']),
    note: z.string().optional(),
  })
  .passthrough();

export const schemas: any = {
  submitFabricEnrollmentScan_Body,
  requireFabricIdentityPath_Body,
  Problem,
  FabricProfileId,
  ParticipantId,
  FabricRiskLevel,
  RecommendedPath,
  AttributeRisk,
  FabricIdentityProfile,
  FabricProfileListData,
  ResponseMeta,
  FabricProfileListResponse,
  FabricEnrollmentScanRequest,
  FabricProfileResponse,
  RequireFabricPathRequest,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/fabric/profiles',
    alias: 'listFabricIdentityProfiles',
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
        name: 'riskLevel',
        type: 'Query',
        schema: z.enum(['clear', 'warn', 'block']).optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  profileId: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
                  participantId: z
                    .string()
                    .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
                  mspId: z.string().optional(),
                  riskLevel: z.enum(['clear', 'warn', 'block']),
                  recommendedPath: z.enum([
                    'x509_scrubbed',
                    'identity_mixer',
                    'blocked',
                  ]),
                  attributes: z
                    .array(
                      z
                        .object({
                          attributeName: z.string(),
                          riskLevel: z.enum(['clear', 'warn', 'block']),
                          reason: z.string().optional(),
                        })
                        .passthrough()
                    )
                    .optional(),
                  status: z.enum([
                    'open',
                    'path_required',
                    'cleared',
                    'blocked',
                  ]),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }).optional(),
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
    path: '/v1/fabric/profiles',
    alias: 'submitFabricEnrollmentScan',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: submitFabricEnrollmentScan_Body,
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
            profileId: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
            participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
            mspId: z.string().optional(),
            riskLevel: z.enum(['clear', 'warn', 'block']),
            recommendedPath: z.enum([
              'x509_scrubbed',
              'identity_mixer',
              'blocked',
            ]),
            attributes: z
              .array(
                z
                  .object({
                    attributeName: z.string(),
                    riskLevel: z.enum(['clear', 'warn', 'block']),
                    reason: z.string().optional(),
                  })
                  .passthrough()
              )
              .optional(),
            status: z.enum(['open', 'path_required', 'cleared', 'blocked']),
            createdAt: z.string().datetime({ offset: true }),
            updatedAt: z.string().datetime({ offset: true }).optional(),
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
    path: '/v1/fabric/profiles/:profileId',
    alias: 'getFabricIdentityProfile',
    requestFormat: 'json',
    parameters: [
      {
        name: 'profileId',
        type: 'Path',
        schema: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            profileId: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
            participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
            mspId: z.string().optional(),
            riskLevel: z.enum(['clear', 'warn', 'block']),
            recommendedPath: z.enum([
              'x509_scrubbed',
              'identity_mixer',
              'blocked',
            ]),
            attributes: z
              .array(
                z
                  .object({
                    attributeName: z.string(),
                    riskLevel: z.enum(['clear', 'warn', 'block']),
                    reason: z.string().optional(),
                  })
                  .passthrough()
              )
              .optional(),
            status: z.enum(['open', 'path_required', 'cleared', 'blocked']),
            createdAt: z.string().datetime({ offset: true }),
            updatedAt: z.string().datetime({ offset: true }).optional(),
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
    path: '/v1/fabric/profiles/:profileId/require-path',
    alias: 'requireFabricIdentityPath',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: requireFabricIdentityPath_Body,
      },
      {
        name: 'profileId',
        type: 'Path',
        schema: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            profileId: z.string().regex(/^fab_[0-9A-HJKMNP-TV-Z]{26}$/),
            participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
            mspId: z.string().optional(),
            riskLevel: z.enum(['clear', 'warn', 'block']),
            recommendedPath: z.enum([
              'x509_scrubbed',
              'identity_mixer',
              'blocked',
            ]),
            attributes: z
              .array(
                z
                  .object({
                    attributeName: z.string(),
                    riskLevel: z.enum(['clear', 'warn', 'block']),
                    reason: z.string().optional(),
                  })
                  .passthrough()
              )
              .optional(),
            status: z.enum(['open', 'path_required', 'cleared', 'blocked']),
            createdAt: z.string().datetime({ offset: true }),
            updatedAt: z.string().datetime({ offset: true }).optional(),
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
]);

export const api: any = new Zodios(
  'https://api.ddd-codegen-starter.local/v1',
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions): any {
  return new Zodios(baseUrl, endpoints, options);
}
