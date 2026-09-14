/**
 * Shared sandbox helpers for generated DDB stubs.
 */
import {
  ensureDemoSeed,
  envelopeList,
  envelopeOne,
  corr,
  id,
  nowIso,
  vaults,
  grants,
  policies,
  participants,
  erasures,
  certificates,
  quarantine,
  scans,
  fabricProfiles,
  reportJobs,
  getUploadDisclosure,
  setUploadDisclosure,
  type DisclosureRecord,
} from './product-sandbox-store.js';

export function sandbox(method: string, input: unknown): unknown {
  ensureDemoSeed();
  const raw = (input ?? {}) as Record<string, unknown>;
  const correlationId = corr(raw);

  switch (method) {
    case 'listIdentityVaults':
      return envelopeList(Array.from(vaults.values()), correlationId);
    case 'createIdentityVault': {
      const vaultId = String(raw.id ?? raw.vaultId ?? id('vlt'));
      const rec = {
        vaultId,
        consortiumId: String(raw.consortiumId),
        pseudonymId: raw.pseudonymId ? String(raw.pseudonymId) : undefined,
        controllerParticipantId: raw.controllerParticipantId
          ? String(raw.controllerParticipantId)
          : undefined,
        jurisdiction: raw.jurisdiction ? String(raw.jurisdiction) : undefined,
        lawfulBasis: raw.lawfulBasis ? String(raw.lawfulBasis) : undefined,
        status: 'active' as const,
        bindStatus: raw.pseudonymId ? ('bound' as const) : ('unbound' as const),
        activeGrantCount: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      vaults.set(vaultId, rec);
      return envelopeOne(rec, correlationId);
    }
    case 'getIdentityVault': {
      const v = vaults.get(String(raw.vaultId));
      if (!v) throw new Error('Vault not found');
      return envelopeOne(v, correlationId);
    }
    case 'bindVaultPseudonym': {
      const v = vaults.get(String(raw.vaultId));
      if (!v) throw new Error('Vault not found');
      v.pseudonymId = String(raw.pseudonymId);
      v.bindStatus = 'bound';
      v.updatedAt = nowIso();
      return envelopeOne(v, correlationId);
    }
    case 'flagVaultDuplicate': {
      const v = vaults.get(String(raw.vaultId));
      if (!v) throw new Error('Vault not found');
      v.status = 'duplicate_review';
      v.updatedAt = nowIso();
      return envelopeOne(v, correlationId);
    }
    case 'listLinkGrants':
      return envelopeList(Array.from(grants.values()), correlationId);
    case 'allocateLinkGrant': {
      const grantId = String(raw.id ?? raw.grantId ?? id('lnk'));
      const rec = {
        grantId,
        vaultId: String(raw.vaultId),
        participantId: String(raw.participantId),
        channelId: String(raw.channelId),
        policyId: raw.policyId ? String(raw.policyId) : undefined,
        lawfulBasis: String(raw.lawfulBasis ?? 'contract'),
        retentionIntent: raw.retentionIntent ? String(raw.retentionIntent) : undefined,
        status: 'active' as const,
        createdAt: nowIso(),
      };
      grants.set(grantId, rec);
      return envelopeOne(rec, correlationId);
    }
    case 'getLinkGrant': {
      const g = grants.get(String(raw.grantId));
      if (!g) throw new Error('Grant not found');
      return envelopeOne(g, correlationId);
    }
    case 'revokeLinkGrant': {
      const g = grants.get(String(raw.grantId));
      if (!g) throw new Error('Grant not found');
      g.status = 'revoked';
      g.revokedAt = nowIso();
      return envelopeOne(g, correlationId);
    }
    case 'suspendLinkGrant': {
      const g = grants.get(String(raw.grantId));
      if (!g) throw new Error('Grant not found');
      g.status = 'suspended';
      g.suspensionReason = String(raw.reason ?? 'suspended');
      return envelopeOne(g, correlationId);
    }
    case 'restoreLinkGrant': {
      const g = grants.get(String(raw.grantId));
      if (!g) throw new Error('Grant not found');
      g.status = 'active';
      g.suspensionReason = undefined;
      return envelopeOne(g, correlationId);
    }
    case 'listLinkPolicies':
      return envelopeList(Array.from(policies.values()), correlationId);
    case 'createLinkPolicy': {
      const policyId = String(raw.id ?? raw.policyId ?? id('pol'));
      const rec = {
        policyId,
        consortiumId: String(raw.consortiumId),
        channelId: String(raw.channelId),
        lawfulBasis: raw.lawfulBasis ? String(raw.lawfulBasis) : undefined,
        retentionIntent: raw.retentionIntent ? String(raw.retentionIntent) : undefined,
        crossBorder: Boolean(raw.crossBorder),
        approvalStatus:
          raw.submitToCounsel === false
            ? ('draft' as const)
            : ('pending_counsel' as const),
        createdAt: nowIso(),
      };
      policies.set(policyId, rec);
      return envelopeOne(rec, correlationId);
    }
    case 'approveLinkPolicy': {
      const p = policies.get(String(raw.policyId));
      if (!p) throw new Error('Policy not found');
      p.approvalStatus = 'approved';
      p.decidedAt = nowIso();
      p.counselNote = raw.note ? String(raw.note) : p.counselNote;
      return envelopeOne(p, correlationId);
    }
    case 'rejectLinkPolicy': {
      const p = policies.get(String(raw.policyId));
      if (!p) throw new Error('Policy not found');
      p.approvalStatus = 'rejected';
      p.decidedAt = nowIso();
      p.counselNote = raw.note ? String(raw.note) : p.counselNote;
      return envelopeOne(p, correlationId);
    }
    case 'listLogicalErasures':
      return envelopeList(Array.from(erasures.values()), correlationId);
    case 'executeLogicalErasure': {
      const erasureId = String(raw.id ?? raw.erasureId ?? id('ers'));
      const vaultId = String(raw.vaultId);
      const certId = id('crt');
      const rec = {
        erasureId,
        vaultId,
        status: 'completed' as const,
        erasureReason: String(raw.erasureReason ?? 'logical erasure'),
        certificateId: certId,
        holders: [...participants.values()].map((p) => ({
          participantId: p.participantId,
          status: 'pending' as const,
        })),
        slaDeadlineAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: nowIso(),
        completedAt: nowIso(),
      };
      erasures.set(erasureId, rec);
      certificates.set(certId, {
        certificateId: certId,
        erasureId,
        vaultId,
        anonymisedAt: nowIso(),
        proofHash: `sha256:${erasureId.slice(-12)}`,
        recreationBlocked: true,
      });
      const v = vaults.get(vaultId);
      if (v) {
        v.status = 'erased';
      }
      for (const g of grants.values()) {
        if (g.vaultId === vaultId) {
          g.status = 'revoked';
          g.revokedAt = nowIso();
        }
      }
      return envelopeOne(rec, correlationId);
    }
    case 'getLogicalErasure': {
      const e = erasures.get(String(raw.erasureId));
      if (!e) throw new Error('Erasure not found');
      return envelopeOne(e, correlationId);
    }
    case 'getErasureCertificate': {
      const c = certificates.get(String(raw.certificateId));
      if (!c) throw new Error('Certificate not found');
      return envelopeOne(c, correlationId);
    }
    case 'getErasurePropagation': {
      const e = erasures.get(String(raw.erasureId));
      return envelopeOne(
        {
          erasureId: String(raw.erasureId),
          slaDeadlineAt: e?.slaDeadlineAt ?? nowIso(),
          slaBreached: e?.status === 'sla_breach',
          holders: e?.holders ?? [],
          recreationAttempts: 0,
        },
        correlationId
      );
    }
    case 'nudgeErasurePropagation': {
      const e = erasures.get(String(raw.erasureId));
      if (!e) throw new Error('Erasure not found');
      const pid = String(raw.participantId);
      e.holders = e.holders.map((h) =>
        h.participantId === pid ? { ...h, lastNudgedAt: nowIso() } : h
      );
      return envelopeOne(
        {
          erasureId: e.erasureId,
          slaDeadlineAt: e.slaDeadlineAt ?? nowIso(),
          slaBreached: false,
          holders: e.holders,
          recreationAttempts: 0,
        },
        correlationId
      );
    }
    case 'listQuarantineItems':
      return envelopeList(Array.from(quarantine.values()), correlationId);
    case 'getQuarantineItem': {
      const q = quarantine.get(String(raw.quarantineId));
      if (!q) throw new Error('Quarantine not found');
      return envelopeOne(q, correlationId);
    }
    case 'submitClassificationScan': {
      const scanId = String(raw.id ?? id('cls'));
      const qid = id('qtn');
      const scan = {
        scanId,
        decision: 'quarantine' as const,
        confidence: 0.62,
        detectedCategories: ['identifier'],
        quarantineId: qid,
      };
      scans.set(scanId, scan);
      quarantine.set(qid, {
        quarantineId: qid,
        scanId,
        status: 'held',
        confidence: 0.62,
        channelId: raw.channelId ? String(raw.channelId) : undefined,
        fieldPath: raw.fieldPath ? String(raw.fieldPath) : undefined,
        detectedCategories: ['identifier'],
        redactedPreview: '[redacted]',
        createdAt: nowIso(),
      });
      return envelopeOne(scan, correlationId);
    }
    case 'remediateQuarantineItem':
    case 'waiveQuarantineItem':
    case 'rejectQuarantineItem': {
      const q = quarantine.get(String(raw.quarantineId));
      if (!q) throw new Error('Quarantine not found');
      q.status =
        method === 'remediateQuarantineItem'
          ? 'remediated'
          : method === 'waiveQuarantineItem'
            ? 'waived'
            : 'rejected';
      q.resolvedAt = nowIso();
      if (raw.riskAcceptance) q.waiverNote = String(raw.riskAcceptance);
      return envelopeOne(q, correlationId);
    }
    case 'getUploadDisclosure':
      return envelopeOne(getUploadDisclosure(), correlationId);
    case 'publishUploadDisclosure': {
      const next = setUploadDisclosure({
        version: String(raw.version ?? '0.1.0'),
        published: true,
        fields:
          (raw.fields as DisclosureRecord['fields']) ??
          getUploadDisclosure().fields,
        publishedAt: nowIso(),
      });
      return envelopeOne(next, correlationId);
    }
    case 'listParticipants':
      return envelopeList(Array.from(participants.values()), correlationId);
    case 'onboardParticipant': {
      const participantId = String(raw.id ?? raw.participantId ?? id('prt'));
      const rec = {
        participantId,
        consortiumId: String(raw.consortiumId),
        name: String(raw.name),
        jurisdiction: raw.jurisdiction ? String(raw.jurisdiction) : undefined,
        gdprRole: raw.gdprRole ? String(raw.gdprRole) : undefined,
        channelIds: (raw.channelIds as string[]) ?? [],
        fabricIdentityMode: raw.fabricIdentityMode
          ? String(raw.fabricIdentityMode)
          : undefined,
        onboardingStatus: 'pending' as const,
        linkAllocationLocked: true,
        createdAt: nowIso(),
      };
      participants.set(participantId, rec);
      return envelopeOne(rec, correlationId);
    }
    case 'getParticipant': {
      const p = participants.get(String(raw.participantId));
      if (!p) throw new Error('Participant not found');
      return envelopeOne(p, correlationId);
    }
    case 'attestParticipant': {
      const p = participants.get(String(raw.participantId));
      if (!p) throw new Error('Participant not found');
      p.onboardingStatus = 'attested';
      p.linkAllocationLocked = false;
      p.jurisdiction = String(raw.jurisdiction ?? p.jurisdiction ?? '');
      p.gdprRole = String(raw.gdprRole ?? p.gdprRole ?? '');
      p.attestedAt = nowIso();
      return envelopeOne(p, correlationId);
    }
    case 'revokeParticipant': {
      const p = participants.get(String(raw.participantId));
      if (!p) throw new Error('Participant not found');
      p.onboardingStatus = 'revoked';
      p.linkAllocationLocked = true;
      return envelopeOne(p, correlationId);
    }
    case 'listFabricIdentityProfiles':
      return envelopeList(Array.from(fabricProfiles.values()), correlationId);
    case 'submitFabricEnrollmentScan': {
      const profileId = String(raw.id ?? id('fab'));
      const rec = {
        profileId,
        participantId: String(raw.participantId),
        mspId: raw.mspId ? String(raw.mspId) : undefined,
        riskLevel: 'warn' as const,
        recommendedPath: 'identity_mixer' as const,
        attributes: ((raw.attributes as Array<{ attributeName: string }>) ?? []).map(
          (a) => ({
            attributeName: a.attributeName,
            riskLevel: 'warn',
            reason: 'possible PD',
          })
        ),
        status: 'open' as const,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      fabricProfiles.set(profileId, rec);
      return envelopeOne(rec, correlationId);
    }
    case 'getFabricIdentityProfile': {
      const p = fabricProfiles.get(String(raw.profileId));
      if (!p) throw new Error('Profile not found');
      return envelopeOne(p, correlationId);
    }
    case 'requireFabricIdentityPath': {
      const p = fabricProfiles.get(String(raw.profileId));
      if (!p) throw new Error('Profile not found');
      p.recommendedPath = String(raw.requiredPath ?? 'identity_mixer') as
        | 'x509_scrubbed'
        | 'identity_mixer'
        | 'blocked';
      p.status = 'path_required';
      p.updatedAt = nowIso();
      return envelopeOne(p, correlationId);
    }
    case 'getLinkAuditReport':
      return envelopeOne(
        {
          period: String(raw.period ?? 'last_30d'),
          activeGrants: [...grants.values()].filter((g) => g.status === 'active')
            .length,
          erasuresCompleted: [...erasures.values()].filter(
            (e) => e.status === 'completed'
          ).length,
          quarantinedScans: [...quarantine.values()].filter(
            (q) => q.status === 'held'
          ).length,
          suspendedGrants: [...grants.values()].filter(
            (g) => g.status === 'suspended'
          ).length,
          recreationAttemptsBlocked: 0,
        },
        correlationId
      );
    case 'listReportExportJobs':
      return envelopeList(Array.from(reportJobs.values()), correlationId);
    case 'createReportExportJob': {
      const jobId = String(raw.id ?? id('rpt'));
      const rec = {
        jobId,
        packType: String(raw.packType ?? 'counsel_pack'),
        status: 'done' as const,
        downloadUrl: `https://aliaskeep.local/exports/${jobId}`,
        createdAt: nowIso(),
        completedAt: nowIso(),
      };
      reportJobs.set(jobId, rec);
      return envelopeOne(rec, correlationId);
    }
    case 'getReportExportJob': {
      const j = reportJobs.get(String(raw.jobId));
      if (!j) throw new Error('Job not found');
      return envelopeOne(j, correlationId);
    }
    case 'getArchitectHomeSummary':
      return envelopeOne(
        {
          liveLinkCount: [...grants.values()].filter((g) => g.status === 'active')
            .length,
          vaultCount: vaults.size,
          erasureInFlight: [...erasures.values()].filter(
            (e) => e.status !== 'completed'
          ).length,
          erasureSlaAtRisk: [...erasures.values()].filter(
            (e) => e.status === 'sla_breach'
          ).length,
          quarantineBacklog: [...quarantine.values()].filter(
            (q) => q.status === 'held'
          ).length,
          fabricRiskOpen: [...fabricProfiles.values()].filter(
            (p) => p.riskLevel !== 'clear'
          ).length,
          alerts: [],
        },
        correlationId
      );
    default:
      return envelopeOne({ ...raw }, correlationId);
  }
}
