/**
 * Process-wide in-memory store for Aliaskeep product domains (local sandbox).
 */

import { ulid } from 'ulid';
import { nowIso, responseMeta } from './sandbox-store.js';

export { nowIso, responseMeta };

export function id(prefix: string): string {
  return `${prefix}_${ulid().toLowerCase()}`;
}

export type VaultRecord = {
  vaultId: string;
  consortiumId: string;
  pseudonymId?: string;
  controllerParticipantId?: string;
  jurisdiction?: string;
  lawfulBasis?: string;
  status: 'active' | 'erased' | 'orphan_review' | 'duplicate_review';
  bindStatus: 'unbound' | 'bound' | 'conflict';
  activeGrantCount: number;
  createdAt: string;
  updatedAt: string;
};

export type LinkGrantRecord = {
  grantId: string;
  vaultId: string;
  participantId: string;
  channelId: string;
  policyId?: string;
  lawfulBasis: string;
  retentionIntent?: string;
  status: 'active' | 'revoked' | 'suspended';
  lastAccessedAt?: string;
  suspensionReason?: string;
  createdAt: string;
  revokedAt?: string;
};

export type LinkPolicyRecord = {
  policyId: string;
  consortiumId: string;
  channelId: string;
  lawfulBasis?: string;
  retentionIntent?: string;
  crossBorder?: boolean;
  approvalStatus: 'draft' | 'pending_counsel' | 'approved' | 'rejected';
  counselNote?: string;
  createdAt: string;
  decidedAt?: string;
};

export type ParticipantRecord = {
  participantId: string;
  consortiumId: string;
  name: string;
  jurisdiction?: string;
  gdprRole?: string;
  channelIds?: string[];
  fabricIdentityMode?: string;
  onboardingStatus: 'pending' | 'attested' | 'revoked';
  linkAllocationLocked: boolean;
  attestedAt?: string;
  createdAt: string;
};

export type ErasureRecord = {
  erasureId: string;
  vaultId: string;
  pseudonymId?: string;
  certificateId?: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'sla_breach';
  erasureReason: string;
  holders: Array<{
    participantId: string;
    status: 'pending' | 'acknowledged' | 'failed' | 'recreation_blocked';
    acknowledgedAt?: string;
    lastNudgedAt?: string;
  }>;
  slaDeadlineAt?: string;
  createdAt: string;
  completedAt?: string;
};

export type CertificateRecord = {
  certificateId: string;
  erasureId?: string;
  vaultId: string;
  pseudonymId?: string;
  anonymisedAt: string;
  proofHash: string;
  recreationBlocked: boolean;
};

export type QuarantineRecord = {
  quarantineId: string;
  scanId: string;
  status: 'held' | 'remediated' | 'waived' | 'rejected';
  confidence: number;
  channelId?: string;
  fieldPath?: string;
  detectedCategories: string[];
  redactedPreview?: string;
  waiverNote?: string;
  createdAt: string;
  resolvedAt?: string;
};

export type ScanRecord = {
  scanId: string;
  decision: 'allow' | 'quarantine' | 'block';
  confidence: number;
  detectedCategories: string[];
  quarantineId?: string;
};

export type FabricProfileRecord = {
  profileId: string;
  participantId: string;
  mspId?: string;
  riskLevel: 'clear' | 'warn' | 'block';
  recommendedPath: 'x509_scrubbed' | 'identity_mixer' | 'blocked';
  attributes: Array<{ attributeName: string; riskLevel: string; reason?: string }>;
  status: 'open' | 'path_required' | 'cleared' | 'blocked';
  createdAt: string;
  updatedAt: string;
};

export type ReportJobRecord = {
  jobId: string;
  packType: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  downloadUrl?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
};

export type DisclosureRecord = {
  version: string;
  published: boolean;
  fields: Array<{ fieldPath: string; storageMode: string; endUserDisclosure?: string }>;
  publishedAt?: string;
};

