'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import clsx from 'clsx';
import { KeyRound, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const NAV = [
  { href: '/', label: 'Architect home' },
  { href: '/vaults', label: 'Identity vaults' },
  { href: '/links', label: 'Link grants' },
  { href: '/erasures', label: 'Logical erasures' },
  { href: '/quarantine', label: 'Classification' },
  { href: '/participants', label: 'Participants' },
  { href: '/fabric', label: 'Fabric advisory' },
  { href: '/counsel', label: 'Counsel inbox' },
  { href: '/propagation', label: 'Revocation monitor' },
  { href: '/reporting', label: 'Reporting' },
  { href: '/disclosure', label: 'Upload disclosure' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready, signOut } = useAuth();
  const isLogin = pathname === '/login';

  useEffect(() => {
    if (!ready || isLogin) return;
    if (!session) router.replace('/login');
  }, [ready, session, isLogin, router]);

  if (isLogin) return <>{children}</>;
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-graphite">
        Loading console…
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="lock-grid flex w-64 shrink-0 flex-col border-r border-white/5 bg-charcoal-900/90">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-4">
          <KeyRound className="h-5 w-5 text-brand" />
          <div>
            <div className="font-display text-sm font-semibold tracking-wide text-brand">
              Aliaskeep
            </div>
            <div className="text-[11px] text-graphite">Govern the link</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {NAV.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'block rounded-md px-3 py-2 text-sm transition',
                  active
                    ? 'bg-link/15 text-link'
                    : 'text-ink/80 hover:bg-white/5 hover:text-ink'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/5 p-3 text-xs text-graphite">
          <div className="mb-2 truncate">
            {session.displayName || session.email || 'Operator'}
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.replace('/login');
            }}
            className="inline-flex items-center gap-1 text-ink/70 hover:text-coral"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
