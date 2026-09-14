/**
 * ID Generator Service Implementation — Aliaskeep prefixes.
 */

import type { DomainCode } from '@aliaskeep/core/_shared/helpers';
import { DOMAIN_PREFIX_MAP, isValidDomainId } from '@aliaskeep/core';
import { ulid } from 'ulid';
import type { IdGeneratorService } from '@aliaskeep/services/_shared';

export function generateIdWithPrefix(prefix: string): string {
  if (!prefix || prefix.length !== 3 || !/^[a-z]{3}$/.test(prefix)) {
    throw new Error(
      `Invalid domain prefix: "${prefix}". Must be exactly 3 lowercase letters.`
    );
  }
  const id = `${prefix}_${ulid().toLowerCase()}`;
  if (!isValidDomainId(id)) {
    throw new Error(`Generated ID "${id}" failed validation.`);
  }
  return id;
}

export class DefaultIdGeneratorService implements IdGeneratorService {
  tntId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.tenant);
  }
  keyId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.apiKey);
  }
  idnId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.identity);
  }
  autId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.auth);
  }
  vltId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.vault);
  }
  lnkId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.linkGrant);
  }
  ersId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.erasure);
  }
  clsId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.classification);
  }
  prtId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.participant);
  }
  fabId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.fabric);
  }
  rptId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.reporting);
  }
  polId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.linkPolicy);
  }
  crtId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.certificate);
  }
  qtnId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.quarantine);
  }
  psnId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.pseudonym);
  }
  cnsId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.consortium);
  }
  generateIdForDomain(domainCode: DomainCode): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP[domainCode]);
  }
}

let idGeneratorService: DefaultIdGeneratorService | null = null;

export function getIdGeneratorService(): DefaultIdGeneratorService {
  if (!idGeneratorService) {
    idGeneratorService = new DefaultIdGeneratorService();
  }
  return idGeneratorService;
}