export const vaults = new Map<string, VaultRecord>();
export const grants = new Map<string, LinkGrantRecord>();
export const policies = new Map<string, LinkPolicyRecord>();
export const participants = new Map<string, ParticipantRecord>();
export const erasures = new Map<string, ErasureRecord>();
export const certificates = new Map<string, CertificateRecord>();
export const quarantine = new Map<string, QuarantineRecord>();
export const scans = new Map<string, ScanRecord>();
export const fabricProfiles = new Map<string, FabricProfileRecord>();
export const reportJobs = new Map<string, ReportJobRecord>();

export const uploadDisclosureState: { current: DisclosureRecord } = {
  current: {
    version: '0.1.0',
    published: false,
    fields: [],
  },
};

export function getUploadDisclosure(): DisclosureRecord {
  return uploadDisclosureState.current;
}

export function setUploadDisclosure(next: DisclosureRecord): DisclosureRecord {
  uploadDisclosureState.current = next;
  return uploadDisclosureState.current;
}

export function envelopeList<T>(items: T[], correlationId?: string) {
  return { data: { items }, ...responseMeta(correlationId) };
}

export function envelopeOne<T>(data: T, correlationId?: string) {
  return { data, ...responseMeta(correlationId) };
}

export function corr(input: Record<string, unknown>): string {
  return String(input.correlationId ?? '');
}

export function asRecord(input: unknown): Record<string, unknown> {
  return (input ?? {}) as Record<string, unknown>;
}

export function str(r: Record<string, unknown>, key: string, fallback = ''): string {
  const v = r[key];
  if (Array.isArray(v)) return v[0] == null ? fallback : String(v[0]);
  if (v == null || v === '') return fallback;
  return String(v);
}

export function pickId(r: Record<string, unknown>, prefix: string): string {
  const v = r.id;
  return typeof v === 'string' && v.length > 0 ? v : id(prefix);
}

export function notFound(): never {
  return null as never;
}

export function toPropagation(erasure: ErasureRecord) {
  const slaDeadlineAt = erasure.slaDeadlineAt ?? erasure.createdAt;
  const breached =
    erasure.status === 'sla_breach' ||
    (erasure.status !== 'completed' && Date.parse(slaDeadlineAt) < Date.now());
  return {
    erasureId: erasure.erasureId,
    slaDeadlineAt,
    slaBreached: breached,
    holders: erasure.holders,
    recreationAttempts: 0,
  };
}

export const DEMO = {
  consortiumId: 'cns_01demo00000000000000000001',
  participantId: 'prt_01demo00000000000000000001',
  vaultId: 'vlt_01demo00000000000000000001',
  erasedVaultId: 'vlt_01demo00000000000000000002',
  pseudonymId: 'psn_01demo00000000000000000001',
  policyId: 'pol_01demo00000000000000000001',
  grantId: 'lnk_01demo00000000000000000001',
  erasureId: 'ers_01demo00000000000000000001',
  certificateId: 'crt_01demo00000000000000000001',
  scanId: 'cls_01demo00000000000000000001',
  quarantineId: 'qtn_01demo00000000000000000001',
  profileId: 'fab_01demo00000000000000000001',
  jobId: 'rpt_01demo00000000000000000001',
} as const;

