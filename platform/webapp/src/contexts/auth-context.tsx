'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  apiFetch,
  loadSession,
  saveSession,
  type AuthSession,
} from '@/lib/api';

type AuthContextValue = {
  session: AuthSession | null;
  ready: boolean;
  signInWithApiKey: (apiKey: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  const signInWithApiKey = useCallback(async (apiKey: string) => {
    const next: AuthSession = {
      mode: 'apiKey',
      apiKey,
      displayName: 'API key operator',
      role: 'admin',
    };
    await apiFetch('/v0/auth/me', {}, next);
    saveSession(next);
    setSession(next);
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const result = await apiFetch<{
      data: {
        accessToken: string;
        operator?: { email?: string; displayName?: string; role?: string };
      };
    }>('/v0/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, null);
    const next: AuthSession = {
      mode: 'password',
      accessToken: result.data.accessToken,
      email: result.data.operator?.email ?? email,
      displayName: result.data.operator?.displayName,
      role: result.data.operator?.role,
    };
    saveSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    saveSession(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, ready, signInWithApiKey, signInWithPassword, signOut }),
    [session, ready, signInWithApiKey, signInWithPassword, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth requires AuthProvider');
  return ctx;
}
