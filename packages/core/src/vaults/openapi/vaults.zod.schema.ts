import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const createIdentityVault_Body = z
  .object({
    consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
    pseudonymId: z.string().regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/),
    controllerParticipantId: z
      .string()
      .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
    jurisdiction: z.string().optional(),
    lawfulBasis: z.string().optional(),
  })
  .passthrough();
const flagVaultDuplicate_Body = z
  .object({
    reason: z.string().min(1).max(500),
    relatedVaultId: z
      .string()
      .regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
  })
  .passthrough();
const ConsortiumId = z.string();
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
const VaultId = z.string();
const PseudonymId = z.string();
const ParticipantId = z.string();
const IdentityVaultStatus = z.enum([
  'active',
  'erased',
  'orphan_review',
  'duplicate_review',
]);
const IdentityVault = z
  .object({
    vaultId: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
    consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
    pseudonymId: z
      .string()
      .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
    controllerParticipantId: z
      .string()
      .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
    jurisdiction: z.string().optional(),
    lawfulBasis: z.string().optional(),
    status: z.enum(['active', 'erased', 'orphan_review', 'duplicate_review']),
    bindStatus: z.enum(['unbound', 'bound', 'conflict']).optional(),
    activeGrantCount: z.number().int().gte(0).optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const IdentityVaultListData = z
  .object({
    items: z.array(
      z
        .object({
          vaultId: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
          consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
          pseudonymId: z
            .string()
            .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
            .optional(),
          controllerParticipantId: z
            .string()
            .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
            .optional(),
          jurisdiction: z.string().optional(),
          lawfulBasis: z.string().optional(),
          status: z.enum([
            'active',
            'erased',
            'orphan_review',
            'duplicate_review',
          ]),
          bindStatus: z.enum(['unbound', 'bound', 'conflict']).optional(),
          activeGrantCount: z.number().int().gte(0).optional(),
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
const IdentityVaultListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              vaultId: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
              consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
              pseudonymId: z
                .string()
                .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
                .optional(),
              controllerParticipantId: z
                .string()
                .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
                .optional(),
              jurisdiction: z.string().optional(),
              lawfulBasis: z.string().optional(),
              status: z.enum([
                'active',
                'erased',
                'orphan_review',
                'duplicate_review',
              ]),
              bindStatus: z.enum(['unbound', 'bound', 'conflict']).optional(),
              activeGrantCount: z.number().int().gte(0).optional(),
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
const IdentityVaultCreateRequest = z
  .object({
    consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
    pseudonymId: z.string().regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/),
    controllerParticipantId: z
      .string()
      .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
    jurisdiction: z.string().optional(),
    lawfulBasis: z.string().optional(),
  })
  .passthrough();
const IdentityVaultResponse = z
  .object({
    data: z
      .object({
        vaultId: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
        consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
        pseudonymId: z
          .string()
          .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
          .optional(),
        controllerParticipantId: z
          .string()
          .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
          .optional(),
        jurisdiction: z.string().optional(),
        lawfulBasis: z.string().optional(),
        status: z.enum([
          'active',
          'erased',
          'orphan_review',
          'duplicate_review',
        ]),
        bindStatus: z.enum(['unbound', 'bound', 'conflict']).optional(),
        activeGrantCount: z.number().int().gte(0).optional(),
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
const BindPseudonymRequest = z
  .object({ pseudonymId: z.string().regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/) })
  .passthrough();
const FlagDuplicateRequest = z
  .object({
    reason: z.string().min(1).max(500),
    relatedVaultId: z
      .string()
      .regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
  })
  .passthrough();

export const schemas: any = {
  createIdentityVault_Body,
  flagVaultDuplicate_Body,
  ConsortiumId,
  Problem,
  VaultId,
  PseudonymId,
  ParticipantId,
  IdentityVaultStatus,
  IdentityVault,
  IdentityVaultListData,
  ResponseMeta,
  IdentityVaultListResponse,
  IdentityVaultCreateRequest,
  IdentityVaultResponse,
  BindPseudonymRequest,
  FlagDuplicateRequest,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/vaults',
    alias: 'listIdentityVaults',
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
        name: 'consortiumId',
        type: 'Query',
        schema: z
          .string()
          .regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/)
          .optional(),
      },
      {
        name: 'status',
        type: 'Query',
        schema: z
          .enum(['active', 'erased', 'orphan_review', 'duplicate_review'])
          .optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  vaultId: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
                  consortiumId: z
                    .string()
                    .regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
                  pseudonymId: z
                    .string()
                    .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
                    .optional(),
                  controllerParticipantId: z
                    .string()
                    .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
                    .optional(),
                  jurisdiction: z.string().optional(),
                  lawfulBasis: z.string().optional(),
                  status: z.enum([
                    'active',
                    'erased',
                    'orphan_review',
                    'duplicate_review',
                  ]),
                  bindStatus: z
                    .enum(['unbound', 'bound', 'conflict'])
                    .optional(),
                  activeGrantCount: z.number().int().gte(0).optional(),
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
    path: '/v1/vaults',
    alias: 'createIdentityVault',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: createIdentityVault_Body,
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
            vaultId: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
            consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
            pseudonymId: z
              .string()
              .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
              .optional(),
            controllerParticipantId: z
              .string()
              .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
              .optional(),
            jurisdiction: z.string().optional(),
            lawfulBasis: z.string().optional(),
            status: z.enum([
              'active',
              'erased',
              'orphan_review',
              'duplicate_review',
            ]),
            bindStatus: z.enum(['unbound', 'bound', 'conflict']).optional(),
            activeGrantCount: z.number().int().gte(0).optional(),
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
      {
        status: 409,
        description: `Idempotency key reuse with different body, or state conflict`,
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
    path: '/v1/vaults/:vaultId',
    alias: 'getIdentityVault',
    requestFormat: 'json',
    parameters: [
      {
        name: 'vaultId',
        type: 'Path',
        schema: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            vaultId: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
            consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
            pseudonymId: z
              .string()
              .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
              .optional(),
            controllerParticipantId: z
              .string()
              .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
              .optional(),
            jurisdiction: z.string().optional(),
            lawfulBasis: z.string().optional(),
            status: z.enum([
              'active',
              'erased',
              'orphan_review',
              'duplicate_review',
            ]),
            bindStatus: z.enum(['unbound', 'bound', 'conflict']).optional(),
            activeGrantCount: z.number().int().gte(0).optional(),
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
    path: '/v1/vaults/:vaultId/bind-pseudonym',
    alias: 'bindVaultPseudonym',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z
          .object({
            pseudonymId: z.string().regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/),
          })
          .passthrough(),
      },
      {
        name: 'vaultId',
        type: 'Path',
        schema: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            vaultId: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
            consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
            pseudonymId: z
              .string()
              .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
              .optional(),
            controllerParticipantId: z
              .string()
              .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
              .optional(),
            jurisdiction: z.string().optional(),
            lawfulBasis: z.string().optional(),
            status: z.enum([
              'active',
              'erased',
              'orphan_review',
              'duplicate_review',
            ]),
            bindStatus: z.enum(['unbound', 'bound', 'conflict']).optional(),
            activeGrantCount: z.number().int().gte(0).optional(),
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
      {
        status: 409,
        description: `Idempotency key reuse with different body, or state conflict`,
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
    path: '/v1/vaults/:vaultId/flag-duplicate',
    alias: 'flagVaultDuplicate',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: flagVaultDuplicate_Body,
      },
      {
        name: 'vaultId',
        type: 'Path',
        schema: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            vaultId: z.string().regex(/^vlt_[0-9A-HJKMNP-TV-Z]{26}$/),
            consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
            pseudonymId: z
              .string()
              .regex(/^psn_[0-9A-HJKMNP-TV-Z]{26}$/)
              .optional(),
            controllerParticipantId: z
              .string()
              .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/)
              .optional(),
            jurisdiction: z.string().optional(),
            lawfulBasis: z.string().optional(),
            status: z.enum([
              'active',
              'erased',
              'orphan_review',
              'duplicate_review',
            ]),
            bindStatus: z.enum(['unbound', 'bound', 'conflict']).optional(),
            activeGrantCount: z.number().int().gte(0).optional(),
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