/** Seed a small demo dataset once. */
let seeded = false;
export function ensureDemoSeed() {
  if (seeded) return;
  seeded = true;
  const now = nowIso();
  const {
    consortiumId,
    participantId,
    vaultId,
    erasedVaultId,
    pseudonymId,
    policyId,
    grantId,
    erasureId,
    certificateId,
    scanId,
    quarantineId,
    profileId,
    jobId,
  } = DEMO;

  participants.set(participantId, {
    participantId,
    consortiumId,
    name: 'Demo Peer Org',
    jurisdiction: 'DE',
    gdprRole: 'controller',
    channelIds: ['trade-finance'],
    fabricIdentityMode: 'x509_scrubbed',
    onboardingStatus: 'attested',
    linkAllocationLocked: false,
    attestedAt: now,
    createdAt: now,
  });

  vaults.set(vaultId, {
    vaultId,
    consortiumId,
    pseudonymId,
    controllerParticipantId: participantId,
    jurisdiction: 'DE',
    lawfulBasis: 'contract',
    status: 'active',
    bindStatus: 'bound',
    activeGrantCount: 1,
    createdAt: now,
    updatedAt: now,
  });

  vaults.set(erasedVaultId, {
    vaultId: erasedVaultId,
    consortiumId,
    pseudonymId: 'psn_01demo00000000000000000002',
    controllerParticipantId: participantId,
    jurisdiction: 'DE',
    lawfulBasis: 'contract',
    status: 'erased',
    bindStatus: 'bound',
    activeGrantCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  policies.set(policyId, {
    policyId,
    consortiumId,
    channelId: 'trade-finance',
    lawfulBasis: 'contract',
    retentionIntent: '7y',
    crossBorder: true,
    approvalStatus: 'approved',
    createdAt: now,
    decidedAt: now,
  });

  policies.set('pol_01demo00000000000000000002', {
    policyId: 'pol_01demo00000000000000000002',
    consortiumId,
    channelId: 'healthcare',
    lawfulBasis: 'consent',
    retentionIntent: '5y',
    crossBorder: true,
    approvalStatus: 'pending_counsel',
    createdAt: now,
  });

  grants.set(grantId, {
    grantId,
    vaultId,
    participantId,
    channelId: 'trade-finance',
    policyId,
    lawfulBasis: 'contract',
    retentionIntent: '7y',
    status: 'active',
    createdAt: now,
  });

  erasures.set(erasureId, {
    erasureId,
    vaultId: erasedVaultId,
    pseudonymId: 'psn_01demo00000000000000000002',
    certificateId,
    status: 'completed',
    erasureReason: 'Demo subject-access withdrawal',
    holders: [
      {
        participantId,
        status: 'acknowledged',
        acknowledgedAt: now,
      },
    ],
    slaDeadlineAt: now,
    createdAt: now,
    completedAt: now,
  });

  certificates.set(certificateId, {
    certificateId,
    erasureId,
    vaultId: erasedVaultId,
    pseudonymId: 'psn_01demo00000000000000000002',
    anonymisedAt: now,
    proofHash: `sha256:sandbox:${erasureId}`,
    recreationBlocked: true,
  });

  scans.set(scanId, {
    scanId,
    decision: 'quarantine',
    confidence: 0.91,
    detectedCategories: ['email'],
    quarantineId,
  });

  quarantine.set(quarantineId, {
    quarantineId,
    scanId,
    status: 'held',
    confidence: 0.91,
    channelId: 'trade-finance',
    fieldPath: 'comment.email',
    detectedCategories: ['email'],
    redactedPreview: 'Contact ***@***.***',
    createdAt: now,
  });

  fabricProfiles.set(profileId, {
    profileId,
    participantId,
    mspId: 'Org1MSP',
    riskLevel: 'warn',
    recommendedPath: 'x509_scrubbed',
    attributes: [
      { attributeName: 'OU', riskLevel: 'clear' },
      { attributeName: 'CN', riskLevel: 'warn', reason: 'Common name may encode a natural person.' },
    ],
    status: 'open',
    createdAt: now,
    updatedAt: now,
  });

  reportJobs.set(jobId, {
    jobId,
    packType: 'link_audit',
    status: 'done',
    downloadUrl: 'https://sandbox.aliaskeep.local/exports/demo-link-audit.json',
    createdAt: now,
    completedAt: now,
  });

  setUploadDisclosure({
    version: '0.1.0',
    published: true,
    fields: [
      { fieldPath: 'comment', storageMode: 'off_chain_vault', endUserDisclosure: 'Comments stay off-chain.' },
      { fieldPath: 'attachment', storageMode: 'hash_only', endUserDisclosure: 'Only content hash is endorsed.' },
    ],
    publishedAt: now,
  });
}
