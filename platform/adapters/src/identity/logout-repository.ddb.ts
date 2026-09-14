/**
 * LogoutRepository — sandbox no-op logout (204).
 */

import type { LogoutRepository } from '@aliaskeep/services/identity';
import { responseMeta } from '../_shared/sandbox-store.js';
import { refreshSessions } from './login-repository.ddb.js';

export class LogoutRepositoryDdb implements LogoutRepository {
  constructor(private readonly dynamoClient: any) {}

  async operatorLogout(
    input: Parameters<LogoutRepository['operatorLogout']>[0],
  ): Promise<Awaited<ReturnType<LogoutRepository['operatorLogout']>>> {
    const raw = (input ?? {}) as Record<string, unknown>;
    const correlationId = String(raw.correlationId ?? '');
    refreshSessions.clear();
    return {
      data: { loggedOut: true },
      ...responseMeta(correlationId),
    };
  }
}
