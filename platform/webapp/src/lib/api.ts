const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:4000';

export type AuthSession = {
  mode: 'apiKey' | 'password';
  apiKey?: string;
  accessToken?: string;
  email?: string;
  displayName?: string;
  role?: string;
};

const STORAGE_KEY = 'aliaskeep.session';

export function loadSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession | null) {
  if (typeof window === 'undefined') return;
  if (!session) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function authHeaders(session: AuthSession | null): HeadersInit {
  if (!session) return {};
  if (session.mode === 'apiKey' && session.apiKey) {
    return { 'X-API-Key': session.apiKey };
  }
  if (session.accessToken) {
    return { Authorization: `Bearer ${session.accessToken}` };
  }
  return {};
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
  session?: AuthSession | null
): Promise<T> {
  const s = session === undefined ? loadSession() : session;
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...authHeaders(s),
    ...(init.headers || {}),
  };
  if (init.body && !(headers as Record<string, string>)['Content-Type']) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || body.title || body.message || detail;
    } catch {
      /* ignore */
    }
    throw new Error(`${res.status}: ${detail}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function idempotencyKey(): string {
  return `web_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export { API_BASE };
