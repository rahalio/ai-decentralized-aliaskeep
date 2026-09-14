/**
 * IdGeneratorService Port — Aliaskeep domain prefixes.
 */

import type { DomainCode } from '@aliaskeep/core/_shared/helpers';

export interface IdGeneratorService {
  tntId(): string;
  keyId(): string;
  idnId(): string;
  autId(): string;
  vltId(): string;
  lnkId(): string;
  ersId(): string;
  clsId(): string;
  prtId(): string;
  fabId(): string;
  rptId(): string;
  polId(): string;
  crtId(): string;
  qtnId(): string;
  psnId(): string;
  cnsId(): string;
  generateIdForDomain(domainCode: DomainCode): string;
}
