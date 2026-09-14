import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const onboardParticipant_Body = z
  .object({
    consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
    name: z.string().min(1).max(200),
    jurisdiction: z.string(),
    gdprRole: z.enum(['controller', 'processor', 'joint_controller']),
    channelIds: z.array(z.string().min(1).max(128)).optional(),
    fabricIdentityMode: z
      .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
      .optional(),
  })
  .passthrough();
const attestParticipant_Body = z
  .object({
    jurisdiction: z.string(),
    gdprRole: z.enum(['controller', 'processor', 'joint_controller']),
    channelIds: z.array(z.string().min(1).max(128)).optional(),
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
const ParticipantId = z.string();
const GdprRole = z.enum(['controller', 'processor', 'joint_controller']);
const ChannelId = z.string();
const FabricIdentityMode = z.enum([
  'x509_scrubbed',
  'identity_mixer',
  'not_configured',
]);
const OnboardingStatus = z.enum(['pending', 'attested', 'revoked']);
const Participant = z
  .object({
    participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
    consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
    name: z.string(),
    jurisdiction: z.string().optional(),
    gdprRole: z
      .enum(['controller', 'processor', 'joint_controller'])
      .optional(),
    channelIds: z.array(z.string().min(1).max(128)).optional(),
    fabricIdentityMode: z
      .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
      .optional(),
    onboardingStatus: z.enum(['pending', 'attested', 'revoked']),
    linkAllocationLocked: z.boolean().optional(),
    attestedAt: z.string().datetime({ offset: true }).optional(),
    createdAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const ParticipantListData = z
  .object({
    items: z.array(
      z
        .object({
          participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
          consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
          name: z.string(),
          jurisdiction: z.string().optional(),
          gdprRole: z
            .enum(['controller', 'processor', 'joint_controller'])
            .optional(),
          channelIds: z.array(z.string().min(1).max(128)).optional(),
          fabricIdentityMode: z
            .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
            .optional(),
          onboardingStatus: z.enum(['pending', 'attested', 'revoked']),
          linkAllocationLocked: z.boolean().optional(),
          attestedAt: z.string().datetime({ offset: true }).optional(),
          createdAt: z.string().datetime({ offset: true }),
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
const ParticipantListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
              consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
              name: z.string(),
              jurisdiction: z.string().optional(),
              gdprRole: z
                .enum(['controller', 'processor', 'joint_controller'])
                .optional(),
              channelIds: z.array(z.string().min(1).max(128)).optional(),
              fabricIdentityMode: z
                .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
                .optional(),
              onboardingStatus: z.enum(['pending', 'attested', 'revoked']),
              linkAllocationLocked: z.boolean().optional(),
              attestedAt: z.string().datetime({ offset: true }).optional(),
              createdAt: z.string().datetime({ offset: true }),
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
const ParticipantCreateRequest = z
  .object({
    consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
    name: z.string().min(1).max(200),
    jurisdiction: z.string(),
    gdprRole: z.enum(['controller', 'processor', 'joint_controller']),
    channelIds: z.array(z.string().min(1).max(128)).optional(),
    fabricIdentityMode: z
      .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
      .optional(),
  })
  .passthrough();
const ParticipantResponse = z
  .object({
    data: z
      .object({
        participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
        consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
        name: z.string(),
        jurisdiction: z.string().optional(),
        gdprRole: z
          .enum(['controller', 'processor', 'joint_controller'])
          .optional(),
        channelIds: z.array(z.string().min(1).max(128)).optional(),
        fabricIdentityMode: z
          .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
          .optional(),
        onboardingStatus: z.enum(['pending', 'attested', 'revoked']),
        linkAllocationLocked: z.boolean().optional(),
        attestedAt: z.string().datetime({ offset: true }).optional(),
        createdAt: z.string().datetime({ offset: true }),
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
const ParticipantAttestRequest = z
  .object({
    jurisdiction: z.string(),
    gdprRole: z.enum(['controller', 'processor', 'joint_controller']),
    channelIds: z.array(z.string().min(1).max(128)).optional(),
  })
  .passthrough();
const ParticipantRevokeRequest = z
  .object({ reason: z.string() })
  .partial()
  .passthrough();

export const schemas: any = {
  onboardParticipant_Body,
  attestParticipant_Body,
  ConsortiumId,
  Problem,
  ParticipantId,
  GdprRole,
  ChannelId,
  FabricIdentityMode,
  OnboardingStatus,
  Participant,
  ParticipantListData,
  ResponseMeta,
  ParticipantListResponse,
  ParticipantCreateRequest,
  ParticipantResponse,
  ParticipantAttestRequest,
  ParticipantRevokeRequest,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/participants',
    alias: 'listParticipants',
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
        name: 'onboardingStatus',
        type: 'Query',
        schema: z.enum(['pending', 'attested', 'revoked']).optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  participantId: z
                    .string()
                    .regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
                  consortiumId: z
                    .string()
                    .regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
                  name: z.string(),
                  jurisdiction: z.string().optional(),
                  gdprRole: z
                    .enum(['controller', 'processor', 'joint_controller'])
                    .optional(),
                  channelIds: z.array(z.string().min(1).max(128)).optional(),
                  fabricIdentityMode: z
                    .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
                    .optional(),
                  onboardingStatus: z.enum(['pending', 'attested', 'revoked']),
                  linkAllocationLocked: z.boolean().optional(),
                  attestedAt: z.string().datetime({ offset: true }).optional(),
                  createdAt: z.string().datetime({ offset: true }),
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
    path: '/v1/participants',
    alias: 'onboardParticipant',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: onboardParticipant_Body,
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
            participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
            consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
            name: z.string(),
            jurisdiction: z.string().optional(),
            gdprRole: z
              .enum(['controller', 'processor', 'joint_controller'])
              .optional(),
            channelIds: z.array(z.string().min(1).max(128)).optional(),
            fabricIdentityMode: z
              .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
              .optional(),
            onboardingStatus: z.enum(['pending', 'attested', 'revoked']),
            linkAllocationLocked: z.boolean().optional(),
            attestedAt: z.string().datetime({ offset: true }).optional(),
            createdAt: z.string().datetime({ offset: true }),
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
    path: '/v1/participants/:participantId',
    alias: 'getParticipant',
    requestFormat: 'json',
    parameters: [
      {
        name: 'participantId',
        type: 'Path',
        schema: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
            consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
            name: z.string(),
            jurisdiction: z.string().optional(),
            gdprRole: z
              .enum(['controller', 'processor', 'joint_controller'])
              .optional(),
            channelIds: z.array(z.string().min(1).max(128)).optional(),
            fabricIdentityMode: z
              .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
              .optional(),
            onboardingStatus: z.enum(['pending', 'attested', 'revoked']),
            linkAllocationLocked: z.boolean().optional(),
            attestedAt: z.string().datetime({ offset: true }).optional(),
            createdAt: z.string().datetime({ offset: true }),
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
    path: '/v1/participants/:participantId/attest',
    alias: 'attestParticipant',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: attestParticipant_Body,
      },
      {
        name: 'participantId',
        type: 'Path',
        schema: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
            consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
            name: z.string(),
            jurisdiction: z.string().optional(),
            gdprRole: z
              .enum(['controller', 'processor', 'joint_controller'])
              .optional(),
            channelIds: z.array(z.string().min(1).max(128)).optional(),
            fabricIdentityMode: z
              .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
              .optional(),
            onboardingStatus: z.enum(['pending', 'attested', 'revoked']),
            linkAllocationLocked: z.boolean().optional(),
            attestedAt: z.string().datetime({ offset: true }).optional(),
            createdAt: z.string().datetime({ offset: true }),
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
    ],
  },
  {
    method: 'post',
    path: '/v1/participants/:participantId/revoke',
    alias: 'revokeParticipant',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z
          .object({ reason: z.string() })
          .partial()
          .passthrough()
          .optional(),
      },
      {
        name: 'participantId',
        type: 'Path',
        schema: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            participantId: z.string().regex(/^prt_[0-9A-HJKMNP-TV-Z]{26}$/),
            consortiumId: z.string().regex(/^cns_[0-9A-HJKMNP-TV-Z]{26}$/),
            name: z.string(),
            jurisdiction: z.string().optional(),
            gdprRole: z
              .enum(['controller', 'processor', 'joint_controller'])
              .optional(),
            channelIds: z.array(z.string().min(1).max(128)).optional(),
            fabricIdentityMode: z
              .enum(['x509_scrubbed', 'identity_mixer', 'not_configured'])
              .optional(),
            onboardingStatus: z.enum(['pending', 'attested', 'revoked']),
            linkAllocationLocked: z.boolean().optional(),
            attestedAt: z.string().datetime({ offset: true }).optional(),
            createdAt: z.string().datetime({ offset: true }),
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
